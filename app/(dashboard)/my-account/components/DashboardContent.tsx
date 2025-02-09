'use client'

import Link from 'next/link'

interface DashboardContentProps {
  session: {
    name?: string
    email: string
    role: string
  }
}

export function DashboardContent({ session }: DashboardContentProps) {
  return (
    <div className="text-center">
      <h2 className="text-lg font-bold text-gray-12">Welcome Waterguardian!</h2>
      <div className="mt-4 bg-gray-2 rounded-xl p-6">
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-12">
            {session.name ? session.name : session.email}
          </p>
          <p className="text-sm text-gray-10">Email: {session.email}</p>
          <p className="text-sm text-gray-10">Role: {session.role}</p>
          <Link
            href="/api/auth/signout"
            className="inline-block text-sm text-accent-10 hover:underline"
          >
            Sign out
          </Link>
        </div>
      </div>
    </div>
  )
}
