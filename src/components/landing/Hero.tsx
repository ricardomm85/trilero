import Link from 'next/link';

export function Hero() {
  return (
    <div className="flex flex-col items-center justify-center pt-48 text-center">
      <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
        Planifica tus turnos de trabajo de forma sencilla
      </h1>
      <p className="mt-6 text-xl text-gray-600">
        Crea, gestiona y comparte tus planillas de turnos con Trilero.
      </p>
      <Link href="/dashboard" passHref>
        <button className="mt-10 inline-block rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 font-bold text-white shadow-lg transition-transform hover:scale-105">
          Crear mi primera planilla
        </button>
      </Link>
    </div>
  )
}
