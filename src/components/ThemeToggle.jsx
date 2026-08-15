import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../lib/utils'

const THEME_KEY = 'fortct-theme'

function getInitialTheme() {
  const stored = localStorage.getItem(THEME_KEY)
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeToggle({ className }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setIsDark(getInitialTheme())
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div
      className={cn(
        'flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300 select-none',
        isDark
          ? 'bg-zinc-950 border border-zinc-800'
          : 'bg-white border border-zinc-200',
        className
      )}
      onClick={() => setIsDark((prev) => !prev)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsDark((prev) => !prev)
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Toggle dark mode"
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDark
              ? 'transform translate-x-0 bg-zinc-800'
              : 'transform translate-x-8 bg-gray-200'
          )}
        >
          {isDark ? (
            <Moon
              className="w-4 h-4 text-white"
              strokeWidth={1.5}
            />
          ) : (
            <Sun
              className="w-4 h-4 text-gray-700"
              strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            'flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300',
            isDark
              ? 'bg-transparent'
              : 'transform -translate-x-8'
          )}
        >
          {isDark ? (
            <Sun
              className="w-4 h-4 text-gray-500"
              strokeWidth={1.5}
            />
          ) : (
            <Moon
              className="w-4 h-4 text-black"
              strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  )
}