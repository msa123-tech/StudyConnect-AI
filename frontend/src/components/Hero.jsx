import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero({ onOpenStudentsEducators }) {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col justify-center px-6 py-20 md:py-28 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(12, 18, 34, 0.88) 0%, rgba(12, 18, 34, 0.82) 50%, rgba(12, 18, 34, 0.9) 100%), url('/herobg.png')`,
        backgroundColor: "#0c1222",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-1/2 -left-32 w-80 h-80 rounded-full bg-violet-500/15 blur-3xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
        />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] leading-[1.08]"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          AI-Powered Collaboration for College Students
        </motion.h1>
        <motion.p
          className="mt-10 text-lg sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed"
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Join course groups, chat with classmates, and get AI help for your
          studies.
        </motion.p>
        <motion.div
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            type="button"
            onClick={onOpenStudentsEducators}
            className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-lg transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.25)] hover:scale-[1.03]"
            whileTap={{ scale: 0.98 }}
          >
            Enter your college
          </motion.button>
        </motion.div>
        <p className="mt-12 text-xs text-slate-500 tracking-wide">
          Powered by PatriotAI
        </p>
      </div>
    </section>
  );
}
