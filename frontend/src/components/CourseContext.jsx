import { motion } from "framer-motion";
import { getCourseContextMock } from "../data/academicMock";

export default function CourseContext({
  courseId,
  courseName,
  courseCode,
  description,
  onAICta,
}) {
  const ctx = getCourseContextMock(
    courseId,
    courseName,
    courseCode,
    description,
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3">
        Course Context
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft sm:col-span-2 lg:col-span-1">
          <p className="text-xs font-medium text-slate-500">Description</p>
          <p className="mt-1 text-sm text-slate-700">{ctx.description}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-slate-500">Current topic</p>
          <p className="mt-1 text-sm text-slate-700">{ctx.currentTopic}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="text-xs font-medium text-slate-500">Next deadline</p>
          <p className="mt-1 text-sm text-accent-600 font-medium">
            {ctx.nextDeadline}
          </p>
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-accent-200 bg-accent-50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-soft">
        <div className="flex items-start gap-3">
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-100 text-accent-600"
            aria-hidden
          >
            ◆
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-accent-600">
              AI Insight
            </p>
            <p className="mt-0.5 text-sm text-slate-700">
              {ctx.aiInsight.text}
            </p>
          </div>
        </div>
        {onAICta && (
          <button
            type="button"
            onClick={onAICta}
            className="shrink-0 self-start sm:self-center rounded-lg border border-accent-300 bg-white px-4 py-2 text-sm font-medium text-accent-600 hover:bg-accent-50 transition-colors shadow-soft"
          >
            {ctx.aiInsight.cta}
          </button>
        )}
      </div>
    </motion.section>
  );
}
