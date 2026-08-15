import * as React from 'react'
import { MotionConfig, motion } from 'motion/react'
import { cn } from '../lib/utils'
import { Reveal } from './Reveal.jsx'
import { RevealHeading } from './RevealHeading.jsx'

import serviceBranding from '../../assets/Services Section Images/service-branding.webp'
import serviceGeneral from '../../assets/Services Section Images/service-general-printing.webp'
import serviceBillboard from '../../assets/Services Section Images/service-billboard.webp'
import serviceFormat from '../../assets/Services Section Images/service-large-format.webp'

function splitText(text) {
  const words = text.split(' ').map((word) => word.concat(' '))
  const characters = words.map((word) => word.split('')).flat(1)

  return {
    words,
    characters,
  }
}

const HoverSliderContext = React.createContext(undefined)

function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error('useHoverSliderContext must be used within a HoverSliderProvider')
  }
  return context
}

export const HoverSlider = React.forwardRef(function HoverSlider({ children, className, ...props }, ref) {
  const [activeSlide, setActiveSlide] = React.useState(0)
  const changeSlide = React.useCallback((index) => setActiveSlide(index), [])
  return (
    <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    </HoverSliderContext.Provider>
  )
})
HoverSlider.displayName = 'HoverSlider'

export const TextStaggerHover = React.forwardRef(function TextStaggerHover({ text, index, className, ...props }, ref) {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const { characters } = splitText(text)
  const isActive = activeSlide === index
  const handleMouse = () => changeSlide(index)
  return (
    <span
      className={cn('relative inline-block origin-bottom overflow-hidden', className)}
      {...props}
      ref={ref}
      onMouseEnter={handleMouse}
    >
      {characters.map((char, charIndex) => (
        <span key={`${char}-${charIndex}`} className="relative inline-block overflow-hidden">
          <MotionConfig
            transition={{
              delay: charIndex * 0.025,
              duration: 0.3,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.span
              className="inline-block opacity-20"
              initial={{ y: '0%' }}
              animate={isActive ? { y: '-110%' } : { y: '0%' }}
            >
              {char}
              {char === ' ' && charIndex < characters.length - 1 && <>&nbsp;</>}
            </motion.span>

            <motion.span
              className="absolute left-0 top-0 inline-block opacity-100"
              initial={{ y: '110%' }}
              animate={isActive ? { y: '0%' } : { y: '110%' }}
            >
              {char}
            </motion.span>
          </MotionConfig>
        </span>
      ))}
    </span>
  )
})
TextStaggerHover.displayName = 'TextStaggerHover'

const clipPathVariants = {
  visible: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
  },
  hidden: {
    clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)',
  },
}

export const HoverSliderImageWrap = React.forwardRef(function HoverSliderImageWrap({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full',
        className
      )}
      {...props}
    />
  )
})
HoverSliderImageWrap.displayName = 'HoverSliderImageWrap'

export const HoverSliderImage = React.forwardRef(function HoverSliderImage({ index, className, ...props }, ref) {
  const { activeSlide } = useHoverSliderContext()
  return (
    <motion.img
      className={cn('inline-block align-middle', className)}
      transition={{ ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
      variants={clipPathVariants}
      animate={activeSlide === index ? 'visible' : 'hidden'}
      ref={ref}
      {...props}
    />
  )
})
HoverSliderImage.displayName = 'HoverSliderImage'

const SLIDES = [
  {
    id: 'slide-1',
    title: 'Branding',
    imageUrl: serviceBranding,
  },
  {
    id: 'slide-2',
    title: 'General Printing',
    imageUrl: serviceGeneral,
  },
  {
    id: 'slide-3',
    title: 'Billboard Construction & Installation',
    imageUrl: serviceBillboard,
  },
  {
    id: 'slide-4',
    title: 'Large Format Print',
    imageUrl: serviceFormat,
  },
]

export default function ServiceSlider() {
  return (
    <section id="services" className="w-full bg-white dark:bg-[#0C0C0E]">
      <div className="max-w-[1100px] mx-auto px-6 pt-16 md:pt-24 text-[#1A1C1C] dark:text-[#F2F2F1]">
        <RevealHeading
          as="h2"
          per="word"
          preset="fade-in-blur"
          className="text-center text-[32px] sm:text-[40px] lg:text-[48px] font-bold leading-[40px] sm:leading-[48px] tracking-[-0.96px] mb-8 md:mb-12"
        >
          Services
        </RevealHeading>
      </div>
      <Reveal delay={120}>
        <HoverSlider className="min-h-[70vh] place-content-center px-6 md:px-12 pb-20 text-[#1A1C1C] dark:text-[#F2F2F1]">
          <div className="flex flex-wrap items-center justify-evenly gap-6 md:gap-12">
            <div className="flex flex-col space-y-2 md:space-y-4">
              {SLIDES.map((slide, index) => (
                <TextStaggerHover
                  key={slide.title}
                  index={index}
                  className="cursor-pointer text-2xl sm:text-3xl font-bold uppercase tracking-tighter"
                  text={slide.title}
                />
              ))}
            </div>
            <HoverSliderImageWrap className="w-full max-w-xl">
              {SLIDES.map((slide, index) => (
                <HoverSliderImage
                  key={slide.id}
                  index={index}
                  src={slide.imageUrl}
                  alt={slide.title}
                  className="size-full max-h-96 object-cover"
                  loading="eager"
                  decoding="async"
                />
              ))}
            </HoverSliderImageWrap>
          </div>
        </HoverSlider>
      </Reveal>
    </section>
  )
}