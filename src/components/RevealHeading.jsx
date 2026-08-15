import { useInView } from '../hooks/useInView'
import { TextReveal } from './TextReveal.jsx'
import { cn } from '../lib/utils'

export function RevealHeading({ children, as = 'h2', className, ...textRevealProps }) {
  const [ref, inView] = useInView()

  if (!inView) {
    const Tag = as
    return (
      <Tag ref={ref} className={cn('invisible', className)} aria-hidden="true">
        {children}
      </Tag>
    )
  }

  return (
    <TextReveal as={as} className={className} {...textRevealProps}>
      {children}
    </TextReveal>
  )
}