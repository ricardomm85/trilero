'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleGoogleSignIn = async () => {
    setLoading(true)

    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || location.origin

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`,
      },
    })
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Redirecting...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}