import { useState, useRef, useEffect } from 'react'

export const MOCK_UNIVERSITIES = [
  'George Mason University',
  'Virginia Tech',
  'UCLA',
  'NYU',
  'Harvard University',
  'Stanford University',
  'University of Texas',
]

export default function UniversitySearchCard({
  title = 'Enter your college',
  subtitle = 'Search for your university below to continue.',
  placeholder = 'Search your university',
  helperText = 'Use your official college email to continue. Only verified students can access StudyConnect.',
  onSelect,
  compact = false,
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlightIndex, setHighlightIndex] = useState(0)
  const containerRef = useRef(null)

  const suggestions = query.trim()
    ? MOCK_UNIVERSITIES.filter((c) =>
        c.toLowerCase().includes(query.toLowerCase())
      )
    : MOCK_UNIVERSITIES

  useEffect(() => {
    setHighlightIndex(0)
  }, [query, open])

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function submitCollege(name) {
    const collegeName = (name || query.trim()) || 'Your University'
    setOpen(false)
    onSelect(collegeName)
  }

  function handleSelect(college) {
    setQuery(college)
    submitCollege(college)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (open && suggestions.length > 0) {
        handleSelect(suggestions[highlightIndex])
      } else {
        submitCollege(query.trim())
      }
      return
    }
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlightIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className={compact ? '' : 'rounded-2xl border-2 border-accent-200/50 bg-white p-8 sm:p-10 shadow-soft-lg'}>
      <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-center">
        {title}
      </h2>
      <p className="mt-3 text-slate-600 text-center max-w-md mx-auto leading-relaxed">
        {subtitle}
      </p>
      <div ref={containerRef} className={`relative ${compact ? 'mt-6' : 'mt-8'}`}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30 transition-all duration-200"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        {helperText && (
          <p className="mt-3 text-slate-500 text-sm text-center max-w-md mx-auto">
            {helperText}
          </p>
        )}
        {open && (
          <ul
            className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-soft-lg animate-fade-in"
            role="listbox"
          >
            {suggestions.length ? (
              suggestions.map((college, i) => (
                <li
                  key={college}
                  role="option"
                  aria-selected={i === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => handleSelect(college)}
                  className={`cursor-pointer px-5 py-3 text-left transition-colors duration-150 ${
                    i === highlightIndex ? 'bg-accent-100 text-accent-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {college}
                </li>
              ))
            ) : (
              <li className="px-5 py-4 text-slate-500 text-sm">
                Press Enter to continue with &quot;{query}&quot;
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
