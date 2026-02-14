/**
 * Map college names to official email domains for login UX (helper text).
 * Used for "Must end with @domain.edu" validation hint.
 */
export const COLLEGE_EMAIL_DOMAINS = {
  'George Mason University': 'gmu.edu',
  'Virginia Tech': 'vt.edu',
  'UCLA': 'ucla.edu',
  'NYU': 'nyu.edu',
  'Harvard University': 'harvard.edu',
  'Stanford University': 'stanford.edu',
  'University of Texas': 'utexas.edu',
}

export function getEmailDomainForCollege(collegeName) {
  if (!collegeName || !collegeName.trim()) return null
  const normalized = collegeName.trim()
  return COLLEGE_EMAIL_DOMAINS[normalized] ?? null
}
