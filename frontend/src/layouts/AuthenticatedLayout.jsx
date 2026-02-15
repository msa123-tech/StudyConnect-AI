import { Outlet } from 'react-router-dom'
import AppSidebar from '../components/AppSidebar'

export default function AuthenticatedLayout({ userEmail, collegeName }) {
  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(135deg, #0c1222 0%, #1a2332 50%, #0c1222 100%)' }}
    >
      <AppSidebar userEmail={userEmail} collegeName={collegeName} />
      <main className="pl-64 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
