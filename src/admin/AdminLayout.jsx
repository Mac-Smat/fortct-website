import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutGrid, FolderOpen, ExternalLink, LogOut, IconMenu2, IconX } from './icons.jsx'
import { useAdminAuth } from './useAdminAuth.js'
import { ThemeToggle } from '../components/ThemeToggle.jsx'
import logoSvg from '../assets/logo.svg'
import { cn } from '../lib/utils.js'

const BASE_URL = import.meta.env.BASE_URL

const NAV_ITEMS = [
  { to: '/admin/services', label: 'Services', icon: LayoutGrid },
  { to: '/admin/categories', label: 'Categories', icon: FolderOpen },
]

const NAV_CLASS = ({ isActive }) =>
  cn(
    'flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-[0.3px] transition-colors',
    isActive
      ? 'bg-[#1A1C1C] text-white dark:bg-[#F2F2F1] dark:text-[#1A1C1C]'
      : 'text-[#45483F] hover:bg-[#E2E2E2]/60 dark:text-[#A1A1AA] dark:hover:bg-white/10',
  )

function SidebarContent({ onNavigate }) {
  const { user, signOut } = useAdminAuth()
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-5">
        <img
          src={logoSvg}
          alt="FortCT Logo"
          className="h-[28px] w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
        />
        <p className="mt-1 text-[11px] font-semibold tracking-[0.8px] text-[#45483F]/60 dark:text-[#A1A1AA]/60">
          ADMINISTRATOR
        </p>
      </div>

      <nav className="mt-6 flex flex-col gap-1 px-3" aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={NAV_CLASS}
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
        <a
          href={BASE_URL}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-full px-4 py-2.5 text-[13px] font-semibold tracking-[0.3px] text-[#45483F] transition-colors hover:bg-[#E2E2E2]/60 dark:text-[#A1A1AA] dark:hover:bg-white/10"
        >
          <ExternalLink className="h-[18px] w-[18px]" />
          View public site
        </a>
      </nav>

      <div className="mt-auto border-t border-[#C5C8BC]/40 px-5 py-4 dark:border-[#26262B]">
        <p className="truncate text-[12px] font-normal text-[#666666] dark:text-[#A1A1AA]">
          {user?.email}
        </p>
        <button
          type="button"
          onClick={signOut}
          className="mt-2.5 flex items-center gap-2 rounded-full px-3 py-1.5 text-[12px] font-semibold text-[#B42318] transition-colors hover:bg-[#B42318]/10 cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#F9F9F9] text-black antialiased dark:bg-[#0C0C0E] dark:text-[#F2F2F1]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[240px] border-r border-[#C5C8BC]/40 bg-white lg:block dark:border-[#26262B] dark:bg-[#111114]">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[120] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[260px] bg-white shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:bg-[#111114]">
            <SidebarContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </div>
      )}

      {/* Top bar (mobile/tablet) */}
      <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-[#C5C8BC]/40 bg-white/90 px-4 backdrop-blur lg:hidden dark:border-[#26262B] dark:bg-[#0C0C0E]/90">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open admin menu"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#1A1C1C] transition-colors hover:bg-[#E2E2E2]/60 dark:text-white dark:hover:bg-white/10 cursor-pointer"
        >
          {drawerOpen ? <IconX className="h-5 w-5" /> : <IconMenu2 className="h-5 w-5" />}
        </button>
        <img
          src={logoSvg}
          alt="FortCT Logo"
          className="h-[24px] w-auto object-contain dark:[filter:brightness(0)_invert(1)]"
        />
        <ThemeToggle />
      </header>

      <div className="lg:pl-[240px]">
        <main className="mx-auto w-full max-w-[1200px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}