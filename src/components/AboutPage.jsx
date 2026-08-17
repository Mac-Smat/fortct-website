import AboutSection from './AboutSection.jsx'
import CtaBanner from './CtaBanner.jsx'
import TestimonialsSection from './TestimonialsSection.jsx'
import { RevealHeading } from './RevealHeading.jsx'
import { Reveal } from './Reveal.jsx'

const CONTACT_PATH = `${import.meta.env.BASE_URL}contact`

export default function AboutPage() {
  return (
    <>
      {/* Page header */}
      <section className="relative w-full max-w-[1280px] mx-auto px-6 pt-16 pb-4 md:pt-24">
        <div className="flex flex-col items-center text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4">
              <svg className="w-[13px] h-[13px] text-[#3D4D2B] dark:text-[#AAB95F]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-[12px] font-semibold tracking-[1.2px] uppercase text-[#3D4D2B] dark:text-[#AAB95F]">WHO WE ARE</span>
            </div>
          </Reveal>
          <RevealHeading
            as="h1"
            per="line"
            preset="fade-in-blur"
            className="text-[42px] sm:text-[56px] md:text-[64px] font-bold leading-[46px] sm:leading-[64px] tracking-[-0.96px] text-[#1A1C1C] dark:text-[#F2F2F1]"
          >
            {'About FortCT Ltd'}
          </RevealHeading>
          <RevealHeading
            as="p"
            per="word"
            preset="fade"
            speedReveal={1.4}
            className="mt-6 max-w-[720px] text-[15px] sm:text-[17px] font-normal leading-[28px] text-[#45483F] dark:text-[#A1A1AA]"
          >
            FortCT Ltd is a printing and branding company in Ibadan, Nigeria — combining industrial
            printing capability with creative branding expertise to deliver precision and quality for
            your business, from business cards to large-scale outdoor advertising.
          </RevealHeading>
        </div>
      </section>

      <AboutSection eyebrow="OUR STORY" learnMoreHref={CONTACT_PATH} />
      <TestimonialsSection />
      <CtaBanner navigateTo={CONTACT_PATH} headingAs="h2" />
    </>
  )
}