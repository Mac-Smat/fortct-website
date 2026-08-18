import * as React from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { cn } from '../lib/utils'
import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { RevealHeading } from './RevealHeading.jsx'

import galleryPhoto1 from '../../assets/Gallery Section Images/gallery-photo-1.webp'
import galleryPhoto2 from '../../assets/Gallery Section Images/gallery-photo-2.webp'
import galleryPhoto3 from '../../assets/Gallery Section Images/gallery-photo-3.webp'
import galleryPhoto4 from '../../assets/Gallery Section Images/gallery-photo-4.webp'
import galleryPhoto5 from '../../assets/Gallery Section Images/gallery-photo-5.webp'
import galleryPhoto6 from '../../assets/Gallery Section Images/gallery-photo-6.webp'
import galleryPhoto7 from '../../assets/Gallery Section Images/gallery-photo-7.webp'
import galleryPhoto8 from '../../assets/Gallery Section Images/gallery-photo-8.webp'
import galleryPhoto9 from '../../assets/Gallery Section Images/gallery-photo-9.webp'
import galleryPhoto10 from '../../assets/Gallery Section Images/gallery-photo-10.webp'
import galleryPhoto11 from '../../assets/Gallery Section Images/gallery-photo-11.webp'
import galleryPhoto12 from '../../assets/Gallery Section Images/gallery-photo-12.webp'

const SPRING_CONFIG = {
  type: 'spring',
  stiffness: 100,
  damping: 16,
  mass: 0.75,
  restDelta: 0.005,
  duration: 0.3,
}

const blurVariants = {
  hidden: {
    filter: 'blur(10px)',
    opacity: 0,
  },
  visible: {
    filter: 'blur(0px)',
    opacity: 1,
  },
}

const ContainerScrollContext = React.createContext(undefined)

function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error('useContainerScrollContext must be used within a ContainerScroll Component')
  }
  return context
}

function ContainerScroll({ children, className, style, ...props }) {
  const scrollRef = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn('relative min-h-[120vh]', className)}
        style={{
          perspective: '1000px',
          perspectiveOrigin: 'center top',
          transformStyle: 'preserve-3d',
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

function ContainerSticky({ className, style, ...props }) {
  return (
    <div
      className={cn('sticky left-0 top-0 min-h-[30rem] w-full overflow-hidden', className)}
      style={{
        perspective: '1000px',
        perspectiveOrigin: 'center top',
        transformStyle: 'preserve-3d',
        transformOrigin: '50% 50%',
        ...style,
      }}
      {...props}
    />
  )
}

function GalleryContainer({ children, className, style, ...props }) {
  const { scrollYProgress } = useContainerScrollContext()
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [75, 0])
  const scale = useTransform(scrollYProgress, [0.5, 0.9], [1.2, 1])

  return (
    <motion.div
      className={cn('relative grid size-full grid-cols-3 gap-2 rounded-2xl', className)}
      style={{
        rotateX,
        scale,
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

function GalleryCol({ className, style, yRange = ['0%', '-10%'], ...props }) {
  const { scrollYProgress } = useContainerScrollContext()
  const y = useTransform(scrollYProgress, [0.5, 1], yRange)

  return (
    <motion.div
      className={cn('relative flex w-full flex-col gap-2', className)}
      style={{ y, ...style }}
      {...props}
    />
  )
}

function ContainerStagger({ className, viewport, transition, ...props }) {
  return (
    <motion.div
      className={cn('relative', className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, ...viewport }}
      transition={{
        staggerChildren: transition?.staggerChildren || 0.2,
        ...transition,
      }}
      {...props}
    />
  )
}

function ContainerAnimated({ className, transition, ...props }) {
  return (
    <motion.div
      className={cn(className)}
      variants={blurVariants}
      transition={SPRING_CONFIG || transition}
      {...props}
    />
  )
}

const IMAGES_1 = [
  galleryPhoto1,
  galleryPhoto2,
  galleryPhoto3,
  galleryPhoto4,
]

const IMAGES_2 = [
  galleryPhoto5,
  galleryPhoto6,
  galleryPhoto7,
  galleryPhoto8,
]

const IMAGES_3 = [
  galleryPhoto9,
  galleryPhoto10,
  galleryPhoto11,
  galleryPhoto12,
]

const ALL_IMAGES = [...IMAGES_1, ...IMAGES_2, ...IMAGES_3]

function MobileGallery() {
  return (
    <div className="relative z-20 pt-14 pb-16">
      <div
        role="region"
        aria-label="Photo gallery, swipe to browse"
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ALL_IMAGES.map((imageUrl, index) => (
          <div
            key={index}
            className="w-[78vw] shrink-0 snap-center overflow-hidden rounded-2xl shadow-md"
          >
            <img
              src={imageUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function GallerySection() {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia('(max-width: 767px)').matches)

  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = (event) => setIsMobile(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <section id="portfolio" className="relative bg-white dark:bg-[#0C0C0E]">
      <ContainerStagger className="relative z-[9999] -mb-12 place-self-center px-6 pt-12 text-center">
        <ContainerAnimated>
          <RevealHeading
            as="h2"
            per="word"
            preset="fade-in-blur"
            className="text-4xl font-bold tracking-tight text-black dark:text-[#F2F2F1] md:text-5xl"
          >
            Photo Gallery
          </RevealHeading>
        </ContainerAnimated>

        <ContainerAnimated className="my-4">
          <RevealHeading
            as="p"
            per="line"
            preset="fade"
            speedReveal={1.4}
            className="leading-normal tracking-tight text-[#45483F] dark:text-[#A1A1AA]"
          >
            {'Captured moments from our recent\nbranding and large-format printing\nprojects.'}
          </RevealHeading>
        </ContainerAnimated>

        <ContainerAnimated>
          <LiquidMetalButton
            variant="light"
            label="View All"
            showArrow
            onClick={() => {
              window.location.hash = '#portfolio'
            }}
          />
        </ContainerAnimated>
      </ContainerStagger>

      <div
        className="pointer-events-none absolute z-10 h-[70vh] w-full"
        style={{
          background: 'linear-gradient(to right, #E0EC38, #3D4D2B, #1A2E15)',
          filter: 'blur(84px)',
          mixBlendMode: 'screen',
          opacity: 0.35,
        }}
      />

      {isMobile ? (
        <MobileGallery />
      ) : (
        <ContainerScroll className="relative h-[350vh]">
          <ContainerSticky className="h-svh">
            <GalleryContainer className="">
              <GalleryCol yRange={['-10%', '2%']} className="-mt-2">
                {IMAGES_1.map((imageUrl, index) => (
                  <img
                    key={index}
                    className="aspect-[1600/1835] block h-auto max-h-full w-full rounded-md object-cover shadow"
                    src={imageUrl}
                    alt="" loading="lazy" decoding="async"
                  />
                ))}
              </GalleryCol>
              <GalleryCol className="mt-[-50%]" yRange={['15%', '5%']}>
                {IMAGES_2.map((imageUrl, index) => (
                  <img
                    key={index}
                    className="aspect-video block h-auto max-h-full w-full rounded-md object-cover shadow"
                    src={imageUrl}
                    alt="" loading="lazy" decoding="async"
                  />
                ))}
              </GalleryCol>
              <GalleryCol yRange={['-10%', '2%']} className="-mt-2">
                {IMAGES_3.map((imageUrl, index) => (
                  <img
                    key={index}
                    className="aspect-[1600/1835] block h-auto max-h-full w-full rounded-md object-cover shadow"
                    src={imageUrl}
                    alt="" loading="lazy" decoding="async"
                  />
                ))}
              </GalleryCol>
            </GalleryContainer>
          </ContainerSticky>
        </ContainerScroll>
      )}
    </section>
  )
}