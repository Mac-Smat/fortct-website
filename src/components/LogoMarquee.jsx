import * as React from 'react'
import { cn } from '../lib/utils'
import { Reveal } from './Reveal.jsx'

// Scroll duration per `speed` prop — consumed by .marquee-track in index.css
const SPEED_DURATION = {
  normal: '40s',
  slow: '80s',
  fast: '5s',
}

// Single logo tile: brand-colour gradient fades in behind the logo on hover
function LogoTile({ logo }) {
  return (
    <div className="group relative flex h-24 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#C5C8BC]/40 bg-[#F4F4F1] transition-colors duration-500 dark:border-[#26262B] dark:bg-[#1A1A1E]">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-150 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)] opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
        style={{
          '--from': logo.gradient.from,
          '--via': logo.gradient.via,
          '--to': logo.gradient.to,
        }}
      />
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        decoding="async"
        className="relative h-3/4 w-auto max-w-[72%] object-contain"
      />
    </div>
  )
}

/**
 * Infinitely scrolling, edge-masked logo marquee. Pauses on hover and reveals a
 * per-logo colour gradient. The loop is seamless because the logo set is rendered
 * twice and the track translates by exactly -50% (keep gap and trailing padding equal).
 */
export const LogoMarquee = React.forwardRef(function LogoMarquee(
  { title, description, logos = [], speed = 'normal', className, ...props },
  ref
) {
  const duration = SPEED_DURATION[speed] ?? SPEED_DURATION.normal

  return (
    <section
      ref={ref}
      aria-label={title}
      className={cn(
        'relative w-full overflow-hidden border-y border-[#C5C8BC]/40 bg-white dark:border-[#26262B] dark:bg-[#0C0C0E]',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="mx-auto max-w-[1280px] px-6 pt-12 md:pt-16">
        <Reveal className="grid grid-cols-1 gap-3 border-b border-[#C5C8BC]/40 pb-8 md:pb-10 lg:grid-cols-[3fr_2fr] lg:items-end lg:gap-10 dark:border-[#26262B]">
          <h2 className="text-[32px] font-bold leading-[40px] tracking-[-0.96px] text-[#1A1C1C] sm:text-[42px] sm:leading-[56px] md:text-[48px] dark:text-[#F2F2F1]">
            {title}
          </h2>
          <p className="max-w-[460px] text-[15px] leading-[26px] text-[#524848] lg:justify-self-end dark:text-[#A1A1AA]">
            {description}
          </p>
        </Reveal>
      </div>

      {/* Marquee viewport — soft fade at both edges */}
      <div
        className="marquee-viewport w-full overflow-hidden"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
        }}
      >
        <div
          className="marquee-track items-center gap-4 py-10 pr-4 md:py-12"
          style={{ '--marquee-duration': duration }}
        >
          {/* Rendered twice for a seamless loop; the clone is decorative only */}
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1 ? 'true' : undefined}
              className="flex items-center gap-4"
            >
              {logos.map((logo) => (
                <LogoTile key={`${copy}-${logo.alt}`} logo={logo} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
})

LogoMarquee.displayName = 'LogoMarquee'

export default LogoMarquee
