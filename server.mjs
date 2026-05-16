// server.mjs — Zen-Gamer Backend API (Neon PostgreSQL)
// Run with: node server.mjs
import express from 'express';
import cors from 'cors';
import https from 'https';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const PORT = 3002;
const JWT_SECRET = 'ZEN_GAMER_V0ID_S3CR3T_K3Y'; // Change in production

// ---------- ENV ----------
let geminiKey = '';
let databaseUrl = '';
try {
  const raw = readFileSync(join(__dir, '.env'), 'utf8');
  geminiKey = raw.match(/VITE_GEMINI_KEY=(.+)/)?.[1]?.trim() ?? '';
  databaseUrl = raw.match(/DATABASE_URL=(.+)/)?.[1]?.trim() ?? '';
} catch {}

if (!databaseUrl) { console.error('DATABASE_URL not found in .env'); process.exit(1); }

// ---------- DATABASE ----------
const sql = neon(databaseUrl);

async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      avatar TEXT DEFAULT '',
      rank TEXT DEFAULT 'OPERATOR',
      bio TEXT DEFAULT '',
      balance REAL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'BOOSTING',
      region TEXT DEFAULT 'GLOBAL',
      tag TEXT DEFAULT '',
      basic_price REAL DEFAULT 0,
      pro_price REAL DEFAULT 0,
      elite_price REAL DEFAULT 0,
      basic_name TEXT DEFAULT 'BASIC',
      pro_name TEXT DEFAULT 'PRO',
      elite_name TEXT DEFAULT 'ELITE',
      per_unit TEXT DEFAULT '/session',
      features JSONB DEFAULT '[]',
      images JSONB DEFAULT '[]',
      icon TEXT DEFAULT '🎮',
      status TEXT DEFAULT 'ACTIVE',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL REFERENCES users(id),
      seller_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL REFERENCES conversations(id),
      sender_id TEXT NOT NULL REFERENCES users(id),
      text TEXT NOT NULL,
      read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      buyer_id TEXT NOT NULL REFERENCES users(id),
      product_id TEXT NOT NULL REFERENCES products(id),
      tier TEXT DEFAULT 'PRO',
      status TEXT DEFAULT 'PENDING',
      total REAL DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'INFO',
      read BOOLEAN DEFAULT FALSE,
      link TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;


  // Migration: add missing columns if not present (idempotent)
  try { await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS balance REAL DEFAULT 0`; } catch (e) {}
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS tiers JSONB DEFAULT '[]'`; } catch (e) {}
  // Data migration: if tiers is empty, populate from legacy columns
  try {
    await sql`
      UPDATE products 
      SET tiers = jsonb_build_array(
        jsonb_build_object('name', basic_name, 'price', basic_price),
        jsonb_build_object('name', pro_name, 'price', pro_price),
        jsonb_build_object('name', elite_name, 'price', elite_price)
      )
      WHERE tiers IS NULL OR tiers = '[]'::jsonb
    `;
  } catch (e) {}

  console.log('✓ Tables ready');
}

async function seedDb() {
  const userCount = await sql`SELECT COUNT(*) as c FROM users`;
  if (Number(userCount[0].c) === 0) {
    const hash = bcrypt.hashSync('password123', 10);
    const demoUsers = [
      { id: randomUUID(), username: 'Viper_Protocol', email: 'viper@zen-gamer.com', rank: 'MASTER' },
      { id: randomUUID(), username: 'Zen_Support', email: 'support@zen-gamer.com', rank: 'ARCHITECT' },
      { id: randomUUID(), username: 'Alex_Vortex', email: 'alex@zen-gamer.com', rank: 'OPERATOR' },
      { id: randomUUID(), username: 'Root_Admin', email: 'admin@zen-gamer.com', rank: 'ADMIN' },
    ];

    for (const u of demoUsers) {
      await sql`INSERT INTO users (id, username, email, password, rank) VALUES (${u.id}, ${u.username}, ${u.email}, ${hash}, ${u.rank})`;
    }
    console.log('✓ Demo users seeded');
  }

  const demoUsers = await sql`SELECT id FROM users ORDER BY created_at ASC LIMIT 3`;
  if (demoUsers.length < 3) return; // Should have been seeded above

  const seedProducts = [
    { title: 'Asus - P310 TX Mouse White', desc: 'Wireless dual-mode (2.4GHz/Bluetooth), 232h battery life, 62g lightweight design, 6 programmable buttons, PBT antimicrobial coating.', cat: 'Gear', price: 140000, tag: 'NEW', icon: '🖱️', userId: demoUsers[1].id, img: 'https://www.hitech.mn/_next/image?url=https%3A%2F%2Fapi.hitech.mn%2Fuploads%2Fimages%2F2024%2F10%2F15%2F787e9140-54ec-4623-86f7-b76924840b54.webp&w=1920&q=75' },
    { title: 'Razer BlackWidow V4 Pro 75', desc: 'TRUE 4K Hz Wireless & Bluetooth 5.1, Hot-swappable design, OLED display with command dial, Gasket-mounted for optimized typing experience.', cat: 'Gear', price: 850000, tag: 'PREMIUM', icon: '⌨️', userId: demoUsers[1].id, img: 'https://www.hitech.mn/_next/image?url=https%3A%2F%2Fapi.hitech.mn%2Fuploads%2Fimages%2F2024%2F9%2F2%2F6718a383-7186-455b-801e-c2550cc6d8d6.webp&w=1920&q=75' },
    { title: 'AOC - 25G4K 420Hz Monitor', desc: '24-inch gaming monitor with an ultra-high 420Hz refresh rate, designed for competitive eSports.', cat: 'Gear', price: 1000000, tag: 'HOT', icon: '🖥️', userId: demoUsers[1].id, img: 'https://www.hitech.mn/_next/image?url=https%3A%2F%2Fapi.hitech.mn%2Fuploads%2Fimages%2F2024%2F10%2F18%2F8a176884-638e-49b9-8798-2947113190a6.webp&w=1920&q=75' },
    { title: 'AOC - 610Hz Gaming Monitor', desc: '610Hz refresh rate, TN eSports Panel, 0.5ms response time, G-Sync compatible, 500 nits brightness, FHD resolution.', cat: 'Gear', price: 3500000, tag: 'ULTIMATE', icon: '🖥️', userId: demoUsers[1].id, img: 'https://www.hitech.mn/_next/image?url=https%3A%2F%2Fapi.hitech.mn%2Fuploads%2Fimages%2F2024%2F10%2F18%2F53a1a542-f855-4034-8c0c-ef9258276fbe.webp&w=1920&q=75' },
    { title: 'Elite Rank Mastery', desc: 'One-on-one session with top 100 global players to refine your tactical awareness.', cat: 'Coaching', price: 155000, tag: 'FEATURED', icon: '🎯', userId: demoUsers[0].id },
    { title: 'Plat to Diamond Jump', desc: 'Rapid rank advancement with 100% win rate guarantee and secure VPN usage.', cat: 'Boosting', price: 305000, tag: 'HOT', icon: '⚡', userId: demoUsers[0].id },
    { title: 'Focus-Zen Nootropic', desc: 'Clean energy and heightened focus without the crash. Pharmaceutical grade.', cat: 'Supplements', price: 135000, tag: '', icon: '💊', userId: demoUsers[2].id },
  ];

  for (const p of seedProducts) {
    // Check if product exists by title to avoid duplicates if re-seeding
    const exists = await sql`SELECT id FROM products WHERE title = ${p.title}`;
    if (exists.length > 0) continue;

    await sql`INSERT INTO products (id, user_id, title, description, category, pro_price, tag, icon, images) 
      VALUES (${randomUUID()}, ${p.userId}, ${p.title}, ${p.desc}, ${p.cat}, ${p.price}, ${p.tag}, ${p.icon}, ${JSON.stringify(p.img ? [p.img] : [])})`;
  }

  console.log('✓ Database seeded with demo data');
}

// ---------- APP ----------
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Uploads directory
const uploadsDir = join(__dir, 'uploads');
if (!existsSync(uploadsDir)) mkdirSync(uploadsDir);
const upload = multer({ dest: uploadsDir });

// ---------- HELPERS ----------
async function notify(userId, title, message, type = 'INFO', link = '') {
  try {
    const id = randomUUID();
    await sql`INSERT INTO notifications (id, user_id, title, message, type, link) VALUES (${id}, ${userId}, ${title}, ${message}, ${type}, ${link})`;
  } catch (e) {
    console.error('Notification failed:', e);
  }
}

// ---------- AUTH MIDDLEWARE ----------

function auth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

async function adminAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const rows = await sql`SELECT rank FROM users WHERE id = ${decoded.id}`;
    if (rows.length === 0 || rows[0].rank !== 'ADMIN') {
      return res.status(403).json({ error: 'Administrative clearance required' });
    }
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}


// ---------- AUTH ROUTES ----------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const existing = await sql`SELECT id FROM users WHERE email = ${email} OR username = ${username}`;
    if (existing.length > 0) return res.status(409).json({ error: 'User already exists' });

    const id = randomUUID();
    const hash = bcrypt.hashSync(password, 10);
    await sql`INSERT INTO users (id, username, email, password) VALUES (${id}, ${username}, ${email}, ${hash})`;

    const token = jwt.sign({ id, username, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, username, email, rank: 'OPERATOR' } });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const rows = await sql`SELECT * FROM users WHERE email = ${email} OR username = ${email}`;
    const user = rows[0];
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      rank: user.rank, 
      avatar: user.avatar, 
      bio: user.bio
    } });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, username } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    let user;
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    
    if (existing.length > 0) {
      user = existing[0];
    } else {
      const id = randomUUID();
      // Ensure unique username
      let finalUsername = username || email.split('@')[0];
      const nameCheck = await sql`SELECT id FROM users WHERE username = ${finalUsername}`;
      if (nameCheck.length > 0) {
        finalUsername = `${finalUsername}_${Math.floor(Math.random() * 1000)}`;
      }

      await sql`INSERT INTO users (id, username, email, password, rank) VALUES (${id}, ${finalUsername}, ${email}, 'GOOGLE_AUTH', 'OPERATOR')`;
      const rows = await sql`SELECT * FROM users WHERE id = ${id}`;
      user = rows[0];
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      rank: user.rank, 
      avatar: user.avatar, 
      bio: user.bio,
      balance: user.balance ?? 0
    } });
  } catch (e) {
    console.error('Google Auth Error Details:', e);
    res.status(500).json({ error: e.message || 'Server error during Google auth' });
  }
});



app.get('/api/users/:id', async (req, res) => {
  try {
    const rows = await sql`SELECT id, username, rank, avatar, bio, created_at FROM users WHERE id = ${req.params.id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (e) {
    console.error('API Error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    const rows = await sql`SELECT id, username, email, rank, avatar, bio, balance, created_at FROM users WHERE id = ${req.user.id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

// ---------- PRODUCTS ----------
app.get('/api/products', async (req, res) => {
  try {
    const { category, search } = req.query;
    let rows;

    if (category && search) {
      rows = await sql`SELECT p.*, u.id as seller_id, u.username as seller_name, u.rank as seller_rank 
        FROM products p JOIN users u ON p.user_id = u.id 
        WHERE p.status = 'ACTIVE' AND p.category = ${category} AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
        ORDER BY p.created_at DESC LIMIT 50`;
    } else if (category) {
      rows = await sql`SELECT p.*, u.id as seller_id, u.username as seller_name, u.rank as seller_rank 
        FROM products p JOIN users u ON p.user_id = u.id 
        WHERE p.status = 'ACTIVE' AND p.category = ${category}
        ORDER BY p.created_at DESC LIMIT 50`;
    } else if (search) {
      rows = await sql`SELECT p.*, u.id as seller_id, u.username as seller_name, u.rank as seller_rank 
        FROM products p JOIN users u ON p.user_id = u.id 
        WHERE p.status = 'ACTIVE' AND (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'})
        ORDER BY p.created_at DESC LIMIT 50`;
    } else {
      rows = await sql`SELECT p.*, u.id as seller_id, u.username as seller_name, u.rank as seller_rank 
        FROM products p JOIN users u ON p.user_id = u.id 
        WHERE p.status = 'ACTIVE'
        ORDER BY p.created_at DESC LIMIT 50`;
    }

    res.json(rows);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const rows = await sql`SELECT p.*, u.username as seller_name, u.rank as seller_rank, u.avatar as seller_avatar 
      FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ${req.params.id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/my-products', auth, async (req, res) => {
  try {
    const rows = await sql`
      SELECT p.* 
      FROM products p 
      JOIN users u ON p.user_id = u.id 
      WHERE u.email = ${req.user.email} AND p.status = 'ACTIVE'
      ORDER BY p.created_at DESC
    `;
    res.json(rows);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/products', auth, async (req, res) => {
  try {
    const { 
      title, description, category, region, tag, 
      tiers, per_unit, features, images, icon 
    } = req.body;
    if (!title || !tiers || !Array.isArray(tiers) || tiers.length === 0) {
      return res.status(400).json({ error: 'Title and at least one pricing tier required' });
    }

    const id = randomUUID();
    await sql`INSERT INTO products (
      id, user_id, title, description, category, region, tag, 
      tiers,
      per_unit, features, images, icon, status
    )
      VALUES (
        ${id}, ${req.user.id}, ${title}, ${description || ''}, ${category || 'BOOSTING'}, ${region || 'GLOBAL'},
        ${tag || ''}, 
        ${JSON.stringify(tiers)},
        ${per_unit || '/session'},
        ${JSON.stringify(features || [])}, ${JSON.stringify(images || [])}, ${icon || '🎮'}, 'ACTIVE'
      )`;

    res.status(201).json({ id, message: 'Product created' });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    // Soft delete to avoid breaking order history
    const result = await sql`UPDATE products SET status = 'INACTIVE' WHERE id = ${req.params.id} AND user_id = ${req.user.id} RETURNING id`;
    if (result.length === 0) return res.status(404).json({ error: 'Not found or not owner' });
    res.json({ message: 'Product deactivated successfully' });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});


// ---------- CONVERSATIONS & MESSAGES ----------
app.get('/api/conversations', auth, async (req, res) => {
  try {
    const convos = await sql`
      SELECT c.*, 
        u1.username as buyer_name, u2.username as seller_name,
        p.title as product_title,
        (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_id != ${req.user.id} AND m.read = FALSE) as unread
      FROM conversations c
      JOIN users u1 ON c.buyer_id = u1.id
      JOIN users u2 ON c.seller_id = u2.id
      LEFT JOIN products p ON c.product_id = p.id
      WHERE c.buyer_id = ${req.user.id} OR c.seller_id = ${req.user.id}
      ORDER BY c.created_at DESC
    `;
    res.json(convos);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/conversations', auth, async (req, res) => {
  try {
    const { seller_id, product_id } = req.body;
    if (!seller_id) return res.status(400).json({ error: 'seller_id required' });

    const existing = await sql`SELECT id FROM conversations WHERE buyer_id = ${req.user.id} AND seller_id = ${seller_id} AND product_id = ${product_id || null}`;
    if (existing.length > 0) return res.json({ id: existing[0].id, existing: true });

    const id = randomUUID();
    await sql`INSERT INTO conversations (id, buyer_id, seller_id, product_id) VALUES (${id}, ${req.user.id}, ${seller_id}, ${product_id || null})`;
    res.status(201).json({ id });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/conversations/:id/messages', auth, async (req, res) => {
  try {
    const messages = await sql`
      SELECT m.*, u.username as sender_name
      FROM messages m JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = ${req.params.id}
      ORDER BY m.created_at ASC
    `;
    // Mark as read
    await sql`UPDATE messages SET read = TRUE WHERE conversation_id = ${req.params.id} AND sender_id != ${req.user.id}`;
    res.json(messages);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/conversations/:id/messages', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Text required' });

    const convoRows = await sql`SELECT * FROM conversations WHERE id = ${req.params.id}`;
    if (convoRows.length === 0) return res.status(404).json({ error: 'Conversation not found' });
    const convo = convoRows[0];

    const recipientId = convo.buyer_id === req.user.id ? convo.seller_id : convo.buyer_id;

    const id = randomUUID();
    await sql`INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (${id}, ${req.params.id}, ${req.user.id}, ${text.trim()})`;
    
    // Notify Recipient
    await notify(
      recipientId,
      'New Message',
      `${req.user.username}: ${text.trim().slice(0, 50)}${text.trim().length > 50 ? '...' : ''}`,
      'MESSAGE',
      `/messages`
    );

    res.status(201).json({ id, created_at: new Date().toISOString() });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});


// ---------- ORDERS ----------
app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = await sql`
      SELECT o.*, p.title as product_title, p.category, u.username as seller_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE o.buyer_id = ${req.user.id}
      ORDER BY o.created_at DESC
    `;
    res.json(orders);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/orders', auth, async (req, res) => {
  try {
    const { product_id, tier = 'PRO' } = req.body;
    const rows = await sql`SELECT * FROM products WHERE id = ${product_id}`;
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });

    const product = rows[0];
    const total = tier === 'BASIC' ? (product.tiers?.[0]?.price ?? 0) : tier === 'ELITE' ? (product.tiers?.[2]?.price ?? 0) : (product.tiers?.[1]?.price ?? 0);
    const id = randomUUID();
    await sql`INSERT INTO orders (id, buyer_id, product_id, tier, total) VALUES (${id}, ${req.user.id}, ${product_id}, ${tier}, ${total})`;
    
    // Notify Seller
    await notify(
      product.user_id, 
      'New Order Received!', 
      `${req.user.username} just purchased the ${tier} tier of your service: ${product.title}`,
      'ORDER',
      `/orders`
    );

    res.status(201).json({ id, total });

  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

// ---------- GEMINI PROXY ----------
app.post('/api/gemini', (req, res) => {
  if (!geminiKey) return res.status(500).json({ error: 'Gemini key not configured' });

  const body = JSON.stringify(req.body);
  const path = `/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${geminiKey}`;

  const upstream = https.request({
    hostname: 'generativelanguage.googleapis.com',
    path, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  }, (uRes) => {
    res.writeHead(uRes.statusCode, {
      'Content-Type': uRes.headers['content-type'] ?? 'text/event-stream',
      'Cache-Control': 'no-cache',
    });
    uRes.pipe(res);
  });

  upstream.on('error', (e) => { res.writeHead(502); res.end(`Proxy error: ${e.message}`); });
  upstream.write(body);
  upstream.end();
});

// ---------- IMAGE UPLOAD ----------
app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
});
app.use('/uploads', express.static(uploadsDir));

// ---------- NOTIFICATIONS ----------
app.get('/api/notifications', auth, async (req, res) => {
  try {
    const rows = await sql`SELECT * FROM notifications WHERE user_id = ${req.user.id} ORDER BY created_at DESC LIMIT 50`;
    res.json(rows);
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

app.post('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await sql`UPDATE notifications SET read = TRUE WHERE user_id = ${req.user.id}`;
    res.json({ success: true });
  } catch (e) { 
    console.error('API Error:', e);
    res.status(500).json({ error: e.message }); 
  }
});

// ---------- ADMIN ----------
app.get('/api/admin/stats', adminAuth, async (req, res) => {
  try {
    const revenue = await sql`SELECT SUM(total) as t FROM orders`;
    const ordersCount = await sql`SELECT COUNT(*) as c FROM orders`;
    const usersCount = await sql`SELECT COUNT(*) as c FROM users`;
    const activeProducts = await sql`SELECT COUNT(*) as c FROM products WHERE status = 'ACTIVE'`;

    res.json({
      totalRevenue: Number(revenue[0].t || 0),
      totalOrders: Number(ordersCount[0].c),
      totalUsers: Number(usersCount[0].c),
      activeListings: Number(activeProducts[0].c)
    });
  } catch (e) {
    console.error('Admin API Error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const rows = await sql`
      SELECT o.*, p.title as product_title, p.category, 
             u1.username as buyer_name, u2.username as seller_name
      FROM orders o
      JOIN products p ON o.product_id = p.id
      JOIN users u1 ON o.buyer_id = u1.id
      JOIN users u2 ON p.user_id = u2.id
      ORDER BY o.created_at DESC
    `;
    res.json(rows);
  } catch (e) {
    console.error('Admin API Error:', e);
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const rows = await sql`SELECT id, username, email, rank, balance, created_at FROM users ORDER BY created_at DESC`;
    res.json(rows);
  } catch (e) {
    console.error('Admin API Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// Serve production frontend
const distPath = join(__dir, 'dist');
app.use(express.static(distPath));

// Handle client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API endpoint not found' });
  res.sendFile(join(distPath, 'index.html'));
});

// ---------- HEALTH ----------



app.get('/api/health', async (req, res) => {
  try {
    const result = await sql`SELECT NOW() as time`;
    res.json({ status: 'OK', db: 'NEON_POSTGRES', time: result[0].time });
  } catch (e) { res.status(500).json({ status: 'ERROR', error: e.message }); }
});

// ---------- START ----------
async function main() {
  console.log('\n  Connecting to Neon PostgreSQL...');
  await initDb();
  await seedDb();

  app.listen(PORT, () => {
    console.log(`\n  Zen-Gamer API ready  → http://localhost:${PORT}`);
    console.log(`  Gemini proxy         → http://localhost:${PORT}/api/gemini`);
    console.log(`  Database             → Neon PostgreSQL (serverless)\n`);
  });
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
