import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Scrolls window to top only when the route (pathname) changes via navigation.
 * Does not scroll on initial load/refresh, so the page doesn't jump on refresh.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()
  const isFirstMount = useRef(true)

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
