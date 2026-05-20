import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import https from 'https';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'ZEN_GAMER_V0ID_S3CR3T_K3Y';
const OWNER_EMAIL = 'misheelmother@gmail.com';
const databaseUrl = process.env.DATABASE_URL || '';
const geminiKey = process.env.VITE_GEMINI_KEY || '';

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const sql = neon(databaseUrl);

// Multer Memory Storage for Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Database Initialization (Runs once per serverless instance cold start)
async function initDb() {
  await sql`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, avatar TEXT DEFAULT '', rank TEXT DEFAULT 'OPERATOR', bio TEXT DEFAULT '', balance REAL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), title TEXT NOT NULL, description TEXT DEFAULT '', category TEXT DEFAULT 'BOOSTING', wear_condition TEXT DEFAULT 'Brand New', region TEXT DEFAULT 'GLOBAL', tag TEXT DEFAULT '', basic_price REAL DEFAULT 0, pro_price REAL DEFAULT 0, elite_price REAL DEFAULT 0, basic_name TEXT DEFAULT 'BASIC', pro_name TEXT DEFAULT 'PRO', elite_name TEXT DEFAULT 'ELITE', per_unit TEXT DEFAULT '/session', features JSONB DEFAULT '[]', images JSONB DEFAULT '[]', icon TEXT DEFAULT '🎮', status TEXT DEFAULT 'ACTIVE', created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY, buyer_id TEXT NOT NULL REFERENCES users(id), seller_id TEXT NOT NULL REFERENCES users(id), product_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, conversation_id TEXT NOT NULL REFERENCES conversations(id), sender_id TEXT NOT NULL REFERENCES users(id), text TEXT NOT NULL, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, buyer_id TEXT NOT NULL REFERENCES users(id), product_id TEXT NOT NULL REFERENCES products(id), tier TEXT DEFAULT 'PRO', status TEXT DEFAULT 'PENDING', total REAL DEFAULT 0, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS notifications (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), type TEXT NOT NULL, content TEXT NOT NULL, read BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS escrow_trades (id TEXT PRIMARY KEY, buyer_id TEXT NOT NULL REFERENCES users(id), seller_id TEXT NOT NULL REFERENCES users(id), product_id TEXT NOT NULL REFERENCES products(id), amount REAL DEFAULT 0, account_credentials TEXT DEFAULT '', status TEXT DEFAULT 'PENDING_SELLER_CREDS', middleman_id TEXT, created_at TIMESTAMPTZ DEFAULT NOW())`;
  await sql`CREATE TABLE IF NOT EXISTS withdrawals (id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), amount REAL NOT NULL, bank_name TEXT NOT NULL, account_number TEXT NOT NULL, account_holder TEXT NOT NULL, status TEXT DEFAULT 'PENDING', created_at TIMESTAMPTZ DEFAULT NOW())`;
  try { await sql`ALTER TABLE products ADD COLUMN IF NOT EXISTS wear_condition TEXT DEFAULT 'Brand New'`; } catch {}
}

// Middleware
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const rows = await sql`SELECT rank FROM users WHERE id = ${decoded.id}`;
    if (rows[0]?.rank === 'BANNED') return res.status(403).json({ error: 'Your account has been permanently banned from Zen-Gamer.' });
    req.user = decoded;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.role !== 'admin' && user.role !== 'owner' && user.role !== 'moderator') return res.status(403).json({ error: 'Admin access restricted' });
    req.user = user;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const adminOrOwnerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.role !== 'admin' && user.role !== 'owner') return res.status(403).json({ error: 'Administrative clearance required' });
    req.user = user;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

const ownerAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Auth required' });
  try {
    const user = jwt.verify(token, JWT_SECRET);
    if (user.role !== 'owner') return res.status(403).json({ error: 'Owner clearance required' });
    req.user = user;
    next();
  } catch { res.status(401).json({ error: 'Invalid token' }); }
};

// --- ROUTES ---

app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  try {
    await sql`INSERT INTO users (id, username, email, password) VALUES (${id}, ${username}, ${email}, ${hash})`;
    res.json({ success: true });
  } catch (e) { res.status(400).json({ error: e.message }); }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (!rows[0] || !await bcrypt.compare(password, rows[0].password)) return res.status(401).json({ error: 'Invalid credentials' });
  if (rows[0].rank === 'BANNED') return res.status(403).json({ error: 'Your account has been permanently banned from Zen-Gamer.' });
  // Auto-promote owner account
  if (email === OWNER_EMAIL && rows[0].rank !== 'owner') {
    await sql`UPDATE users SET rank = 'owner' WHERE email = ${OWNER_EMAIL}`;
    rows[0].rank = 'owner';
  }
  const token = jwt.sign({ id: rows[0].id, username: rows[0].username, role: rows[0].rank }, JWT_SECRET);
  res.json({ token, user: rows[0] });
});

app.post('/api/google', async (req, res) => {
  const { email, username } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  let rows = await sql`SELECT * FROM users WHERE email = ${email}`;
  if (rows[0] && rows[0].rank === 'BANNED') return res.status(403).json({ error: 'Your account has been permanently banned from Zen-Gamer.' });
  if (!rows[0]) {
    const rank = email === OWNER_EMAIL ? 'owner' : 'OPERATOR';
    const id = randomUUID();
    const hash = await bcrypt.hash(randomUUID(), 10);
    await sql`INSERT INTO users (id, username, email, password, rank, balance) VALUES (${id}, ${username || email.split('@')[0]}, ${email}, ${hash}, ${rank}, 0)`;
    rows = await sql`SELECT * FROM users WHERE id = ${id}`;
  } else if (email === OWNER_EMAIL && rows[0].rank !== 'owner') {
    await sql`UPDATE users SET rank = 'owner' WHERE email = ${OWNER_EMAIL}`;
    rows[0].rank = 'owner';
  }
  const token = jwt.sign({ id: rows[0].id, username: rows[0].username, role: rows[0].rank }, JWT_SECRET);
  res.json({ token, user: rows[0] });
});

app.get('/api/me', auth, async (req, res) => {
  const rows = await sql`SELECT id, username, email, rank, bio, avatar, balance, created_at FROM users WHERE id = ${req.user.id}`;
  res.json(rows[0]);
});

app.get('/api/products', async (req, res) => {
  const { search } = req.query;
  let rows;
  if (search) rows = await sql`SELECT p.*, u.username as seller_name, u.avatar as seller_avatar, u.rank as seller_rank FROM products p JOIN users u ON p.user_id = u.id WHERE (p.title ILIKE ${'%' + search + '%'} OR p.description ILIKE ${'%' + search + '%'}) AND p.status = 'ACTIVE'`;
  else rows = await sql`SELECT p.*, u.username as seller_name, u.avatar as seller_avatar, u.rank as seller_rank FROM products p JOIN users u ON p.user_id = u.id WHERE p.status = 'ACTIVE'`;
  res.json(rows);
});

app.get('/api/products/mine', auth, async (req, res) => {
  const rows = await sql`SELECT * FROM products WHERE user_id = ${req.user.id} AND status = 'ACTIVE'`;
  res.json(rows);
});

app.get('/api/products/:id', async (req, res) => {
  const rows = await sql`SELECT p.*, u.username as seller_name, u.avatar as seller_avatar, u.rank as seller_rank FROM products p JOIN users u ON p.user_id = u.id WHERE p.id = ${req.params.id}`;
  if (!rows[0]) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
});

app.post('/api/products', auth, async (req, res) => {
  const id = randomUUID();
  const { title, description, category, wearCondition, basicPrice, proPrice, elitePrice, basicName, proName, eliteName, perUnit, images } = req.body;
  await sql`INSERT INTO products (id, user_id, title, description, category, wear_condition, basic_price, pro_price, elite_price, basic_name, pro_name, elite_name, per_unit, images) VALUES (${id}, ${req.user.id}, ${title}, ${description}, ${category}, ${wearCondition || 'Brand New'}, ${basicPrice}, ${proPrice}, ${elitePrice}, ${basicName}, ${proName}, ${eliteName}, ${perUnit}, ${JSON.stringify(images)})`;
  res.json({ id });
});

app.delete('/api/products/:id', auth, async (req, res) => {
  await sql`UPDATE products SET status = 'DELETED' WHERE id = ${req.params.id} AND user_id = ${req.user.id}`;
  res.json({ success: true });
});

app.post('/api/upload', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  cloudinary.uploader.upload_stream({ folder: 'zen-gamer' }, (error, result) => {
    if (error) return res.status(500).json({ error: error.message });
    res.json({ url: result.secure_url, filename: result.public_id });
  }).end(req.file.buffer);
});

app.get('/api/conversations', auth, async (req, res) => {
  const rows = await sql`
    SELECT c.*, u.username as other_name, u.avatar as other_avatar,
    (SELECT username FROM users WHERE id = c.buyer_id) as buyer_name,
    (SELECT username FROM users WHERE id = c.seller_id) as seller_name,
    (SELECT title FROM products WHERE id = c.product_id) as product_title,
    (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_text,
    (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND sender_id != ${req.user.id} AND read = FALSE) as unread
    FROM conversations c
    JOIN users u ON (c.buyer_id = u.id OR c.seller_id = u.id)
    WHERE (c.buyer_id = ${req.user.id} OR c.seller_id = ${req.user.id}) AND u.id != ${req.user.id}
  `;
  res.json(rows);
});

app.post('/api/conversations', auth, async (req, res) => {
  const { sellerId, productId } = req.body;
  const existing = await sql`SELECT id FROM conversations WHERE (buyer_id = ${req.user.id} AND seller_id = ${sellerId}) OR (buyer_id = ${sellerId} AND seller_id = ${req.user.id})`;
  if (existing[0]) return res.json({ id: existing[0].id });
  const id = randomUUID();
  await sql`INSERT INTO conversations (id, buyer_id, seller_id, product_id) VALUES (${id}, ${req.user.id}, ${sellerId}, ${productId})`;
  res.json({ id });
});

app.get('/api/messages/:convId', auth, async (req, res) => {
  await sql`UPDATE messages SET read = TRUE WHERE conversation_id = ${req.params.convId} AND sender_id != ${req.user.id}`;
  const rows = await sql`SELECT * FROM messages WHERE conversation_id = ${req.params.convId} ORDER BY created_at ASC`;
  res.json(rows);
});

app.post('/api/messages', auth, async (req, res) => {
  const { conversationId, text } = req.body;
  const id = randomUUID();
  await sql`INSERT INTO messages (id, conversation_id, sender_id, text) VALUES (${id}, ${conversationId}, ${req.user.id}, ${text})`;
  res.json({ id });
});

app.get('/api/orders', auth, async (req, res) => {
  const rows = await sql`SELECT o.*, p.title as product_title FROM orders o JOIN products p ON o.product_id = p.id WHERE o.buyer_id = ${req.user.id} ORDER BY o.created_at DESC`;
  res.json(rows);
});

app.post('/api/orders', auth, async (req, res) => {
  const { productId, tier } = req.body;
  const product = await sql`SELECT * FROM products WHERE id = ${productId}`;
  if (!product[0]) return res.status(404).json({ error: 'Product not found' });
  const price = tier === 'BASIC' ? product[0].basic_price : tier === 'ELITE' ? product[0].elite_price : product[0].pro_price;
  const id = randomUUID();
  await sql`INSERT INTO orders (id, buyer_id, product_id, tier, total) VALUES (${id}, ${req.user.id}, ${productId}, ${tier}, ${price})`;
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${randomUUID()}, ${product[0].user_id}, 'ORDER', ${'New order received for ' + product[0].title})`;
  res.json({ id });
});

app.get('/api/admin/stats', adminAuth, async (req, res) => {
  const revenue = await sql`SELECT SUM(total) as t FROM orders`;
  const ordersCount = await sql`SELECT COUNT(*) as c FROM orders`;
  const usersCount = await sql`SELECT COUNT(*) as c FROM users`;
  const activeProducts = await sql`SELECT COUNT(*) as c FROM products WHERE status = 'ACTIVE'`;
  res.json({ totalRevenue: Number(revenue[0].t || 0), totalOrders: Number(ordersCount[0].c), totalUsers: Number(usersCount[0].c), activeListings: Number(activeProducts[0].c) });
});

app.get('/api/admin/orders', adminAuth, async (req, res) => {
  const rows = await sql`SELECT o.*, p.title as product_title, p.category, u1.username as buyer_name, u2.username as seller_name FROM orders o JOIN products p ON o.product_id = p.id JOIN users u1 ON o.buyer_id = u1.id JOIN users u2 ON p.user_id = u2.id ORDER BY o.created_at DESC`;
  res.json(rows);
});

app.get('/api/admin/users', adminAuth, async (req, res) => {
  const rows = await sql`SELECT id, username, email, rank, balance, created_at FROM users ORDER BY created_at DESC`;
  res.json(rows);
});

// Admin/Owner: set rank of any user (promote/demote moderator/admin or ban)
app.post('/api/admin/users/:id/set-rank', adminOrOwnerAuth, async (req, res) => {
  const { rank } = req.body;
  const { id } = req.params;
  const allowed = ['OPERATOR', 'moderator', 'admin', 'BANNED'];
  if (!allowed.includes(rank)) return res.status(400).json({ error: 'Invalid rank. Allowed: OPERATOR, moderator, admin, BANNED' });
  // Prevent demoting owner
  const target = await sql`SELECT email, rank FROM users WHERE id = ${id}`;
  if (!target[0]) return res.status(404).json({ error: 'User not found' });
  if (target[0].email === OWNER_EMAIL) return res.status(403).json({ error: 'Cannot modify owner account' });
  
  // Admins cannot promote/demote other admins or owners
  if (req.user.role === 'admin' && (target[0].rank === 'admin' || target[0].rank === 'owner' || rank === 'admin')) {
    return res.status(403).json({ error: 'Only the Owner can promote or demote Admin accounts.' });
  }
  
  await sql`UPDATE users SET rank = ${rank} WHERE id = ${id}`;
  res.json({ success: true, rank });
});

// --- ESCROW MIDDLEMAN TRADE ROUTES ---
app.post('/api/escrow/create', auth, async (req, res) => {
  const { productId, tier, paymentMethod } = req.body;
  const product = await sql`SELECT * FROM products WHERE id = ${productId}`;
  if (!product[0]) return res.status(404).json({ error: 'Product not found' });
  
  const amount = Number(tier === 'BASIC' ? product[0].basic_price : tier === 'ELITE' ? product[0].elite_price : product[0].pro_price || 0);
  
  if (paymentMethod === 'wallet') {
    const userRows = await sql`SELECT balance FROM users WHERE id = ${req.user.id}`;
    if ((userRows[0]?.balance ?? 0) < amount) {
      return res.status(400).json({ error: 'Хэтэвчний үлдэгдэл хүрэлцэхгүй байна.' });
    }
    await sql`UPDATE users SET balance = balance - ${amount} WHERE id = ${req.user.id}`;
  }
  
  const tradeId = randomUUID();
  await sql`INSERT INTO escrow_trades (id, buyer_id, seller_id, product_id, amount, status) VALUES (${tradeId}, ${req.user.id}, ${product[0].user_id}, ${productId}, ${amount}, 'PENDING_SELLER_CREDS')`;
  
  const n1 = randomUUID(), n2 = randomUUID();
  // Seller notification
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n1}, ${product[0].user_id}, 'ESCROW', ${'🔒 Худалдан авагч ' + product[0].title + ' үйлчилгээний ₮' + amount.toLocaleString() + ' төлбөрийг дундын дансанд байршууллаа. Зуучлагчид олгох дансны мэдээллээ оруулж гүйлгээг үргэлжлүүлнэ үү.'})`;
  // Buyer notification
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n2}, ${req.user.id}, 'ESCROW', ${'🔒 Таны ₮' + amount.toLocaleString() + ' төлбөр дундын дансанд амжилттай байршлаа. Худалдагч дансны мэдээллээ оруулсны дараа дундын зуучлагч гүйлгээг хянах болно.'})`;
  
  res.json({ success: true, tradeId });
});

app.post('/api/escrow/:id/submit-creds', auth, async (req, res) => {
  const { credentials } = req.body;
  const { id } = req.params;
  const trade = await sql`SELECT * FROM escrow_trades WHERE id = ${id} AND seller_id = ${req.user.id}`;
  if (!trade[0]) return res.status(404).json({ error: 'Escrow trade not found or unauthorized' });
  
  await sql`UPDATE escrow_trades SET account_credentials = ${credentials}, status = 'PENDING_MIDDLEMAN_VERIFICATION' WHERE id = ${id}`;
  
  const mods = await sql`SELECT id FROM users WHERE rank IN ('moderator', 'admin', 'owner')`;
  for (const mod of mods) {
    const notifId = randomUUID();
    await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${notifId}, ${mod.id}, 'ESCROW', ${'Escrow Trade #' + id.slice(0,8) + ' requires Middleman Verification!'})`;
  }
  res.json({ success: true });
});

app.get('/api/escrow/list', auth, async (req, res) => {
  try {
    if (['moderator', 'admin', 'owner'].includes(req.user.role)) {
      const rows = await sql`SELECT e.*, p.title as product_title, u1.username as buyer_name, u2.username as seller_name FROM escrow_trades e JOIN products p ON e.product_id = p.id JOIN users u1 ON e.buyer_id = u1.id JOIN users u2 ON e.seller_id = u2.id ORDER BY e.created_at DESC`;
      return res.json(rows);
    } else {
      const rows = await sql`SELECT e.*, p.title as product_title, u1.username as buyer_name, u2.username as seller_name FROM escrow_trades e JOIN products p ON e.product_id = p.id JOIN users u1 ON e.buyer_id = u1.id JOIN users u2 ON e.seller_id = u2.id WHERE e.buyer_id = ${req.user.id} OR e.seller_id = ${req.user.id} ORDER BY e.created_at DESC`;
      return res.json(rows);
    }
  } catch (e) {
    console.error('Escrow List Error:', e);
    return res.status(500).json({ error: e.message });
  }
});

app.post('/api/escrow/:id/verify', adminAuth, async (req, res) => {
  const { id } = req.params;
  const trade = await sql`SELECT * FROM escrow_trades WHERE id = ${id}`;
  if (!trade[0] || (trade[0].status !== 'PENDING_MIDDLEMAN_VERIFICATION' && trade[0].status !== 'PENDING_SELLER_CREDS')) {
    return res.status(400).json({ error: 'Trade not pending verification or credentials' });
  }
  
  await sql`UPDATE escrow_trades SET status = 'COMPLETED', middleman_id = ${req.user.id} WHERE id = ${id}`;
  await sql`UPDATE users SET balance = balance + ${trade[0].amount} WHERE id = ${trade[0].seller_id}`;
  
  const n1 = randomUUID(), n2 = randomUUID();
  const credInfo = trade[0].account_credentials ? ('\n\n🔑 Дансны мэдээлэл:\n' + trade[0].account_credentials) : '';
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n1}, ${trade[0].buyer_id}, 'ESCROW', ${'✅ Дундын зуучлагч гүйлгээ #' + id.slice(0,8) + '-г баталгаажууллаа! Таны захиалга бэлэн болсон байна.' + credInfo})`;
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n2}, ${trade[0].seller_id}, 'ESCROW', ${'✅ Дундын зуучлагч гүйлгээ #' + id.slice(0,8) + '-г баталгаажууллаа! ₮' + Number(trade[0].amount).toLocaleString() + ' таны үлдэгдэлд нэмэгдлээ.'})`;
  
  res.json({ success: true });
});

app.post('/api/escrow/:id/cancel', adminAuth, async (req, res) => {
  const { id } = req.params;
  const trade = await sql`SELECT * FROM escrow_trades WHERE id = ${id}`;
  if (!trade[0] || trade[0].status === 'COMPLETED' || trade[0].status === 'CANCELLED') return res.status(400).json({ error: 'Trade cannot be cancelled' });
  
  await sql`UPDATE escrow_trades SET status = 'CANCELLED', middleman_id = ${req.user.id} WHERE id = ${id}`;
  await sql`UPDATE users SET balance = balance + ${trade[0].amount} WHERE id = ${trade[0].buyer_id}`;
  
  const n1 = randomUUID(), n2 = randomUUID();
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n1}, ${trade[0].buyer_id}, 'ESCROW', ${'❌ Дундын зуучлагч гүйлгээ #' + id.slice(0,8) + '-г цуцаллаа. ₮' + Number(trade[0].amount).toLocaleString() + ' таны үлдэгдэлд буцаагдлаа.'})`;
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${n2}, ${trade[0].seller_id}, 'ESCROW', ${'❌ Дундын зуучлагч гүйлгээ #' + id.slice(0,8) + '-г цуцаллаа. Дансны мэдээлэл баталгаажаагүй тул гүйлгээ хаагдлаа.'})`;
  
  res.json({ success: true });
});

// --- WITHDRAWAL ROUTES ---
app.post('/api/withdrawals/create', auth, async (req, res) => {
  const { amount, bankName, accountNumber, accountHolder } = req.body;
  const amt = Number(amount);
  if (isNaN(amt) || amt <= 0) return res.status(400).json({ error: 'Зөв дүн оруулна уу.' });
  
  const userRows = await sql`SELECT balance FROM users WHERE id = ${req.user.id}`;
  if ((userRows[0]?.balance ?? 0) < amt) {
    return res.status(400).json({ error: 'Баланс хүрэлцэхгүй байна.' });
  }
  
  const id = randomUUID();
  await sql`UPDATE users SET balance = balance - ${amt} WHERE id = ${req.user.id}`;
  await sql`INSERT INTO withdrawals (id, user_id, amount, bank_name, account_number, account_holder, status) VALUES (${id}, ${req.user.id}, ${amt}, ${bankName}, ${accountNumber}, ${accountHolder}, 'PENDING')`;
  
  const nId = randomUUID();
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${nId}, ${req.user.id}, 'SYSTEM', ${'💸 Таны ₮' + amt.toLocaleString() + ' татан авалтын хүсэлт амжилттай бүртгэгдлээ. Дундын зуучлагч хянаж байна.'})`;
  
  res.json({ success: true, id });
});

app.get('/api/withdrawals/mine', auth, async (req, res) => {
  const rows = await sql`SELECT * FROM withdrawals WHERE user_id = ${req.user.id} ORDER BY created_at DESC`;
  res.json(rows);
});

app.get('/api/withdrawals/list', adminAuth, async (req, res) => {
  const rows = await sql`SELECT w.*, u.username as user_name, u.email as user_email FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC`;
  res.json(rows);
});

app.post('/api/withdrawals/:id/approve', adminAuth, async (req, res) => {
  const { id } = req.params;
  const w = await sql`SELECT * FROM withdrawals WHERE id = ${id}`;
  if (!w[0] || w[0].status !== 'PENDING') return res.status(400).json({ error: 'Хүлээгдэж буй татан авалтын хүсэлт олдсонгүй.' });
  
  await sql`UPDATE withdrawals SET status = 'COMPLETED' WHERE id = ${id}`;
  
  const nId = randomUUID();
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${nId}, ${w[0].user_id}, 'SYSTEM', ${'✅ Таны ₮' + Number(w[0].amount).toLocaleString() + ' татан авалтын хүсэлт баталгаажиж, ' + w[0].bank_name + ' (' + w[0].account_number + ') данс руу тань шилжлээ.'})`;
  
  res.json({ success: true });
});

app.post('/api/withdrawals/:id/reject', adminAuth, async (req, res) => {
  const { id } = req.params;
  const w = await sql`SELECT * FROM withdrawals WHERE id = ${id}`;
  if (!w[0] || w[0].status !== 'PENDING') return res.status(400).json({ error: 'Хүлээгдэж буй татан авалтын хүсэлт олдсонгүй.' });
  
  await sql`UPDATE withdrawals SET status = 'CANCELLED' WHERE id = ${id}`;
  await sql`UPDATE users SET balance = balance + ${w[0].amount} WHERE id = ${w[0].user_id}`;
  
  const nId = randomUUID();
  await sql`INSERT INTO notifications (id, user_id, type, content) VALUES (${nId}, ${w[0].user_id}, 'SYSTEM', ${'❌ Таны ₮' + Number(w[0].amount).toLocaleString() + ' татан авалтын хүсэлтийг админ цуцаллаа. Шалтгаан: Мэдээлэл буруу эсвэл дутуу. Дүн таны баланс руу буцаж орлоо.'})`;
  
  res.json({ success: true });
});

app.get('/api/notifications', auth, async (req, res) => {
  try {
    const list = await sql`SELECT * FROM notifications WHERE user_id = ${req.user.id} ORDER BY created_at DESC LIMIT 20`;
    const formatted = list.map(n => ({
      id: n.id,
      type: n.type,
      title: n.type === 'ORDER' ? '🛒 Шинэ захиалга'
           : n.type === 'MESSAGE' ? '💬 Шинэ зурвас'
           : n.type === 'ESCROW' ? '🔒 Дундын данс'
           : '🔔 Системийн мэдэгдэл',
      message: n.content,
      read: n.read,
      created_at: n.created_at,
      link: n.type === 'ORDER' ? '/orders'
          : n.type === 'MESSAGE' ? '/messages'
          : n.type === 'ESCROW' ? '/orders?tab=escrow'
          : '#',
    }));
    res.json(formatted);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/notifications/read-all', auth, async (req, res) => {
  try {
    await sql`UPDATE notifications SET read = TRUE WHERE user_id = ${req.user.id}`;
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/health', async (req, res) => {
  await initDb();
  res.json({ status: 'OK', db: 'NEON_POSTGRES' });
});

app.post('/api/gemini-nano', (req, res) => {
  const key = process.env.VITE_GEMINI_KEY || geminiKey;
  if (!key) return res.status(500).json({ error: 'Gemini key not configured' });
  const body = JSON.stringify(req.body);
  const path = `/v1beta/models/gemini-flash-lite-latest:streamGenerateContent?alt=sse&key=${key}`;
  const upstream = https.request({ hostname: 'generativelanguage.googleapis.com', path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (uRes) => {
    res.writeHead(uRes.statusCode, { 'Content-Type': uRes.headers['content-type'] ?? 'text/event-stream', 'Cache-Control': 'no-cache' });
    uRes.pipe(res);
  });
  upstream.on('error', (e) => { res.writeHead(502); res.end(`Proxy error: ${e.message}`); });
  upstream.write(body);
  upstream.end();
});

app.post('/api/gemini', (req, res) => {
  const key = process.env.VITE_GEMINI_KEY || geminiKey;
  if (!key) return res.status(500).json({ error: 'Gemini key not configured' });
  const body = JSON.stringify(req.body);
  const path = `/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${key}`;
  const upstream = https.request({ hostname: 'generativelanguage.googleapis.com', path, method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) } }, (uRes) => {
    res.writeHead(uRes.statusCode, { 'Content-Type': uRes.headers['content-type'] ?? 'text/event-stream', 'Cache-Control': 'no-cache' });
    uRes.pipe(res);
  });
  upstream.on('error', (e) => { res.writeHead(502); res.end(`Proxy error: ${e.message}`); });
  upstream.write(body);
  upstream.end();
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
