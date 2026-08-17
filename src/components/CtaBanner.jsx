import ctaBannerImage from '../../assets/CTA Banner Section Images/cta-banner-image.webp'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'

export default function CtaBanner({ scrollTarget, navigateTo, headingAs = 'h2' }) {
  const handleQuoteClick = () => {
    if (scrollTarget) {
      document
        .getElementById(scrollTarget)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    if (navigateTo) {
      window.location.href = navigateTo
      return
    }
    window.location.hash = '#contact'
  }

  return (
    <section id="quote" className="w-full bg-[#F9F9F9] pb-20 px-6 dark:bg-[#131316]">
      <div className="relative max-w-5xl mx-auto w-full text-center overflow-hidden rounded-[28px] py-16 sm:py-20 md:py-24">
        <img
          src={ctaBannerImage}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#1A2E15]/40 via-[#1A2E15]/40 to-[#1A2E15]/40"
        />
        <div className="relative z-10 flex flex-col items-center px-6 sm:px-10">
          <RevealHeading
            as={headingAs}
            per="word"
            preset="fade-in-blur"
            className="text-2xl sm:text-3xl md:text-[40px] font-bold text-white max-w-2xl tracking-tight leading-snug"
          >
            Bring Your Next Project to Life
          </RevealHeading>
          <Reveal delay={120}>
            <div className="h-[3px] w-32 my-6 bg-gradient-to-l from-transparent to-[#E0EC38]" />
          </Reveal>
          <Reveal delay={200}>
            <p className="text-sm md:text-base text-white/85 max-w-xl leading-relaxed">
              Streamline your printing processes and empower your brand with our top-tier
              physical marketing products.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <LiquidMetalButton
              variant="light"
              label="Get a Quote"
              showArrow
              className="mt-8"
              onClick={handleQuoteClick}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}