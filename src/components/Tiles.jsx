import { useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '../lib/utils'

const tileSizes = {
  sm: 'w-8 h-8',
  md: 'w-9 h-9 md:w-12 md:h-12',
  lg: 'w-12 h-12 md:w-16 md:h-16',
}

const TILE_PX = { sm: 32, md: 36, lg: 48 }

export function Tiles({
  className,
  rows = 100,
  cols,
  tileClassName,
  tileSize = 'md',
}) {
  const containerRef = useRef(null)
  const [autoCols, setAutoCols] = useState(null)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      setAutoCols(Math.ceil(el.offsetWidth / TILE_PX[tileSize]) + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [tileSize])

  const totalCols = cols ?? autoCols ?? 1
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(totalCols).fill(1)

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative z-0 flex w-full h-full justify-center',
        className
      )}
    >
      {rowsArray.map((_, i) => (
        <motion.div
          key={`row-${i}`}
          className={cn(
            tileSizes[tileSize],
            'border-l dark:border-neutral-900 border-neutral-200 relative',
            tileClassName
          )}
        >
          {colsArray.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: 'var(--tile)',
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                'border-r border-t dark:border-neutral-900 border-neutral-200 relative',
                tileClassName
              )}
            />
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export default Tiles