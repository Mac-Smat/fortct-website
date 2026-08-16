import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { AdminButton } from './AdminButton.jsx'

export function AdminModal({ open, title, onClose, children, footer }) {
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[24px] border border-[#C5C8BC]/50 bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:border-[#26262B] dark:bg-[#1A1A1E]"
      >
        <div className="flex items-center justify-between border-b border-[#C5C8BC]/40 px-6 py-4 dark:border-[#26262B]">
          <h2 className="text-[16px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#45483F] transition-colors hover:bg-[#E2E2E2]/60 dark:text-[#A1A1AA] dark:hover:bg-white/10 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-[#C5C8BC]/40 px-6 py-4 dark:border-[#26262B]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, title, message, confirmLabel, busy, onConfirm, onClose }) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <AdminButton variant="outline" onClick={onClose}>
            Cancel
          </AdminButton>
          <AdminButton variant="danger" onClick={onConfirm} disabled={busy}>
            {busy ? 'Please wait…' : confirmLabel}
          </AdminButton>
        </>
      }
    >
      <p className="text-[14px] font-normal leading-[22px] text-[#45483F] dark:text-[#A1A1AA]">
        {message}
      </p>
    </AdminModal>
  )
}