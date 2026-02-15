import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export default function Hero({ onOpenStudentsEducators }) {
  return (
    <section
      className="relative overflow-hidden min-h-screen flex flex-col justify-center px-6 py-24 md:py-32 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(12, 18, 34, 0.88) 0%, rgba(12, 18, 34, 0.82) 50%, rgba(12, 18, 34, 0.9) 100%), url('/herobg.png')`,
        backgroundColor: "#0c1222",
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-cyan-500/20 blur-[100px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-violet-500/15 blur-[100px]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 w-64 h-64 rounded-full bg-accent-500/10 blur-[80px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
        />
      </div>

      <motion.div
        className="relative mx-auto max-w-[72rem] text-center"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="font-display text-4xl font-bold tracking-tight-display text-white sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem] leading-[1.1]"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          AI-Powered Collaboration for College Students
        </motion.h1>
        <motion.p
          className="mt-8 text-lg sm:text-xl md:text-[1.125rem] text-slate-300 max-w-2xl mx-auto leading-[1.7]"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          Join course groups, chat with classmates, and get AI help for your
          studies.
        </motion.p>
        <motion.div
          className="mt-16"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          <motion.button
            type="button"
            onClick={onOpenStudentsEducators}
            className="inline-flex items-center justify-center rounded-xl bg-white px-10 py-4 text-base font-semibold text-slate-900 shadow-soft-lg transition-all duration-300 hover:shadow-[0_0_40px_-8px_rgba(255,255,255,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            Enter your college
          </motion.button>
        </motion.div>
        <motion.p
          className="mt-14 text-xs text-slate-500 tracking-wider uppercase"
          variants={fadeUp}
          transition={{ duration: 0.5, delay: 0.24 }}
        >
          Powered by PatriotAI
        </motion.p>
      </motion.div>
    </section>
  );
}
