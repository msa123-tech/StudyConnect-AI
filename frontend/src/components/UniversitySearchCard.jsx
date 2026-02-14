import { useState, useRef, useEffect } from 'react'
import { fetchColleges } from '../api/client'

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
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchColleges()
      .then((data) => setColleges(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const suggestions = query.trim()
    ? colleges.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.short_name.toLowerCase().includes(query.toLowerCase())
      )
    : colleges

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

  function submitCollege(college) {
    if (!college) {
      const match = suggestions[0] || (query.trim() && { id: 0, name: query.trim(), short_name: query.trim(), domain: '' })
      if (match) {
        setOpen(false)
        onSelect(match)
      }
      return
    }
    setOpen(false)
    onSelect(college)
  }

  function handleSelect(college) {
    setQuery(college.name)
    submitCollege(college)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (open && suggestions.length > 0) {
        const chosen = suggestions[highlightIndex] ?? suggestions[0]
        handleSelect(chosen)
      } else if (suggestions.length > 0) {
        submitCollege(suggestions[0])
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
            placeholder={loading ? 'Loading colleges...' : placeholder}
            disabled={loading}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-5 py-4 text-base text-slate-900 placeholder-slate-400 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/30 transition-all duration-200 disabled:opacity-70"
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent-500">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
        )}
        {helperText && (
          <p className="mt-3 text-slate-500 text-sm text-center max-w-md mx-auto">
            {helperText}
          </p>
        )}
        {open && (
          <ul
            className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 bg-white py-2 shadow-soft-lg animate-fade-in max-h-60 overflow-auto"
            role="listbox"
          >
            {loading ? (
              <li className="px-5 py-4 text-slate-500 text-sm">Loading...</li>
            ) : suggestions.length ? (
              suggestions.map((college, i) => (
                <li
                  key={college.id}
                  role="option"
                  aria-selected={i === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => handleSelect(college)}
                  className={`cursor-pointer px-5 py-3 text-left transition-colors duration-150 ${
                    i === highlightIndex ? 'bg-accent-100 text-accent-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {college.name} ({college.short_name})
                </li>
              ))
            ) : (
              <li className="px-5 py-4 text-slate-500 text-sm">
                No matches. Try another search.
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
