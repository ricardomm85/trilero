'use client'

import { supabase } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";

export function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  async function handleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: location.origin + '/auth/callback',
      }
    })
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  }

  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <p className="text-2xl font-bold text-zinc-900">
          Trilero
        </p>
        {user ? (
          <div className="flex items-center gap-4">
            <img src={user.user_metadata.avatar_url} alt="User avatar" className="w-10 h-10 rounded-full" />
            <button
              onClick={handleLogout}
              className="rounded-full bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
          >
            Login
          </button>
        )}
      </div>
    </header>
  )
}
