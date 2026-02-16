/**
 * API client for StudyConnect backend.
 * Set VITE_API_URL in .env to override (e.g. VITE_API_URL=http://localhost:8000)
 */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const WS_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/^http/, "ws");

function getAuthHeaders(token) {
  const h = { "Content-Type": "application/json" };
  if (token) h["Authorization"] = `Bearer ${token}`;
  return h;
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = Array.isArray(err.detail)
      ? err.detail[0]?.msg || err.detail[0]?.loc?.join(". ")
      : err.detail || res.statusText;
    throw new Error(msg || res.statusText);
  }
  return res.json();
}

async function requestAuth(path, token, options = {}) {
  return request(path, {
    ...options,
    headers: getAuthHeaders(token),
    credentials: "include",
  });
}

export async function fetchColleges() {
  return request("/colleges");
}

export async function login(email, password, collegeId) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password, college_id: collegeId }),
    credentials: "include",
  });
}

export async function fetchMe(token) {
  return requestAuth("/auth/me", token);
}

export async function fetchDashboard(token) {
  return requestAuth("/dashboard", token);
}

export async function fetchCourse(courseId, token) {
  return requestAuth(`/courses/${courseId}`, token);
}

export async function fetchCourseMessages(courseId, token, limit = 100) {
  return requestAuth(`/courses/${courseId}/messages?limit=${limit}`, token);
}

export async function fetchGroup(groupId, token) {
  return requestAuth(`/groups/${groupId}`, token);
}

export async function fetchGroupMessages(groupId, token, limit = 100) {
  return requestAuth(`/groups/${groupId}/messages?limit=${limit}`, token);
}

export async function createGroup(courseId, name, token) {
  return requestAuth(`/courses/${courseId}/groups`, token, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function joinGroup(groupId, token) {
  return requestAuth(`/groups/${groupId}/join`, token, {
    method: "POST",
  });
}

export function getWsUrl(path, token) {
  const base = WS_BASE.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}${token ? `?token=${encodeURIComponent(token)}` : ""}`;
}

export async function uploadCourseFile(courseId, file, token) {
  const url = `${API_BASE}/courses/${courseId}/upload`;
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    credentials: "include",
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = typeof err.detail === "string" ? err.detail : res.statusText;
    throw new Error(msg);
  }
  return res.json();
}

export async function courseAIQuery(courseId, question, token) {
  return requestAuth(`/courses/${courseId}/ai/query`, token, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

/** AI voice query: RAG + TTS for voice channel Ask AI. Returns { answer, audio_base64 }. */
export async function courseAIVoiceQuery(courseId, question, token) {
  return requestAuth(`/courses/${courseId}/ai/voice-query`, token, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export async function courseAISummary(courseId, token) {
  return requestAuth(`/courses/${courseId}/ai/summary`, token, {
    method: "POST",
  });
}
