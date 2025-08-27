import {
  CalendarDaysIcon,
  UserGroupIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

export function LandingPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-accent">
            Todo en uno
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Todo lo que necesitas para organizar tus turnos
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-700">
            Trilero te lo pone fácil. Crea tu planilla, añade a tu personal y
            define los días festivos. Así de simple.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-none sm:mt-20 lg:mt-24">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3 lg:gap-y-16">
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <CalendarDaysIcon
                    className="h-6 w-6 text-gray-900"
                    aria-hidden="true"
                  />
                </div>
                Paso 1: Crea tu planilla
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-700">
                Define las fechas de inicio y fin de tu planilla.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <UserGroupIcon
                    className="h-6 w-6 text-gray-900"
                    aria-hidden="true"
                  />
                </div>
                Paso 2: Añade personal
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-700">
                Añade a todo el personal que necesites en tu planilla.
              </dd>
            </div>
            <div className="relative pl-16">
              <dt className="text-base font-semibold leading-7 text-gray-900">
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <SunIcon
                    className="h-6 w-6 text-gray-900"
                    aria-hidden="true"
                  />
                </div>
                Paso 3: Define festivos
              </dt>
              <dd className="mt-2 text-base leading-7 text-gray-700">
                Define los días festivos que quieras tener en cuenta.
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
