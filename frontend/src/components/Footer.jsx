import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10" style={{ backgroundColor: '#0c1222' }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-sm text-slate-400">© 2026 StudyConnect</p>
            <span className="text-xs text-slate-500 hidden sm:inline">·</span>
            <p className="text-xs text-slate-500">Powered by PatriotAI</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-slate-400 hover:text-accent-400 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-400 hover:text-accent-400 transition-colors duration-200">
              Terms
            </a>
            <Link to="/contact" className="text-sm text-slate-400 hover:text-accent-400 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
