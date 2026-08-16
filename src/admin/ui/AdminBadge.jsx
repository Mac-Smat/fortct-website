import { cn } from '../../lib/utils.js'

export function AdminBadge({ tone = 'neutral', children, className }) {
  const tones = {
    success:
      'bg-[#3D4D2B]/10 text-[#3D4D2B] dark:bg-[#AAB95F]/10 dark:text-[#AAB95F]',
    warning:
      'bg-[#E0EC38]/25 text-[#45483F] dark:bg-[#E0EC38]/15 dark:text-[#E0EC38]',
    neutral:
      'bg-[#E2E2E2]/60 text-[#45483F] dark:bg-white/10 dark:text-[#A1A1AA]',
    danger: 'bg-[#B42318]/10 text-[#B42318]',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-[0.4px] whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  return status === 'published' ? (
    <AdminBadge tone="success">Published</AdminBadge>
  ) : (
    <AdminBadge tone="neutral">Hidden</AdminBadge>
  )
}

export function CategoryBadge({ name }) {
  return <AdminBadge tone="warning">{name}</AdminBadge>
}