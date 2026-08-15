import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'
import ContactMap from './ContactMap.jsx'

function MailIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function LocationIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

const infoCards = [
  {
    icon: <MailIcon />,
    label: 'Email Address',
    value: 'hello@fortct.ltd',
    href: 'mailto:hello@fortct.ltd',
  },
  {
    icon: <PhoneIcon />,
    label: 'Phone Number',
    value: '0707 787 5475',
    href: 'tel:+2347077875475',
  },
  {
    icon: <LocationIcon />,
    label: 'Our Office',
    value: '86, Ile-Pupa Bus Stop, Ibadan',
  },
]

export default function ContactSection() {
  return (
    <section id="contact" className="relative w-full bg-[#F9F9F9] dark:bg-[#131316]">
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 pt-10 pb-10 md:pt-[50px] md:pb-[50px]">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center justify-center px-4 py-2 border border-[#F3F3F2] rounded-full dark:border-[#26262B]">
              <span className="text-[12px] font-semibold tracking-[0.6px] text-[#1A1C1C] leading-[16px] dark:text-[#F2F2F1]">
                CONTACT US
              </span>
            </div>
          </Reveal>
          <RevealHeading
            as="h2"
            per="word"
            preset="fade-in-blur"
            className="mt-6 text-[30px] sm:text-[40px] lg:text-[50px] font-bold text-[#1A2E15] leading-[38px] sm:leading-[48px] lg:leading-[56px] tracking-[-0.96px] dark:text-[#9FB04A]"
          >
            Get in touch, let us know how we can help
          </RevealHeading>
        </div>

        {/* Contact Info Cards (3:504) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-[24px] mt-10 md:mt-[64px]">
          {infoCards.map((card, i) => (
            <Reveal key={card.label} delay={i * 80}>
              <div className="flex items-center gap-4 bg-white rounded-[24px] p-6 shadow-[0_2px_24px_rgba(0,0,0,0.05)] dark:bg-[#1A1A1E] dark:shadow-none">
                <div className="w-[48px] h-[48px] rounded-full bg-[#3D4D2B] flex items-center justify-center shrink-0">
                  {card.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal text-[#D0D2CA] leading-[16px] dark:text-[#70707A]">{card.label}</span>
                  {card.href ? (
                    <a href={card.href} className="text-[16px] font-medium text-[#1A1C1C] leading-[24px] hover:text-[#3D4D2B] transition-colors dark:text-[#F2F2F1] dark:hover:text-[#AAB95F]">
                      {card.value}
                    </a>
                  ) : (
                    <span className="text-[16px] font-medium text-[#1A1C1C] leading-[24px] dark:text-[#F2F2F1]">{card.value}</span>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Map & Form Area (3:532) */}
        <Reveal delay={160}>
          <div className="mt-6 sm:mt-[32px] bg-white rounded-[24px] shadow-[0_2px_24px_rgba(0,0,0,0.05)] p-5 sm:p-[33px] sm:pr-[18px] dark:bg-[#1A1A1E] dark:shadow-none">
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-[41px]">
              <ContactMap />

            {/* Form */}
            <form className="flex-1 w-full lg:w-[573px] lg:pt-[28px]" onSubmit={(e) => e.preventDefault()}>
              {/* Row 1: Full Name | Email Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-[41px]">
                <div>
                  <label className="block mb-[4px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    className="w-full h-[48px] bg-[#F9F9F9] rounded-[12px] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 focus:ring-[#E0EC38]/60 transition-shadow dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
                  />
                </div>
                <div>
                  <label className="block mb-[4px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    className="w-full h-[48px] bg-[#F9F9F9] rounded-[12px] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 focus:ring-[#E0EC38]/60 transition-shadow dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
                  />
                </div>
              </div>

              {/* Row 2: Phone Number */}
              <div className="mt-6 sm:mt-[32px]">
                <label className="block mb-[4px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="w-full h-[48px] bg-[#F9F9F9] rounded-[12px] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 focus:ring-[#E0EC38]/60 transition-shadow dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
                />
              </div>

              {/* Row 3: Subject */}
              <div className="mt-6 sm:mt-[32px]">
                <label className="block mb-[4px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="How can we help you?"
                  className="w-full h-[48px] bg-[#F9F9F9] rounded-[12px] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 focus:ring-[#E0EC38]/60 transition-shadow dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
                />
              </div>

              {/* Row 4: Message */}
              <div className="mt-6 sm:mt-[32px]">
                <label className="block mb-[4px] text-[12px] font-normal text-[#666666] leading-[16px] dark:text-[#A1A1AA]">Message</label>
                <textarea
                  name="message"
                  rows="5"
                  placeholder="Type your message..."
                  className="w-full h-[124px] resize-none bg-[#F9F9F9] rounded-[12px] px-[14px] py-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 focus:ring-[#E0EC38]/60 transition-shadow dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
                />
              </div>

              {/* Submit */}
              <div className="flex justify-center mt-6 sm:mt-[32px]">
                <LiquidMetalButton
                  variant="light"
                  label="Send Message"
                  showArrow
                  onClick={() => {}}
                />
              </div>
            </form>
          </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
