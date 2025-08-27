export function Header() {
  return (
    <header className="fixed top-0 left-0 z-10 w-full bg-white/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
        <p className="text-2xl font-bold text-zinc-900">
          Trilero
        </p>
        <button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 text-white shadow-lg transition-transform hover:scale-105">
          Login
        </button>
      </div>
    </header>
  )
}
