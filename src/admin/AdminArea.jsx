import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AdminAuthProvider } from './AdminAuthContext.jsx'
import { AdminToastProvider } from './AdminToast.jsx'
import { RequireAdmin } from './RequireAdmin.jsx'
import { AdminLoading } from './ui/AdminStates.jsx'

const AdminLoginPage = lazy(() => import('./AdminLoginPage.jsx'))
const AdminLayout = lazy(() => import('./AdminLayout.jsx'))
const AdminServicesPage = lazy(() => import('./AdminServicesPage.jsx'))
const AdminServiceEditorPage = lazy(() => import('./AdminServiceEditorPage.jsx'))
const AdminCategoriesPage = lazy(() => import('./AdminCategoriesPage.jsx'))

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] dark:bg-[#0C0C0E]">
      <AdminLoading label="Loading admin…" />
    </div>
  )
}

export default function AdminArea() {
  return (
    <AdminToastProvider>
      <AdminAuthProvider>
        <Suspense fallback={<AdminFallback />}>
          <Routes>
            <Route path="login" element={<AdminLoginPage />} />
            <Route element={<RequireAdmin />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="services" replace />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="services/:id" element={<AdminServiceEditorPage />} />
                <Route path="categories" element={<AdminCategoriesPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </Suspense>
      </AdminAuthProvider>
    </AdminToastProvider>
  )
}