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
    const params = new URLSearchParams({ college })
    navigate(`/login?${params.toString()}`)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-md"
      style={{ backgroundColor: 'rgba(12, 18, 34, 0.85)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <motion.div
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ type: 'spring', damping: 28, stiffness: 260, mass: 0.8 }}
      >
        <UniversitySearchCard
          title="Enter your college"
          subtitle="Search for your university below to continue."
          placeholder="Search your university (e.g. GMU)"
          helperText="Use your official college email to continue. Only verified students can access StudyConnect."
          onSelect={handleSelect}
        />
        <motion.button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 text-sm font-medium text-slate-500 hover:text-white transition-colors"
          whileHover={{ opacity: 1 }}
        >
          Cancel
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
