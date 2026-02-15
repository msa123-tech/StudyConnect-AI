import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion'
import { useEffect } from 'react'

export default function InteractiveBackground() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Global scroll progress for parallax
    const { scrollYProgress } = useScroll()

    // Smooth spring animation for mouse follow
    const springConfig = { damping: 25, stiffness: 150 }
    const mouseParallaxX = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), springConfig)
    const mouseParallaxY = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), springConfig)

    // Rotate based on mouse position
    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [5, -5]), springConfig)
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), springConfig)

    // Scroll-based transformations for robot
    const scrollY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -150, -300])
    const scrollScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.15, 1.1, 1.05])
    const scrollRotate = useTransform(scrollYProgress, [0, 0.5, 1], [0, 10, 20])
    const scrollOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.08, 0.12, 0.1, 0.06])

    // Smooth scroll transforms with spring
    const smoothScrollY = useSpring(scrollY, { stiffness: 100, damping: 30 })
    const smoothScrollScale = useSpring(scrollScale, { stiffness: 100, damping: 30 })
    const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 100, damping: 30 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize mouse coordinates to -1 to 1
            const normalizedX = (e.clientX / window.innerWidth) * 2 - 1
            const normalizedY = (e.clientY / window.innerHeight) * 2 - 1
            mouseX.set(normalizedX)
            mouseY.set(normalizedY)
        }

        const handleDeviceOrientation = (e) => {
            if (e.beta && e.gamma) {
                const normalizedX = e.gamma / 90
                const normalizedY = e.beta / 90
                mouseX.set(normalizedX)
                mouseY.set(normalizedY)
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        window.addEventListener('deviceorientation', handleDeviceOrientation)
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            window.removeEventListener('deviceorientation', handleDeviceOrientation)
        }
    }, [mouseX, mouseY])

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* ── Premium Texture Layer ── */}
            <div
                className="absolute inset-0 z-0 bg-[#050a18]"
                style={{
                    background: `
            radial-gradient(circle at 50% 50%, rgba(12, 18, 34, 0.4) 0%, rgba(5, 10, 24, 0.95) 100%),
            url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E")
          `,
                    backgroundSize: 'cover, 200px 200px',
                }}
            />

            {/* ── Animated Gradient Mesh (Subtle) ── */}
            <div className="absolute inset-0 opacity-30">
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[120px]"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-500/20 blur-[120px]"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.25, 0.2] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                />
                <motion.div
                    className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-accent-400/10 blur-[100px]"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                />
            </div>

            {/* ── Floating Robot (Logo) with Scroll Parallax ── */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] select-none"
                style={{
                    x: mouseParallaxX,
                    y: useTransform(
                        [mouseParallaxY, smoothScrollY],
                        ([mouse, scroll]) => mouse + scroll
                    ),
                    rotateX,
                    rotateY: useTransform(
                        [rotateY, smoothScrollRotate],
                        ([mouse, scroll]) => mouse + scroll
                    ),
                    scale: smoothScrollScale,
                    opacity: scrollOpacity,
                    perspective: 1000,
                }}
            >
                <motion.img
                    src="/logo.png"
                    alt=""
                    className="w-full h-full object-contain drop-shadow-2xl"
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 2, -2, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            </motion.div>

            {/* ── Grid Overlay (Tech feel) with scroll parallax ── */}
            <motion.div
                className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxwYXRoIGQ9Ik02MCA2MEwwIDYwTDAgMEw2MCAwTDYwIDYwWk0xIDFMNXkgNTlMMSA1OVoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+Cjwvc3ZnPg==')]"
                style={{
                    opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.2, 0.15, 0.1]),
                }}
            />
        </div>
    )
}
