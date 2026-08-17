import { useCallback, useMemo, useRef, useState } from 'react'
import { CheckCircle2, AlertCircle } from 'lucide-react'
import { ToastContext } from './useAdminToast.js'

let toastId = 0

export function AdminToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const push = useCallback(
    (type, message) => {
      const id = ++toastId
      setToasts((list) => [...list, { id, type, message }])
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), 4500),
      )
    },
    [dismiss],
  )

  const toast = useMemo(() => ({
    success: (message) => push('success', message),
    error: (message) => push('error', message),
  }), [push])

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="fixed bottom-5 right-5 z-[200] flex w-[min(92vw,360px)] flex-col gap-2"
      >
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => dismiss(t.id)}
            className="flex items-start gap-3 rounded-[16px] border bg-white p-4 text-left shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-colors dark:bg-[#1A1A1E] dark:shadow-none cursor-pointer"
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#3D4D2B] dark:text-[#AAB95F]" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#B42318]" />
            )}
            <span
              className={`text-[13px] font-medium leading-[18px] ${
                t.type === 'error'
                  ? 'text-[#B42318]'
                  : 'text-[#1A1C1C] dark:text-[#F2F2F1]'
              }`}
            >
              {t.message}
            </span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
