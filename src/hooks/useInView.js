import { useEffect, useRef, useState } from 'react'

export const OBSERVER_OPTIONS = { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }

export function useInView(options = OBSERVER_OPTIONS) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      options
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [options])

  return [ref, inView]
}