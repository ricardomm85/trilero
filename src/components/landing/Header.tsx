import Link from 'next/link';

export function Header() {
  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-gray-800">Trilero</Link>
        <Link
          href="/shift-planner/list"
          className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-6 py-3 shadow-lg transition-transform hover:scale-105"
        >
          Mis planillas
        </Link>
      </div>
    </header>
  )
}
