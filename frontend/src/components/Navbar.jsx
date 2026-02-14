import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
]

export default function Navbar({ onOpenSelectCollege }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 shadow-lg" style={{ backgroundColor: 'rgba(12, 18, 34, 0.97)' }}>
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-white hover:text-accent-400 transition-colors duration-200"
        >
          StudyConnect
        </Link>
        <div className="flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <button
            type="button"
            onClick={onOpenSelectCollege}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200"
          >
            Select College
          </button>
          <button
            type="button"
            onClick={onOpenSelectCollege}
            className="text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  )
}
