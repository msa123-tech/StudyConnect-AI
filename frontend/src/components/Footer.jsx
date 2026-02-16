import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer
      className="relative border-t border-white/[0.06]"
      style={{ background: 'linear-gradient(180deg, #050a18 0%, #030712 100%)' }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="StudyConnect"
                className="h-8 w-auto object-contain"
              />
              <span className="font-display text-sm font-semibold text-white">StudyConnect</span>
            </div>
            <span className="text-slate-700 hidden sm:inline">·</span>
            <p className="text-xs text-slate-500">© 2026 StudyConnect · Powered by PatriotAI</p>
          </div>
          <div className="flex items-center gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200">
              Privacy
            </a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200">
              Terms
            </a>
            <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-300 transition-colors duration-200">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
