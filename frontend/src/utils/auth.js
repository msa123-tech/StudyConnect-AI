/** Simple auth storage — stores JWT in localStorage for session persistence. */

const TOKEN_KEY = 'studyconnect_token'

export function setToken(token) {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token)
  }
}

export function getToken() {
  if (typeof localStorage !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY)
  }
  return null
}

export function removeToken() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY)
  }
}

export function isAuthenticated() {
  return !!getToken()
}
