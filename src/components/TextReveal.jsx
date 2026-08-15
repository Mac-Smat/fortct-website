import { AnimatePresence, motion } from 'motion/react'
import { cn } from '../lib/utils'

const defaultStaggerTimes = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
}

const defaultContainerVariants = {
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const defaultItemVariants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const presetVariants = {
  blur: {
    container: defaultContainerVariants,
    item: {
      exit: { filter: 'blur(12px)', opacity: 0 },
      hidden: { filter: 'blur(12px)', opacity: 0 },
      visible: { filter: 'blur(0px)', opacity: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0 },
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      exit: { filter: 'blur(12px)', opacity: 0, y: 20 },
      hidden: { filter: 'blur(12px)', opacity: 0, y: 20 },
      visible: { filter: 'blur(0px)', opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, scale: 0 },
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, y: 20 },
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
}

function splitText(text, per) {
  if (per === 'line') return text.split('\n')
  return text.split(/(\s+)/)
}

function SegmentItem({ segment, variants, per, wrapperClassName }) {
  const content =
    per === 'line' ? (
      <motion.span className="block" variants={variants}>
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden="true"
        className="inline-block whitespace-pre"
        variants={variants}
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split('').map((char, i) => (
          <motion.span
            aria-hidden="true"
            className="inline-block whitespace-pre"
            key={i}
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    )

  if (!wrapperClassName) return content
  return (
    <span
      className={cn(
        per === 'line' ? 'block' : 'inline-block',
        wrapperClassName,
      )}
    >
      {content}
    </span>
  )
}

export function TextReveal({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}) {
  const segments = splitText(children, per)
  const MotionTag = motion[as] ?? motion.div

  const base = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants }
  const stagger = defaultStaggerTimes[per] / speedReveal
  const baseDuration = 0.3 / speedSegment

  const containerVars = {
    ...base.container,
    visible: {
      ...base.container.visible,
      transition: {
        delayChildren: delay,
        staggerChildren: stagger,
        ...containerTransition,
      },
    },
  }

  const itemVars = {
    ...base.item,
    visible: {
      ...base.item.visible,
      transition: { duration: baseDuration, ...segmentTransition },
    },
  }

  const computedVariants = variants
    ? {
        container: { ...containerVars, ...variants.container },
        item: { ...itemVars, ...variants.item },
      }
    : { container: containerVars, item: itemVars }

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          animate="visible"
          className={className}
          exit="exit"
          initial="hidden"
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
          variants={computedVariants.container}
        >
          {per !== 'line' ? <span className="sr-only">{children}</span> : null}
          {segments.map((segment, index) => (
            <SegmentItem
              key={`${per}-${index}-${segment}`}
              per={per}
              segment={segment}
              variants={computedVariants.item}
              wrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  )
}

export default TextReveal