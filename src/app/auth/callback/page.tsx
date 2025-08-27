'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/utils/supabase/client'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event)
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session)
        router.push('/dashboard')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div>
      <p>Please wait while we are authenticating you...</p>
    </div>
  )
}
