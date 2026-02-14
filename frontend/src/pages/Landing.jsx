import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import LoginCallout from '../components/LoginCallout'
import Footer from '../components/Footer'
import UniversitySearchModal from '../components/UniversitySearchModal'

export default function Landing() {
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <>
      <Navbar onOpenSelectCollege={() => setSearchModalOpen(true)} />
      <main>
        <Hero onOpenStudentsEducators={() => setSearchModalOpen(true)} />
        <About />
        <Features />
        <LoginCallout />
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
