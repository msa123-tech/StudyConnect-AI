/**
 * API client for StudyConnect backend.
 * Set VITE_API_URL in .env to override (e.g. VITE_API_URL=http://localhost:8000)
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    const msg = Array.isArray(err.detail)
      ? (err.detail[0]?.msg || err.detail[0]?.loc?.join('. '))
      : (err.detail || res.statusText)
    throw new Error(msg || res.statusText)
  }
  return res.json()
}

export async function fetchColleges() {
  return request('/colleges')
}

export async function login(email, password, collegeId) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, college_id: collegeId }),
    credentials: 'include',
  })
}

export async function fetchMe(token) {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  })
}
