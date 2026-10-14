/**
 * EYE OF ODIN — API Client
 * Talks to the unified FastAPI backend (campus-grid endpoints).
 *
 * - Served by the backend itself (Render / uvicorn): same-origin, relative URLs.
 * - Static dev hosting (Live Server :5500, http.server :4200, file://): hits the
 *   FastAPI dev server on :8000 instead.
 * - Every request is timeout-guarded so the UI never hangs on a dead backend.
 */

const API_BASE = (() => {
  if (typeof window === 'undefined') return '';
  const { protocol, hostname, port } = window.location;
  const isStaticDevHost =
    protocol === 'file:' || ['4200', '5500', '3000'].includes(port);
  if (isStaticDevHost) {
    return `${protocol === 'file:' ? 'http' : protocol}//${hostname}:8000`;
  }
  return '';
})();

let _available = false;

async function request(path, options = {}) {
  const { timeoutMs = 6000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(API_BASE + path, { ...fetchOptions, signal: controller.signal });
    if (!res.ok) {
      const err = new Error(`API ${path} failed with status ${res.status}`);
      err.status = res.status;
      throw err;
    }
    if (res.status === 204) return null;
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Probe the backend once; result gates online/offline demo mode. */
export async function ping() {
  try {
    await request('/api/health', { timeoutMs: 2500 });
    _available = true;
  } catch {
    _available = false;
  }
  return _available;
}

export function isAvailable() {
  return _available;
}

export function apiBase() {
  return API_BASE;
}

export async function fetchItems() {
  const data = await request('/api/items');
  return Array.isArray(data?.items) ? data.items : [];
}

export async function createItem(item) {
  return request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
}

export async function patchItemStatus(itemId, payload) {
  return request(`/api/items/${encodeURIComponent(itemId)}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export async function deleteItem(itemId) {
  return request(`/api/items/${encodeURIComponent(itemId)}`, { method: 'DELETE' });
}

export async function createClaim(claim) {
  return request('/api/claims', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(claim)
  });
}

export async function resetDemo() {
  return request('/api/reset-demo', { method: 'POST' });
}
