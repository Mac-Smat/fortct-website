import aboutMainImage1 from '../../assets/About Us Section Images/about-main-image-1.webp'
import aboutMainImage2 from '../../assets/About Us Section Images/about-main-image-2.webp'
import aboutBadge from '../../assets/About Us Section Images/about-quality-badge.svg'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'
import TiltCard from './TiltCard.jsx'
import { useInView } from '../hooks/useInView'

function ProgressBar({ label, value }) {
  const [ref, inView] = useInView()
  return (
    <div ref={ref} className="flex flex-col gap-2">
      <div className="flex justify-between items-center text-[12px] font-semibold tracking-[0.6px] text-[#1A1C1C] dark:text-[#F2F2F1]">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-[8px] bg-[#E2E2E2] dark:bg-[#26262B] rounded-full relative overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#3D4D2B] dark:bg-[#AAB95F] rounded-full"
          style={{
            width: inView ? `${value}%` : '0%',
            transition: 'width 1.3s cubic-bezier(0.16, 1, 0.3, 1) 0.15s',
          }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[16px] h-[16px] bg-[#E0EC38] rounded-full shadow-md border-2 border-white" />
        </div>
      </div>
    </div>
  )
}

export default function AboutSection({ eyebrow = 'ABOUT US', learnMoreHref = '#learn-more' }) {
  return (
    <section className="relative w-full bg-[#F9F9F9] pt-14 pb-20 md:pt-20 md:pb-32 dark:bg-[#131316]">
      <div className="max-w-[1280px] mx-auto px-6">
        {/* Section Header */}
        <Reveal className="flex flex-col items-center text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4">
            <svg className="w-[13px] h-[13px] text-[#3D4D2B] dark:text-[#AAB95F]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            <span className="text-[12px] font-semibold tracking-[1.2px] uppercase text-[#3D4D2B] dark:text-[#AAB95F]">{eyebrow}</span>
          </div>
          <RevealHeading
            as="h2"
            per="line"
            preset="fade-in-blur"
            className="text-[32px] sm:text-[42px] md:text-[48px] font-bold leading-[40px] sm:leading-[56px] tracking-[-0.96px] text-[#1A1C1C] dark:text-[#F2F2F1]"
          >
            {'Precision Printing,\nTrusted Branding'}
          </RevealHeading>
        </Reveal>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left Column: Stacked Images with Circular Badge */}
          <Reveal className="relative flex flex-col sm:flex-row gap-4 items-center justify-center">
            <TiltCard className="w-full sm:w-[284px] h-[360px] sm:h-[500px] rounded-tl-[24px] rounded-tr-[100px] rounded-bl-[24px] rounded-br-[24px] overflow-hidden shadow-lg shrink-0">
              <img src={aboutMainImage1} alt="FortCT printing production workshop" className="w-full h-full object-cover" />
            </TiltCard>

            <TiltCard className="w-full sm:w-[284px] h-[360px] sm:h-[500px] rounded-tl-[24px] rounded-tr-[24px] rounded-bl-[24px] rounded-br-[100px] overflow-hidden shadow-lg shrink-0 sm:mt-12">
              <img src={aboutMainImage2} alt="FortCT large format printing equipment" className="w-full h-full object-cover" />
            </TiltCard>

            <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-[100px] h-[100px] sm:w-[128px] sm:h-[128px] rounded-full bg-[#3D4D2B] border-4 border-[#F9F9F9] dark:border-[#131316] shadow-2xl pointer-events-none select-none z-10">
              <img src={aboutBadge} alt="FortCT Quality" className="w-full h-full object-contain animate-spin-slow" />
            </div>
          </Reveal>

          {/* Right Column: Content & Progress Bars */}
          <Reveal delay={120} className="flex flex-col gap-8">
            <p className="text-[18px] font-normal leading-[28px] text-[#45483F] dark:text-[#A1A1AA]">
              We help organizations unlock growth and efficiency through high-quality printed materials and cohesive brand identities. From business cards to large-scale outdoor advertising, we deliver excellence.
            </p>

            <div className="flex flex-col gap-6">
              <ProgressBar label="Quality Assurance" value={98} />
              <ProgressBar label="On-Time Delivery" value={95} />
              <ProgressBar label="Client Satisfaction" value={100} />
            </div>

            <Reveal delay={160}>
              <div>
                <LiquidMetalButton
                  variant="light"
                  label="Learn More"
                  showArrow
                  onClick={() => {
                    if (learnMoreHref.startsWith('/')) {
                      window.location.href = learnMoreHref
                    } else {
                      window.location.hash = learnMoreHref
                    }
                  }}
                />
              </div>
            </Reveal>
          </Reveal>
        </div>

        {/* Floating UI Fact Cards */}
        <Reveal className="relative z-20 mt-12 lg:mt-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Reveal delay={0}>
              <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-between h-[170px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">Efficiency</span>
                  <span className="px-2 py-1 bg-[#E0EC38] text-[#1A1C1C] text-[12px] font-bold rounded">90%</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Fast</span>
                  <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Reliable</span>
                  <span className="px-3 py-1 bg-[#E2E2E2]/60 text-[#45483F] text-[12px] rounded-full dark:bg-white/10 dark:text-[#A1A1AA]">Quality</span>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={80}>
              <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col items-start justify-center h-[170px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                <div className="w-[48px] h-[48px] bg-[#E0EC38] rounded-full flex items-center justify-center mb-3">
                  <svg className="w-5 h-5 text-[#1A1C1C]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="text-[18px] font-bold text-[#1A1C1C] leading-[22px] dark:text-[#F2F2F1]">Open 24</div>
                <div className="text-[14px] font-normal text-[#C5C8BC] dark:text-[#6B6B73]">Hours</div>
              </TiltCard>
            </Reveal>

            <Reveal delay={160}>
              <TiltCard className="bg-[#1A1C1C] border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-center h-[170px] dark:border-[#2E2E33]">
                <p className="text-[18px] font-normal leading-[22.5px] text-[#E0EC38]">
                  Precision that Combines Strategy, Data, and Expert Printing
                </p>
              </TiltCard>
            </Reveal>

            <Reveal delay={240}>
              <TiltCard className="bg-white border border-[#C5C8BC] rounded-[24px] p-6 shadow-xl flex flex-col justify-between h-[166px] dark:bg-[#1A1A1E] dark:border-[#26262B]">
                <div className="flex justify-between items-center pb-3 border-b border-[#C5C8BC]/40 dark:border-[#26262B]">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-[#E0EC38]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">Print & Ship</span>
                  </div>
                  <span className="px-2 py-1 bg-[#E0EC38] text-[#1A1C1C] text-[12px] font-bold rounded">Fast</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <svg className="w-5 h-5 text-[#E0EC38]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-[14px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">6 Categories</span>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </Reveal>

        {/* Stats Row */}
        <Reveal className="mt-14 pt-10 pb-10 lg:mt-20 lg:pt-12 lg:pb-12 border-t border-b border-[#C5C8BC] dark:border-[#26262B]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Reveal delay={0}>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">3k+</span>
                  <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                </div>
                <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Successful Projects</span>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">200+</span>
                  <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                </div>
                <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Expert Team</span>
              </div>
            </Reveal>

            <Reveal delay={160}>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">350+</span>
                  <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                </div>
                <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Happy Customers</span>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[32px] font-bold text-[#1A1C1C] tracking-[-0.32px] dark:text-[#F2F2F1]">16+</span>
                  <span className="w-[12px] h-[12px] bg-[#E0EC38] rounded-full inline-block"></span>
                </div>
                <span className="text-[16px] font-normal text-[#45483F] dark:text-[#A1A1AA]">Years of Experience</span>
              </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  )
}