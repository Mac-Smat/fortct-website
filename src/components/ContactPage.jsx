import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Check } from 'lucide-react'
import { Tiles } from './Tiles.jsx'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'
import { TextReveal } from './TextReveal.jsx'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import ContactMap from './ContactMap.jsx'
import ContactForm from './ContactForm.jsx'
import { FooterBackgroundGradient } from './HoverFooter.jsx'

const SERVICE_CARDS = [
  { title: 'Branding', note: 'Identity & design' },
  { title: 'General Printing', note: 'Flyers, stationery & more' },
  { title: 'Billboard Construction & Installation', note: 'Outdoor advertising' },
  { title: 'Large Format Print', note: 'Banners, signage & wraps' },
]

const infoCards = [
  {
    icon: <MapPin className="w-5 h-5 text-white" />,
    label: 'Visit Us',
    value: '86, Ile-Pupa Bus Stop, Ibadan',
    href: null,
  },
  {
    icon: <Phone className="w-5 h-5 text-white" />,
    label: 'Call Us',
    value: '0707 787 5475',
    href: 'tel:+2347077875475',
  },
  {
    icon: <Mail className="w-5 h-5 text-white" />,
    label: 'Email Us',
    value: 'hello@fortct.ltd',
    href: 'mailto:hello@fortct.ltd',
  },
  {
    icon: <Clock className="w-5 h-5 text-white" />,
    label: 'Business Hours',
    value: 'Open 24 Hours',
    href: null,
  },
]

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.63 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

const socialLinks = [
  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
  { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
]

export default function ContactPage() {
  const [selectedService, setSelectedService] = useState('')

  const handleServiceSelect = (title) => {
    setSelectedService(title)
    document
      .getElementById('contact-form')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {/* ============ CONTACT HERO ============ */}
      <section className="relative w-full max-w-[1280px] mx-auto px-4 pt-6 pb-16 md:pb-24 overflow-hidden">
        {/* Tiles background — full-bleed, ~20% opacity (matches Landing Hero) */}
        <div
          className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden opacity-20"
          aria-hidden="true"
        >
          <Tiles rows={30} tileSize="md" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center justify-center px-4 py-2.5 border border-black rounded-[20px] mb-6 dark:border-[#3A3A3E]">
              <span className="text-[14px] font-normal text-[#524848] leading-[17px] tracking-wide dark:text-[#A1A1AA]">
                CONTACT US
              </span>
            </div>
          </Reveal>

          <div className="relative w-full max-w-[980px] mx-auto px-4">
            <TextReveal
              as="h1"
              per="line"
              preset="fade-in-blur"
              className="text-[34px] sm:text-[48px] md:text-[60px] lg:text-[72px] font-medium leading-[1.08] text-[#000000] tracking-normal uppercase dark:text-[#F2F2F1]"
            >
              {"Let's Bring Your\nIdeas to Life"}
            </TextReveal>
            <TextReveal
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-6 max-w-[700px] mx-auto text-[15px] sm:text-[18px] font-normal leading-[28px] text-[#323232]/80 uppercase dark:text-white/70"
            >
              PRINTING · BRANDING · BILLBOARDS · LARGE FORMAT · DESIGN SERVICES — TELL US WHAT YOU NEED AND WE&apos;LL HANDLE THE REST.
            </TextReveal>
          </div>
        </div>
      </section>

      {/* ============ WHAT CAN WE HELP YOU WITH (SERVICE SELECTOR) ============ */}
      <section className="w-full bg-white dark:bg-[#0C0C0E]">
        <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
          <Reveal className="flex flex-col items-center text-center">
            <RevealHeading
              as="h2"
              per="word"
              preset="fade-in-blur"
              className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-[#1A1C1C] leading-[36px] sm:leading-[44px] tracking-[-0.96px] dark:text-[#F2F2F1]"
            >
              What can we help you with?
            </RevealHeading>
            <RevealHeading
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-4 text-[15px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]"
            >
              Select a service to jump straight to the form.
            </RevealHeading>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
            {SERVICE_CARDS.map((card, i) => {
              const isSelected = selectedService === card.title
              return (
                <Reveal key={card.title} delay={i * 70}>
                  <button
                    type="button"
                    onClick={() => handleServiceSelect(card.title)}
                    aria-pressed={isSelected}
                    className={`w-full text-left rounded-[24px] border p-6 transition-colors duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-[#3D4D2B] bg-[#F9F9F9] dark:bg-[#1A1A1E] dark:border-[#AAB95F]'
                        : 'border-[#C5C8BC]/60 bg-white hover:border-[#3D4D2B]/40 dark:bg-[#1A1A1E] dark:border-[#26262B] dark:hover:border-[#AAB95F]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <span className="text-[16px] font-bold leading-[22px] text-[#1A1C1C] dark:text-[#F2F2F1]">
                          {card.title}
                        </span>
                        <span className="text-[12px] font-normal leading-[16px] text-[#45483F]/70 dark:text-[#A1A1AA]/70">
                          {card.note}
                        </span>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${
                          isSelected
                            ? 'bg-[#E0EC38] border-[#E0EC38]'
                            : 'border-[#C5C8BC] dark:border-[#26262B]'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-[#1B1D00]" />}
                      </span>
                    </div>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============ CONTACT INFORMATION + FORM ============ */}
      <section id="contact" className="w-full bg-[#F9F9F9] dark:bg-[#131316]">
        <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 lg:gap-12 items-start">
            {/* Left column — contact information */}
            <Reveal delay={0}>
              <div className="flex flex-col gap-5">
                {infoCards.map((card) => (
                  <div
                    key={card.label}
                    className="flex items-center gap-4 bg-white rounded-[24px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] dark:bg-[#1A1A1E] dark:shadow-none"
                  >
                    <div className="w-[48px] h-[48px] rounded-full bg-[#3D4D2B] flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-normal text-[#D0D2CA] leading-[16px] dark:text-[#70707A]">
                        {card.label}
                      </span>
                      {card.href ? (
                        <a
                          href={card.href}
                          className="text-[16px] font-medium text-[#1A1C1C] leading-[24px] hover:text-[#3D4D2B] transition-colors break-words dark:text-[#F2F2F1] dark:hover:text-[#AAB95F]"
                        >
                          {card.value}
                        </a>
                      ) : (
                        <span className="text-[16px] font-medium text-[#1A1C1C] leading-[24px] break-words dark:text-[#F2F2F1]">
                          {card.value}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Social media */}
                <div className="flex items-center justify-between gap-4 bg-white rounded-[24px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] dark:bg-[#1A1A1E] dark:shadow-none">
                  <span className="text-[12px] font-normal text-[#D0D2CA] leading-[16px] dark:text-[#70707A]">
                    Follow Us
                  </span>
                  <div className="flex items-center gap-3">
                    {socialLinks.map(({ icon, label, href }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        className="w-[44px] h-[44px] rounded-full border border-[#C5C8BC]/60 flex items-center justify-center text-[#45483F] hover:bg-[#3D4D2B] hover:text-white hover:border-[#3D4D2B] transition-colors duration-300 dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:bg-[#AAB95F] dark:hover:text-[#1B1D00]"
                      >
                        {icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right column — contact form */}
            <Reveal delay={120}>
              <div
                id="contact-form"
                className="bg-white rounded-[24px] shadow-[0_2px_24px_rgba(0,0,0,0.05)] p-6 sm:p-10 dark:bg-[#1A1A1E] dark:shadow-none scroll-mt-24"
              >
                <div className="mb-8">
                  <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1A1C1C] leading-[34px] tracking-[-0.48px] dark:text-[#F2F2F1]">
                    Send us a message
                  </h2>
                  <p className="mt-2 text-[15px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]">
                    Fill in the form and our team will get back to you shortly.
                  </p>
                </div>
                <ContactForm selectedService={selectedService} onServiceChange={setSelectedService} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ FIND US / LOCATION ============ */}
      <section className="w-full bg-white dark:bg-[#0C0C0E]">
        <div className="max-w-[1280px] mx-auto px-6 py-14 md:py-20">
          <Reveal className="flex flex-col items-center text-center mb-10">
            <RevealHeading
              as="h2"
              per="word"
              preset="fade-in-blur"
              className="text-[28px] sm:text-[36px] lg:text-[44px] font-bold text-[#1A1C1C] leading-[36px] sm:leading-[44px] tracking-[-0.96px] dark:text-[#F2F2F1]"
            >
              Find Us
            </RevealHeading>
            <RevealHeading
              as="p"
              per="word"
              preset="fade"
              speedReveal={1.4}
              className="mt-4 text-[15px] font-normal leading-[24px] text-[#45483F] dark:text-[#A1A1AA]"
            >
              86, Ile-Pupa Bus Stop, Ibadan
            </RevealHeading>
          </Reveal>

          <Reveal delay={120}>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-[24px] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.05)] border border-[#C5C8BC]/40 dark:border-[#26262B]">
                <div className="relative">
                  <ContactMap className="w-full lg:w-full h-[340px] lg:h-[420px] rounded-none" />
                </div>
              </div>
              <div className="flex justify-center mt-8">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=86+Ile-Pupa+Bus+Stop+Ibadan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Get directions to FortCT on Google Maps"
                >
                  <LiquidMetalButton variant="light" label="Get Directions" showArrow width={190} />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="w-full bg-[#F9F9F9] px-6 pb-16 md:pb-24 dark:bg-[#131316]">
        <Reveal delay={0}>
          <div className="relative max-w-5xl mx-auto rounded-[28px] bg-[#0F0F11] overflow-hidden text-center py-16 md:py-24 px-6 sm:px-10">
            <FooterBackgroundGradient />
            <div className="relative z-10 flex flex-col items-center">
              <RevealHeading
                as="h2"
                per="word"
                preset="fade-in-blur"
                className="text-2xl sm:text-3xl md:text-[40px] font-bold text-white max-w-2xl tracking-tight leading-snug"
              >
                Have a project in mind?
              </RevealHeading>
              <Reveal delay={120}>
                <div className="h-[3px] w-32 my-6 bg-gradient-to-l from-transparent to-[#E0EC38]" />
              </Reveal>
              <Reveal delay={200}>
                <p className="text-sm md:text-base text-white/85 max-w-xl leading-relaxed">
                  Let&apos;s talk about it. Reach out directly and get a fast, no-obligation
                  response from our team.
                </p>
              </Reveal>
              <Reveal delay={300}>
                <div
                  className="mt-8"
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    document
                      .getElementById('contact-form')
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      document
                        .getElementById('contact-form')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                >
                  <LiquidMetalButton variant="light" label="Contact Us" showArrow width={180} />
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}