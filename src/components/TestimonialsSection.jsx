import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'

const testimonials = [
  {
    id: 1,
    quote: 'The attention to detail and creative vision transformed our brand identity completely.',
    author: 'Sarah Chen',
    role: 'Creative Director',
    company: 'Studio Forma',
    image:
      'https://plus.unsplash.com/premium_photo-1689551671548-79ff30459d2a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 2,
    quote: 'Working with them felt like a true creative partnership from day one.',
    author: 'Marcus Webb',
    role: 'Head of Design',
    company: 'Minimal Co',
    image:
      'https://images.unsplash.com/photo-1649123245135-4db6ead931b5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
  },
  {
    id: 3,
    quote: 'They understand that great design is invisible yet unforgettable.',
    author: 'Elena Voss',
    role: 'Art Director',
    company: 'Pixel & Co',
    image:
      'https://images.unsplash.com/photo-1701615004837-40d8573b6652?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D',
  },
]

export default function TestimonialsSection() {
  const [active, setActive] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleChange = (index) => {
    if (index === active || isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setActive(index)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const handlePrev = () => {
    const newIndex = active === 0 ? testimonials.length - 1 : active - 1
    handleChange(newIndex)
  }

  const handleNext = () => {
    const newIndex = active === testimonials.length - 1 ? 0 : active + 1
    handleChange(newIndex)
  }

  const current = testimonials[active]

  return (
    <section id="testimonials" className="relative w-full bg-[#F9F9F9] overflow-hidden dark:bg-[#131316]">
      <div className="w-full max-w-2xl mx-auto px-6 py-16 md:py-24">
        {/* Large index number */}
        <div className="flex items-start gap-8">
          <span
            className="text-[120px] font-light leading-none text-[#1A1C1C]/10 select-none transition-all duration-500 dark:text-[#F2F2F1]/10"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {String(active + 1).padStart(2, '0')}
          </span>

          <div className="flex-1 pt-6">
            {/* Quote */}
            <blockquote
              className={`text-2xl md:text-3xl font-light leading-relaxed text-[#1A1C1C] tracking-tight transition-all duration-300 dark:text-[#F2F2F1] ${
                isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
              }`}
            >
              {current.quote}
            </blockquote>

            {/* Author info with hover reveal */}
            <div
              className={`mt-10 group cursor-default transition-all duration-300 delay-100 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#1A1C1C]/10 group-hover:ring-[#1A1C1C]/30 transition-all duration-300 dark:ring-[#F2F2F1]/10 dark:group-hover:ring-[#F2F2F1]/30">
                  <img
                    src={current.image}
                    alt={current.author}
                    className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                </div>
                <div>
                  <p className="font-medium text-[#1A1C1C] dark:text-[#F2F2F1]">{current.author}</p>
                  <p className="text-sm text-[#45483F] dark:text-[#A1A1AA]">
                    {current.role}
                    <span className="mx-2 text-[#1A1C1C]/20 dark:text-[#F2F2F1]/20">/</span>
                    <span className="group-hover:text-[#1A1C1C] transition-colors duration-300 dark:group-hover:text-[#F2F2F1]">
                      {current.company}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - vertical line selector */}
        <div className="mt-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleChange(index)}
                  aria-label={`Show testimonial ${index + 1}`}
                  className="group relative py-4"
                >
                  <span
                    className={`block h-px transition-all duration-500 ease-out ${
                      index === active
                        ? 'w-12 bg-[#1A1C1C] dark:bg-[#F2F2F1]'
                        : 'w-6 bg-[#1A1C1C]/20 group-hover:w-8 group-hover:bg-[#1A1C1C]/40 dark:bg-[#F2F2F1]/20 dark:group-hover:bg-[#F2F2F1]/40'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs text-[#45483F] tracking-widest uppercase dark:text-[#A1A1AA]">
              {String(active + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="p-2 rounded-full text-[#1A1C1C]/40 hover:text-[#1A1C1C] hover:bg-[#1A1C1C]/5 transition-all duration-300 dark:text-[#F2F2F1]/40 dark:hover:text-[#F2F2F1] dark:hover:bg-[#F2F2F1]/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next testimonial"
              className="p-2 rounded-full text-[#1A1C1C]/40 hover:text-[#1A1C1C] hover:bg-[#1A1C1C]/5 transition-all duration-300 dark:text-[#F2F2F1]/40 dark:hover:text-[#F2F2F1] dark:hover:bg-[#F2F2F1]/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* See more reviews button */}
        <div className="flex justify-center mt-12">
          <LiquidMetalButton
            variant="light"
            label="See more reviews"
            showArrow
            width={190}
            onClick={() => {
              window.location.hash = '#contact'
            }}
          />
        </div>
      </div>
    </section>
  )
}