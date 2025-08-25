import { ApiEnvelope, Leader, Coach } from '@/lib/types';

const API_BASE = 'https://victory-api.easycharge.fun';
const USE_MOCK = true;

// async function json<T>(path: string, init?: RequestInit): Promise<T> {
//   const res = await fetch(`${API_BASE}${path}`, {
//     ...init,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(init?.headers || {}),
//     },
//     cache: 'no-store',
//   });
//   if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
//   return res.json() as Promise<T>;
// }

async function json<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);

  // 先拿到原始 JSON
  const raw = (await res.json()) as ApiEnvelope<T> | T;

  // 如果是信封结构并且返回码不是成功，抛错
  if (raw && typeof raw === 'object' && 'code' in raw) {
    const env = raw as ApiEnvelope<T>;
    if (env.code !== undefined && env.code !== 0 && env.code !== 200) {
      throw new Error(env.msg || env.msg || `API ${path} error: ${env.code}`);
    }
  }

  // 统一“拆信封”
  return unwrap<T>(raw);
}

export const api = {
  bossOverview: () => json('/overview'),
  leaderOverview: (reviewer?: string) =>
    json(
      `/leader/overview${
        reviewer ? `?reviewer=${encodeURIComponent(reviewer)}` : ''
      }`
    ),
  coachOverview: (coach?: string) =>
    json(
      `/coach/overview${coach ? `?coach=${encodeURIComponent(coach)}` : ''}`
    ),
  coachSessions: (coach?: string) =>
    json(
      `/coach/sessions${coach ? `?coach=${encodeURIComponent(coach)}` : ''}`
    ),
  listLeaders: () => json<Leader[]>('/leaders'),
  listCoaches: () => json<Coach[]>('/coaches'),
  listCoachesByLeader: (reviewer?: string) =>
    json(
      `/leader/coaches${
        reviewer ? `?reviewer=${encodeURIComponent(reviewer)}` : ''
      }`
    ),
};

function unwrap<T>(raw: unknown): T {
  // 1) 如果是字符串（常见“包成字符串”的情况）→ 再 JSON.parse 一次
  if (typeof raw === 'string') {
    return JSON.parse(raw) as T;
  }

  // 2) 如果是对象，优先找 data/result/payload
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    const key = ['data', 'result', 'payload'].find((k) => k in obj);
    if (key) {
      const inner = obj[key];
      return typeof inner === 'string'
        ? (JSON.parse(inner) as T)
        : (inner as T);
    }
  }

  // 3) 否则原样返回（允许后端直接就是数据本体）
  return raw as T;
}
