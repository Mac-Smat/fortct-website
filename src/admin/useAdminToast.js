import { createContext, useContext } from 'react'

export const ToastContext = createContext(null)

export function useAdminToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useAdminToast must be used within AdminToastProvider')
  return ctx
}
