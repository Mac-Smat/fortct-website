import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'
import { AdminAuthContext } from './useAdminAuth.js'

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return
      setSession(next)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const user = session?.user ?? null
  const isAdmin = Boolean(user?.app_metadata?.role === 'admin')

  return (
    <AdminAuthContext.Provider
      value={{ session, user, isAdmin, loading, signIn, signOut }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}