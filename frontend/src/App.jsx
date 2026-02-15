import { Routes, Route, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './contexts/AuthContext'
import AuthenticatedShell from './layouts/AuthenticatedShell'
import InteractiveBackground from './components/InteractiveBackground'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import CoursePage from './pages/CoursePage'
import GroupPage from './pages/GroupPage'

function AnimatedLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  return (
    <>
      <InteractiveBackground />
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10"
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <AuthProvider>
        <Routes>
          <Route element={<AnimatedLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AuthenticatedShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/courses/:courseId" element={<CoursePage />} />
                <Route path="/groups/:groupId" element={<GroupPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  )
}
