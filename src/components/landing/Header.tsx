
import Link from 'next/link';
import Image from 'next/image';
import { LoginButton } from "@/components/auth/LoginButton";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { User } from '@supabase/supabase-js';

export function Header({ user }: { user: User | null }) {
  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gray-800">Trilero</Link>
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              href="/shift-planner/list"
              className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105"
            >
              Mis planillas
            </Link>
            <LogoutButton />
            <Image src={user.user_metadata.avatar_url} alt="User avatar" width={40} height={40} className="rounded-full" />
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </header>
  )
}
