import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useAdminAuth } from './useAdminAuth.js'
import { LiquidMetalButton } from '../components/LiquidMetalButton.jsx'
import { Tiles } from '../components/Tiles.jsx'
import logoSvg from '../assets/logo.svg'

export default function AdminLoginPage() {
  const { user, isAdmin, signIn } = useAdminAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!user) return
    if (isAdmin) {
      navigate('/admin/services', { replace: true })
    } else {
      navigate('/admin', { replace: true })
    }
  }, [user, isAdmin, navigate])

  if (user && isAdmin) {
    return <Navigate to="/admin/services" replace />
  }
  if (user && !isAdmin) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Enter your email address and password')
      return
    }
    setBusy(true)
    setError('')
    try {
      await signIn(email.trim(), password)
    } catch (err) {
      setError(err.message || 'Sign in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white px-4 py-12 dark:bg-[#0C0C0E]">
      <div
        className="absolute inset-y-0 left-1/2 z-0 w-screen -translate-x-1/2 overflow-hidden opacity-20"
        aria-hidden="true"
      >
        <Tiles rows={24} tileSize="md" />
      </div>

      <div className="relative z-10 w-full max-w-[400px]">
        <div className="rounded-[24px] border border-[#C5C8BC]/50 bg-white p-8 shadow-[0_2px_24px_rgba(0,0,0,0.05)] dark:border-[#26262B] dark:bg-[#1A1A1E]">
          <div className="flex flex-col items-center text-center">
            <img
              src={logoSvg}
              alt="FortCT Logo"
              className="h-[30px] w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
            />
            <h1 className="mt-6 text-[22px] font-bold tracking-[-0.44px] text-[#1A1C1C] dark:text-[#F2F2F1]">
              Admin sign in
            </h1>
            <p className="mt-1.5 text-[13px] font-normal text-[#45483F] dark:text-[#A1A1AA]">
              Sign in to manage the FortCT services catalogue.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-[12px] border border-[#B42318]/30 bg-[#B42318]/5 p-3 dark:bg-[#B42318]/10"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#B42318]" />
              <p className="text-[13px] font-medium leading-[18px] text-[#B42318]">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
            <div>
              <label
                htmlFor="admin-email"
                className="mb-[6px] block text-[12px] font-normal leading-[16px] text-[#666666] dark:text-[#A1A1AA]"
              >
                Email address
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@fortct.ltd"
                className="h-[44px] w-full rounded-[12px] border border-[#C5C8BC]/50 bg-[#F9F9F9] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none transition-shadow focus:border-[#E0EC38]/60 focus:ring-2 focus:ring-[#E0EC38]/60 dark:border-[#26262B] dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
              />
            </div>
            <div>
              <label
                htmlFor="admin-password"
                className="mb-[6px] block text-[12px] font-normal leading-[16px] text-[#666666] dark:text-[#A1A1AA]"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-[44px] w-full rounded-[12px] border border-[#C5C8BC]/50 bg-[#F9F9F9] px-[14px] text-[14px] text-[#1A1C1C] placeholder:text-[#B7BBC4] outline-none transition-shadow focus:border-[#E0EC38]/60 focus:ring-2 focus:ring-[#E0EC38]/60 dark:border-[#26262B] dark:bg-[#0F0F11] dark:text-[#F2F2F1] dark:placeholder:text-[#5C5C66]"
              />
            </div>
            <div className="flex justify-center pt-1">
              <LiquidMetalButton
                variant="light"
                label={busy ? 'Signing in…' : 'Sign In'}
                width={160}
                height={46}
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}