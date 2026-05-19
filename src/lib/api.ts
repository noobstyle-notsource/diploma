// src/lib/api.ts — Zen-Gamer API Client

const BASE = '/api';

// ── Token helpers ──────────────────────────────────────────────
export const getToken = () => localStorage.getItem('zg_token');
export const setToken = (t: string) => localStorage.setItem('zg_token', t);
export const clearToken = () => localStorage.removeItem('zg_token');
export const isLoggedIn = () => !!getToken();

function authHeaders(): Record<string, string> {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}

/** Simple in‑memory cache for AI prompts to avoid duplicate calls */
const aiCache = new Map<string, string>();

/** Debounce helper – returns a throttled version of a function */
export function debounce<T extends (...args: any[]) => any>(fn: T, wait: number): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    return new Promise<any>((resolve) => {
      timeout = setTimeout(async () => {
        const result = await fn(...args);
        resolve(result);
      }, wait);
    });
  }) as unknown as T;
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  isForm = false,
): Promise<T> {
  const headers: Record<string, string> = { ...authHeaders() };
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: isForm ? (body as FormData) : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data as T;
}

// ── Auth ───────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  rank: string;
  avatar: string;
  bio: string;
  balance?: number;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export const auth = {
  register: (username: string, email: string, password: string) =>
    request<AuthResponse>('POST', '/register', { username, email, password }),

  login: (email: string, password: string) =>
    request<AuthResponse>('POST', '/login', { email, password }),

  googleLogin: (email: string, username: string) =>
    request<AuthResponse>('POST', '/google', { email, username }),

  me: () => request<AuthUser>('GET', '/me'),
};

export const users = {
  get: (id: string) => request<AuthUser>('GET', `/users/${id}`),
};

// ── Products / Services ───────────────────────────────────────
export interface ProductTier {
  name: string;
  price: number;
}

export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  wearCondition?: string;
  wear_condition?: string;
  region: string;
  tag: string;
  tiers: ProductTier[];
  basic_price: number;
  pro_price: number;
  elite_price: number;
  basic_name: string;
  pro_name: string;
  elite_name: string;
  per_unit: string;
  features: string[];
  images: string[];
  icon: string;
  status: string;
  seller_name?: string;
  seller_rank?: string;
  seller_avatar?: string;
  created_at: string;
}

export const products = {
  list: (params?: { category?: string; search?: string }) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params ?? {}).filter(([, v]) => v)) as Record<string, string>,
    ).toString();
    return request<Product[]>('GET', `/products${qs ? `?${qs}` : ''}`);
  },
  get: (id: string) => request<Product>('GET', `/products/${id}`),
  mine: () => request<Product[]>('GET', '/products/mine'),
  create: (data: Partial<Product>) => request<{ id: string; message: string }>('POST', '/products', data),
  delete: (id: string) => request<{ message: string }>('DELETE', `/products/${id}`),
};

// ── Orders ────────────────────────────────────────────────────
export interface Order {
  id: string;
  buyer_id: string;
  product_id: string;
  product_title?: string;
  category?: string;
  seller_name?: string;
  tier: string;
  status: string;
  total: number;
  created_at: string;
}

export const orders = {
  list: () => request<Order[]>('GET', '/orders'),
  create: (product_id: string, tier = 'PRO') => request<{ id: string; total: number }>('POST', '/orders', { product_id, tier }),
};

// ── Notifications ─────────────────────────────────────────────
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ORDER' | 'MESSAGE' | 'SYSTEM';
  read: boolean;
  link?: string;
  created_at: string;
}

export const notifications = {
  list: () => request<Notification[]>('GET', '/notifications'),
  readAll: () => request<{ success: boolean }>('POST', '/notifications/read-all'),
};

// ── Conversations & Messages ───────────────────────────────────
export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id?: string;
  buyer_name: string;
  seller_name: string;
  product_title?: string;
  unread: number;
  created_at: string;
}

export interface ApiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  read: boolean;
  created_at: string;
}

export const conversations = {
  list: () => request<Conversation[]>('GET', '/conversations'),
  create: (seller_id: string, product_id?: string) =>
    request<{ id: string; existing?: boolean }>('POST', '/conversations', { seller_id, product_id }),
  messages: (id: string) => request<ApiMessage[]>('GET', `/messages/${id}`),
  send: (id: string, text: string) => request<{ id: string; created_at: string }>('POST', '/messages', { conversationId: id, text }),
};

// ── Upload ────────────────────────────────────────────────────
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const fd = new FormData();
  fd.append('image', file);
  return request<{ url: string }>('POST', '/upload', fd, true);
};

// ── Admin ────────────────────────────────────────────────────
export const admin = {
  stats: () =>
    request<{ totalRevenue: number; totalOrders: number; totalUsers: number; activeListings: number }>('GET', '/admin/stats'),
  orders: () => request<Order[]>('GET', '/admin/orders'),
  users: () => request<AuthUser[]>('GET', '/admin/users'),
  setRank: (id: string, rank: 'OPERATOR' | 'moderator' | 'admin' | 'BANNED') =>
    request<{ success: boolean; rank: string }>('POST', `/admin/users/${id}/set-rank`, { rank }),
};

// ── Escrow Middleman ─────────────────────────────────────────
export interface EscrowTrade {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id: string;
  product_title?: string;
  buyer_name?: string;
  seller_name?: string;
  amount: number;
  account_credentials?: string;
  status: 'PENDING_SELLER_CREDS' | 'PENDING_MIDDLEMAN_VERIFICATION' | 'COMPLETED' | 'CANCELLED';
  middleman_id?: string;
  created_at: string;
}

export const escrow = {
  create: (productId: string, tier = 'PRO') => request<{ success: boolean; tradeId: string }>('POST', '/escrow/create', { productId, tier }),
  submitCreds: (id: string, credentials: string) => request<{ success: boolean }>('POST', `/escrow/${id}/submit-creds`, { credentials }),
  list: () => request<EscrowTrade[]>('GET', '/escrow/list'),
  verify: (id: string) => request<{ success: boolean }>('POST', `/escrow/${id}/verify`),
  cancel: (id: string) => request<{ success: boolean }>('POST', `/escrow/${id}/cancel`),
};

// ── Health ────────────────────────────────────────────────────
export const health = () => request<{ status: string; db: string }>('GET', '/health');

// ── AI (Gemini) ───────────────────────────────────────────────
export const ai = {
  /**
   * Chat with Gemini. Uses cache, system prompt, and falls back to nano model on quota errors.
   */
  chat: async (prompt: string, context = '') => {
    const cacheKey = `${context}\n${prompt}`;
    if (aiCache.has(cacheKey)) return aiCache.get(cacheKey) as string;

    const systemPrompt = `You are the Zen-Gamer Nexus AI, an advanced cybernetic gaming specialist and elite marketplace tactical assistant.
Your persona is professional, authoritative, slightly futuristic/cyberpunk, and deeply ingrained in gaming culture.

=== CORE GAMING & ESPORTS KNOWLEDGE MATRIX ===
You possess expert-level knowledge across all gaming disciplines:
1. Tactical Shooters (CS2, Valorant, Rainbow Six Siege, Overwatch 2, Apex Legends):
   - Mechanics: Crosshair placement, recoil spray transfer, counter-strafing, peeker's advantage, angle isolation.
   - Strategy: Economy management, default setups, execute executes, post-plant positioning, utility lineups, agent/hero synergy matrices.
2. MOBAs (League of Legends, Dota 2, Smite):
   - Micro/Macro: Wave management (freezing, slow pushing, crashing), jungle pathing optimization, objective bounties, vision control, power spikes, drafting phase counters, split-pushing vs teamfight win conditions.
3. MMORPGs & Economies (World of Warcraft, FFXIV, Guild Wars 2, OSRS, Black Desert Online):
   - Progression: Raiding mechanics, Best-in-Slot (BiS) stat weights, rotation optimization, parsing strategies.
   - Economy: Auction house arbitrage, gold/currency farming vectors, crafting min-maxing, guild administration protocols.
4. ARPGs & Looter Shooters (Destiny 2, Path of Exile, Diablo IV, Warframe):
   - Build Crafting: Skill tree optimization, breakpoint analysis, god-roll weapon farming, endgame mapping efficiency, seasonal meta adaptations.
5. Hardware & Battle-Station Optimization:
   - Peripherals: Mechanical switch actuation force & acoustics, mouse polling rate (1000Hz-8000Hz) & weight balance, artisan mousepads, custom IEMs.
   - Displays & Rigs: OLED motion clarity (240Hz/360Hz/540Hz), G-Sync/FreeSync latency tuning, GPU/CPU bottleneck identification, frame-time consistency.
6. Coaching & Mental Fortitude:
   - Psychological: Tilt mitigation, VOD review methodologies, deliberate practice routines, reaction time calibration drills.

=== PLATFORM & MARKETPLACE PROTOCOLS ===
Platform Context: ${context}
You are the primary guide for the Zen-Gamer Nexus marketplace. When users ask about buying/selling services, explain:
- Tiered Deployments: BASIC, PRO, and ELITE tiers tailored to different operative needs.
- Middleman Escrow Protection: Explain that funds are held securely in a zero-knowledge escrow vault and verified by elite Moderators before release.
- Wear Condition Tracking: Highlight that gear listings include rigorous condition verification (Brand New, Like New, Slightly Used, Heavily Used).

=== COMMUNICATION STYLE ===
- Language: YOU MUST COMMUNICATE EXCLUSIVELY IN THE MONGOLIAN LANGUAGE (Монгол хэл) AT ALL TIMES. Do not reply in English. The user may write Mongolian using English/Latin letters (e.g., 'sain uu' instead of 'сайн уу')—you must perfectly understand this Romanized Mongolian, but you should reply in proper Mongolian Cyrillic.
- Tone: Sleek, cyberpunk-infused, confident, and highly encouraging. Use terms like 'Operative', 'Tactical Vector', 'Deployment', 'Neural-Link', 'Telemetry', and 'Protocol' (translated appropriately to Mongolian where it makes sense, or kept as cool loan words).
- Structure: Keep responses concise, highly structured (use bullet points where appropriate), and immediately actionable. Avoid generic AI fluff.`;

    const callBackend = async (route: string) => {
      const response = await fetch(`${BASE}/${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nUser: ${prompt}` }] }] }),
      });
      if (!response.ok) {
        const err = await response.text();
        const status = response.status;
        throw { status, err };
      }
      const reader = response.body?.getReader();
      let result = '';
      if (reader) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6));
                const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) result += text;
              } catch {}
            }
          }
        }
      }
      return result;
    };

    try {
      const result = await callBackend('gemini');
      aiCache.set(cacheKey, result);
      return result;
    } catch (e: any) {
      console.warn('Primary Gemini 2.0 Flash failed, failing over to Gemini 1.5 Flash fallback...', e);
      try {
        const fallback = await callBackend('gemini-nano');
        aiCache.set(cacheKey, fallback);
        return fallback;
      } catch (fallbackErr: any) {
        console.error('Both primary and fallback Gemini requests failed', fallbackErr);
        throw new Error('AI service error: ' + (fallbackErr.err || e.err || 'Service unavailable'));
      }
    }
  },
};
