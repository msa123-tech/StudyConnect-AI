import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProblemSection from '../components/ProblemSection'
import IntroSection from '../components/IntroSection'
import Features from '../components/Features'
import PlatformExperience from '../components/PlatformExperience'
import FutureVision from '../components/FutureVision'
import CTASection from '../components/CTASection'
import Footer from '../components/Footer'
import UniversitySearchModal from '../components/UniversitySearchModal'

export default function Landing() {
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <>
      <Navbar onOpenSelectCollege={() => setSearchModalOpen(true)} />
      <main>
        <Hero />
        <ProblemSection />
        <IntroSection onOpenSelectCollege={() => setSearchModalOpen(true)} />
        <Features />
        <PlatformExperience />
        <FutureVision />
        <CTASection onOpenSelectCollege={() => setSearchModalOpen(true)} />
      </main>
      <Footer />
      <AnimatePresence>
        {searchModalOpen && (
          <UniversitySearchModal key="college-modal" onClose={() => setSearchModalOpen(false)} />
        )}
      </AnimatePresence>
    </>
  )
}
