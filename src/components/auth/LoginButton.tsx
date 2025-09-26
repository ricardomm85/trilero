'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@heroui/react'

export const LoginButton = () => {
  const handleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <Button
      onPress={handleLogin}
      className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
    >
      Login with Google
    </Button>
  )
}
