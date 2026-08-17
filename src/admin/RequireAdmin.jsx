import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from './useAdminAuth.js'
import { AdminLoading } from './ui/AdminStates.jsx'
import { AdminButton } from './ui/AdminButton.jsx'
import logoSvg from '../assets/logo.svg'

export function RequireAdmin() {
  const { loading, user, isAdmin, signOut } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] dark:bg-[#0C0C0E]">
        <AdminLoading label="Checking your session…" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] p-6 dark:bg-[#0C0C0E]">
        <div className="w-full max-w-md rounded-[24px] border border-[#C5C8BC]/50 bg-white p-8 text-center shadow-[0_2px_24px_rgba(0,0,0,0.05)] dark:border-[#26262B] dark:bg-[#1A1A1E]">
          <img
            src={logoSvg}
            alt="FortCT Logo"
            className="mx-auto h-[30px] w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
          />
          <h1 className="mt-6 text-[18px] font-bold text-[#1A1C1C] dark:text-[#F2F2F1]">
            Access denied
          </h1>
          <p className="mt-2 text-[14px] font-normal leading-[22px] text-[#45483F] dark:text-[#A1A1AA]">
            You are signed in, but this account is not authorized to manage the
            FortCT catalogue. If you believe this is a mistake, contact the
            website owner.
          </p>
          <div className="mt-6 flex justify-center">
            <AdminButton variant="outline" onClick={signOut}>
              Sign out
            </AdminButton>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}