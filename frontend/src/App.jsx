import { Routes, Route, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollToTop from './components/ScrollToTop'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'

function AnimatedLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AnimatedLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
      </Routes>
    </>
  )
}
