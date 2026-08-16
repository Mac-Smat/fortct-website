export function AdminLoading({ label = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <div
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-[#C5C8BC]/40 border-t-[#3D4D2B] dark:border-white/10 dark:border-t-[#AAB95F]"
      />
      <p className="text-[13px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
        {label}
      </p>
    </div>
  )
}

export function AdminEmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#C5C8BC]/60 px-6 py-14 text-center dark:border-[#26262B]">
      <p className="text-[15px] font-semibold text-[#1A1C1C] dark:text-[#F2F2F1]">
        {title}
      </p>
      {message && (
        <p className="mt-1.5 max-w-sm text-[13px] font-normal leading-[20px] text-[#45483F] dark:text-[#A1A1AA]">
          {message}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function AdminErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[20px] border border-[#B42318]/30 bg-[#B42318]/5 px-6 py-12 text-center dark:bg-[#B42318]/10">
      <p className="text-[14px] font-semibold text-[#B42318]">Something went wrong</p>
      <p className="max-w-md text-[13px] font-normal leading-[20px] text-[#45483F] dark:text-[#A1A1AA]">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex h-[36px] items-center justify-center rounded-full border border-[#C5C8BC]/70 px-5 text-[13px] font-semibold text-[#45483F] transition-colors hover:border-[#3D4D2B] hover:text-[#3D4D2B] dark:border-[#26262B] dark:text-[#A1A1AA] dark:hover:border-[#AAB95F] dark:hover:text-[#AAB95F] cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function AdminPageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-[24px] font-bold tracking-[-0.48px] text-[#1A1C1C] dark:text-[#F2F2F1]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-[13px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}