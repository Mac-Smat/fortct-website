import { useInView } from '../hooks/useInView'
import { cn } from '../lib/utils'

// Fade-and-rise wrapper for content blocks (scroll-triggered via useInView)
export function Reveal({ children, className = '', delay = 0, as: Tag = 'div' }) {
  const [ref, inView] = useInView()
  return (
    <Tag
      ref={ref}
      className={cn('reveal', inView && 'reveal-in', className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export default Reveal