'use client'

import { createClient } from '@/utils/supabase/client'
import { Button } from '@heroui/react'

export const LogoutButton = () => {
  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <Button
      onPress={handleLogout}
      className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
    >
      Logout
    </Button>
  )
}
