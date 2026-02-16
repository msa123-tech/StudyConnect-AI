import { Link, useLocation } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Navbar({ onOpenSelectCollege }) {
  const location = useLocation();
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 w-full"
      style={{
        backgroundColor: useTransform(
          bgOpacity,
          (v) => `rgba(5, 10, 24, ${v * 0.85})`,
        ),
        borderBottom: useTransform(
          borderOpacity,
          (v) => `1px solid rgba(255, 255, 255, ${v})`,
        ),
        backdropFilter: useTransform(
          scrollY,
          [0, 100],
          ["blur(0px)", "blur(20px)"],
        ),
        WebkitBackdropFilter: useTransform(
          scrollY,
          [0, 100],
          ["blur(0px)", "blur(20px)"],
        ),
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-9 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-xl font-bold tracking-tight text-white hover:text-accent-400 transition-colors duration-300 flex items-center gap-2.5"
        >
          <img
            src="/logo.png"
            alt="StudyConnect"
            className="h-9 w-auto object-contain"
          />
          StudyConnect
        </Link>

        <div className="flex items-center gap-8">
          {location.pathname === "/" && (
            <div className="hidden md:flex items-center gap-6">
              <button
                type="button"
                onClick={() => scrollToSection("features")}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("platform")}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Platform
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("vision")}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-200 bg-transparent border-none cursor-pointer"
              >
                Vision
              </button>
            </div>
          )}

          <motion.button
            type="button"
            onClick={onOpenSelectCollege}
            className="text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-accent-500 px-5 py-2.5 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
