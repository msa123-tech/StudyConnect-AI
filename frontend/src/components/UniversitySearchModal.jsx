import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import UniversitySearchCard from './UniversitySearchCard'

export default function UniversitySearchModal({ onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  function handleSelect(college) {
    const params = new URLSearchParams({
      college_id: college.id,
      college: college.name,
      domain: college.domain,
    })
    navigate(`/login?${params.toString()}`)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl"
      style={{ backgroundColor: 'rgba(12, 18, 34, 0.88)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ type: 'spring', damping: 26, stiffness: 280, mass: 0.9 }}
      >
        <UniversitySearchCard
          title="Enter your college"
          subtitle="Search for your university below to continue."
          placeholder="Search your university (e.g. GMU)"
          helperText="Use your official college email to continue. Only verified students can access StudyConnect."
          onSelect={handleSelect}
          inModal
        />
        <motion.button
          type="button"
          onClick={onClose}
          className="mt-5 w-full py-3 text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
