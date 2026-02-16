import { motion } from "framer-motion";
import { dashboardAcademicSnapshot } from "../data/academicMock";

export default function AcademicSnapshot() {
  const { upcomingAssignment, upcomingExam, aiStudySuggestion } =
    dashboardAcademicSnapshot;

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
        Academic Snapshot
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:shadow-soft-lg hover:border-slate-300">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Next Assignment
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {upcomingAssignment.courseCode} – {upcomingAssignment.title}
          </p>
          <p className="mt-1 text-sm text-accent-600 font-medium">
            due in {upcomingAssignment.dueIn}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-soft transition-all hover:shadow-soft-lg hover:border-slate-300">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Upcoming Exam
          </p>
          <p className="mt-2 font-semibold text-slate-800">
            {upcomingExam.courseCode} – {upcomingExam.title}
          </p>
          <p className="mt-1 text-sm text-accent-600 font-medium">
            in {upcomingExam.in}
          </p>
        </div>
        <div className="rounded-xl border border-accent-200 bg-accent-50 p-5 shadow-soft transition-all hover:shadow-soft-lg hover:border-accent-300">
          <p className="text-xs font-medium uppercase tracking-wider text-accent-600">
            AI Study Suggestion
          </p>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">
            {aiStudySuggestion.text}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
