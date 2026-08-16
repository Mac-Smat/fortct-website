const FIELD_BASE =
  'w-full bg-[#F9F9F9] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none focus:ring-2 transition-shadow border border-[#C5C8BC]/50 dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66] dark:border-[#26262B]'

const FIELD_STYLES = {
  input: `${FIELD_BASE} h-[42px] rounded-[12px] px-[14px] focus:ring-[#E0EC38]/60 focus:border-[#E0EC38]/60`,
  select: `${FIELD_BASE} h-[42px] rounded-[12px] px-[14px] pr-10 appearance-none cursor-pointer focus:ring-[#E0EC38]/60 focus:border-[#E0EC38]/60`,
  textarea: `${FIELD_BASE} rounded-[12px] px-[14px] py-[12px] resize-y focus:ring-[#E0EC38]/60 focus:border-[#E0EC38]/60`,
}

export function FieldLabel({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-[6px] block text-[12px] font-normal leading-[16px] text-[#666666] dark:text-[#A1A1AA]"
    >
      {children}
      {required && (
        <span className="text-[#3D4D2B] dark:text-[#AAB95F]"> *</span>
      )}
    </label>
  )
}

export function FieldError({ id, children }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 text-[12px] font-normal leading-[16px] text-[#B42318]">
      {children}
    </p>
  )
}

export function AdminInput({ label, required, error, id, className, ...props }) {
  const fieldId = id || props.name
  return (
    <div className={className}>
      {label && (
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
      )}
      <input
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={FIELD_STYLES.input}
        {...props}
      />
      <FieldError id={`${fieldId}-error`}>{error}</FieldError>
    </div>
  )
}

export function AdminSelect({ label, required, error, id, children, className, ...props }) {
  const fieldId = id || props.name
  return (
    <div className={className}>
      {label && (
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
      )}
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={Boolean(error)}
          className={FIELD_STYLES.select}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute right-[14px] top-1/2 h-4 w-4 -translate-y-1/2 text-[#45483F] dark:text-[#A1A1AA]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </div>
      <FieldError id={`${fieldId}-error`}>{error}</FieldError>
    </div>
  )
}

export function AdminTextarea({ label, required, error, id, className, ...props }) {
  const fieldId = id || props.name
  return (
    <div className={className}>
      {label && (
        <FieldLabel htmlFor={fieldId} required={required}>
          {label}
        </FieldLabel>
      )}
      <textarea
        id={fieldId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={FIELD_STYLES.textarea}
        {...props}
      />
      <FieldError id={`${fieldId}-error`}>{error}</FieldError>
    </div>
  )
}