import { useNavigate } from 'react-router-dom'
import UniversitySearchCard from './UniversitySearchCard'

export default function CollegeSelector() {
  const navigate = useNavigate()

  function handleSelect(college) {
    const params = new URLSearchParams({ college })
    navigate(`/login?${params.toString()}`)
  }

  return (
    <section id="college" className="relative px-6 py-28 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent-50/30 to-slate-50 pointer-events-none" />
      <div className="relative mx-auto max-w-2xl">
        <UniversitySearchCard
          title="Select Your University"
          subtitle="Find your school to get started with StudyConnect. Search any university worldwide."
          placeholder="Search your university"
          onSelect={handleSelect}
        />
      </div>
    </section>
  )
}
