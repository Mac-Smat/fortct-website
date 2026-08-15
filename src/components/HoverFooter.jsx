import { useRef, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/utils'
import logoSvg from '../assets/logo.svg'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0EC38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0EC38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E0EC38" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

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

export function TextHoverEffect({ text, duration, className }) {
  const svgRef = useRef(null)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [maskPosition, setMaskPosition] = useState({ cx: '50%', cy: '50%' })

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect()
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      })
    }
  }, [cursor])

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn('select-none uppercase cursor-pointer', className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#E0EC38" />
              <stop offset="25%" stopColor="#9FB04A" />
              <stop offset="50%" stopColor="#3D4D2B" />
              <stop offset="75%" stopColor="#6E7D3E" />
              <stop offset="100%" stopColor="#E0EC38" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: '50%', cy: '50%' }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: 'easeOut' }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect x="0" y="0" width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-white/10 font-sans text-7xl font-bold"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[#E0EC38] font-sans text-7xl font-bold"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-sans text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  )
}

export function FooterBackgroundGradient() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 z-0"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 10%, rgba(26,46,21,0.55) 50%, rgba(224,236,56,0.12) 100%)',
      }}
    />
  )
}

const linkColumns = [
  {
    title: 'Services',
    links: [
      { label: 'Outdoor Advertising', href: '#services' },
      { label: 'Corporate Stationery', href: '#services' },
      { label: 'Marketing Materials', href: '#services' },
    ],
  },
  {
    title: 'Specialty',
    links: [
      { label: 'Books & Publishing', href: '#services' },
      { label: 'Specialized Printing', href: '#services' },
      { label: 'Design Services', href: '#services' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#home' },
      { label: 'Contact Us', href: '#contact' },
      { label: 'Privacy Policy', href: '#contact' },
    ],
  },
]

const contactInfo = [
  {
    icon: <MailIcon />,
    text: 'hello@fortct.ltd',
    href: 'mailto:hello@fortct.ltd',
  },
  {
    icon: <PhoneIcon />,
    text: '0707 787 5475',
    href: 'tel:+2347077875475',
  },
  {
    icon: <MapPinIcon />,
    text: '86, Ile-Pupa Bus Stop, Ibadan',
  },
]

const socialLinks = [
  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
  { icon: <XIcon />, label: 'X (Twitter)', href: '#' },
  { icon: <LinkedInIcon />, label: 'LinkedIn', href: '#' },
]

export default function HoverFooter() {
  return (
    <footer className="relative mx-6 mb-6 bg-[#0F0F11] h-fit rounded-[28px] overflow-hidden">
      <div className="relative max-w-7xl mx-auto p-6 sm:p-8 md:p-14 z-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 lg:gap-16 pb-12">
          {/* Brand section */}
          <Reveal delay={0}>
            <div className="flex flex-col space-y-4">
              <img
                src={logoSvg}
                alt="FortCT Logo"
                className="w-[146px] h-[39px] object-contain [filter:brightness(0)_invert(1)]"
              />
              <p className="text-sm leading-relaxed text-white/60">
                Start building your visual identity with precision printing and
                dedicated branding expertise.
              </p>
            </div>
          </Reveal>

          {/* Footer link sections */}
          {linkColumns.map((section, i) => (
            <Reveal key={section.title} delay={80 * (i + 1)}>
              <div>
                <RevealHeading
                  as="h4"
                  per="word"
                  preset="fade"
                  className="text-white text-lg font-semibold mb-6"
                >
                  {section.title}
                </RevealHeading>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-white/60 hover:text-[#E0EC38] transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Contact section */}
          <Reveal delay={320}>
            <div>
              <RevealHeading
                as="h4"
                per="word"
                preset="fade"
                className="text-white text-lg font-semibold mb-6"
              >
                Contact Us
              </RevealHeading>
              <ul className="space-y-4">
                {contactInfo.map((item, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    {item.icon}
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-white/60 hover:text-[#E0EC38] transition-colors"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-white/60 hover:text-[#E0EC38] transition-colors">
                        {item.text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <hr className="border-t border-white/10 my-8" />

        {/* Footer bottom */}
        <Reveal delay={400}>
          <div className="flex flex-col md:flex-row justify-between items-center text-sm space-y-4 md:space-y-0">
            <div className="flex space-x-6 text-white/40">
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="hover:text-[#E0EC38] transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center md:text-left">
              <p className="text-white/40">
                &copy; 2024 FortCT Ltd. Precision Printing &amp; Modern Branding. All rights reserved.
              </p>
              <p className="text-white/40">
                Designed with <span className="text-[#E0EC38]">&hearts;</span> in Ibadan.
              </p>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Text hover effect */}
      <div className="hidden lg:flex h-[30rem] -mt-52 -mb-36">
        <TextHoverEffect text="FortCT" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}