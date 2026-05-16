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
    body: isForm
      ? (body as FormData)
      : body
      ? JSON.stringify(body)
      : undefined,
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
    request<AuthResponse>('POST', '/auth/register', { username, email, password }),

  login: (email: string, password: string) =>
    request<AuthResponse>('POST', '/auth/login', { email, password }),

  googleLogin: (email: string, username: string) =>
    request<AuthResponse>('POST', '/auth/google', { email, username }),

  me: () => request<AuthUser>('GET', '/auth/me'),
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
      Object.fromEntries(
        Object.entries(params ?? {}).filter(([, v]) => v),
      ) as Record<string, string>,
    ).toString();
    return request<Product[]>('GET', `/products${qs ? `?${qs}` : ''}`);
  },

  get: (id: string) => request<Product>('GET', `/products/${id}`),

  mine: () => request<Product[]>('GET', '/my-products'),

  create: (data: Partial<Product>) =>
    request<{ id: string; message: string }>('POST', '/products', data),

  delete: (id: string) =>
    request<{ message: string }>('DELETE', `/products/${id}`),
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
  readAll: () => request<{success: boolean}>('POST', '/notifications/read-all'),
};

export const orders = {

  list: () => request<Order[]>('GET', '/orders'),
  create: (product_id: string, tier = 'PRO') =>
    request<{ id: string; total: number }>('POST', '/orders', { product_id, tier }),
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
    request<{ id: string; existing?: boolean }>('POST', '/conversations', {
      seller_id,
      product_id,
    }),

  messages: (id: string) =>
    request<ApiMessage[]>('GET', `/conversations/${id}/messages`),

  send: (id: string, text: string) =>
    request<{ id: string; created_at: string }>(
      'POST',
      `/conversations/${id}/messages`,
      { text },
    ),
};

// ── Upload ────────────────────────────────────────────────────
export const uploadImage = async (file: File): Promise<{ url: string }> => {
  const fd = new FormData();
  fd.append('image', file);
  return request<{ url: string }>('POST', '/upload', fd, true);
};

// ── Admin ────────────────────────────────────────────────────
export const admin = {
  stats: () => request<{ 
    totalRevenue: number; 
    totalOrders: number; 
    totalUsers: number; 
    activeListings: number; 
  }>('GET', '/admin/stats'),

  orders: () => request<Order[]>('GET', '/admin/orders'),

  users: () => request<AuthUser[]>('GET', '/admin/users'),
};

// ── Health ────────────────────────────────────────────────────

export const health = () =>
  request<{ status: string; db: string; time: string }>('GET', '/health');
