import { cn } from '../../lib/utils.js'

const VARIANTS = {
  primary: 'bg-[#E0EC38] text-[#1B1D00] hover:bg-[#d3df2f]',
  dark: 'bg-[#1A1C1C] text-white hover:bg-black dark:bg-[#F2F2F1] dark:text-[#1A1C1C] dark:hover:bg-white',
  outline:
    'border border-[#C5C8BC]/70 text-[#45483F] hover:border-[#3D4D2B] hover:text-[#3D4D2B] dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F]',
  ghost:
    'text-[#45483F] hover:bg-[#E2E2E2]/50 dark:text-[#A1A1AA] dark:hover:bg-white/10',
  danger:
    'border border-[#B42318]/40 text-[#B42318] hover:bg-[#B42318]/10',
}

const SIZES = {
  sm: 'h-[32px] px-3 text-[12px] gap-1.5',
  md: 'h-[40px] px-5 text-[13px] gap-2',
}

export function AdminButton({
  children,
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-semibold tracking-[0.3px] transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function AdminIconButton({ children, label, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-[#E2E2E2]/60 hover:text-[#1A1C1C] dark:text-[#A1A1AA] dark:hover:bg-white/10 dark:hover:text-white cursor-pointer',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}