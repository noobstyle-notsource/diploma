// proxy.mjs — Run with: node proxy.mjs
// Proxies POST /api/gemini → Gemini API, injecting the key server-side
import http from 'http';
import https from 'https';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env manually
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dir, '.env');
let geminiKey = '';
try {
  const raw = readFileSync(envPath, 'utf8');
  const match = raw.match(/VITE_GEMINI_KEY=(.+)/);
  geminiKey = match?.[1]?.trim() ?? '';
} catch {}

if (!geminiKey) { console.error('No VITE_GEMINI_KEY in .env'); process.exit(1); }

const PORT = 3001;

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.url !== '/api/gemini' || req.method !== 'POST') {
    res.writeHead(404); res.end('Not found'); return;
  }

  const chunks = [];
  req.on('data', c => chunks.push(c));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const path = `/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${geminiKey}`;
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': body.length },
    };

    const upstream = https.request(options, (uRes) => {
      res.writeHead(uRes.statusCode, {
        'Content-Type': uRes.headers['content-type'] ?? 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*',
      });
      uRes.pipe(res);
    });

    upstream.on('error', (e) => { res.writeHead(502); res.end(`Proxy error: ${e.message}`); });
    upstream.write(body);
    upstream.end();
  });
});

server.listen(PORT, () => console.log(`VOID_AI proxy ready → http://localhost:${PORT}/api/gemini`));
