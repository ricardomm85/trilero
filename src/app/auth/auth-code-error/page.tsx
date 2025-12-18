'use client';

import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-700">
        <h1 className="text-3xl font-bold text-center text-red-600">Authentication Error</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          There was a problem signing you in. Please try again.
        </p>
        <Link
          href="/login"
          className="block w-full py-3 px-4 font-bold text-center text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
