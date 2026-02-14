import { Link } from 'react-router-dom'

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1e293b 100%)' }}>
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold text-white">Contact</h1>
        <p className="mt-2 text-slate-400">Get in touch with the StudyConnect team.</p>
        <Link to="/" className="mt-6 inline-block text-accent-400 hover:text-accent-300 font-medium transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
