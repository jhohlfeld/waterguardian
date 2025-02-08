'use client'

import { useSession } from '@/lib/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import Link from 'next/link'
import { useState } from 'react'

export default function MyAccount() {
  const { session } = useSession()

  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gray-1 flex flex-col items-center py-8">
      <main className="w-full max-w-4xl mt-6 bg-white rounded-2xl shadow p-6 flex-grow-0">
        {session ? (
          <Tabs defaultValue="dashboard" onValueChange={setActiveTab}>
            <TabsList className="flex space-x-4 border-b-2 border-gray-4 pb-2 mb-4">
              <TabsTrigger
                value="dashboard"
                className={`py-2 px-4 font-medium text-sm rounded-xl focus:outline-none ${
                  activeTab === 'dashboard'
                    ? 'bg-accent-9 text-white'
                    : 'bg-accent-3 text-gray-11'
                }`}
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="formSubmission"
                className={`py-2 px-4 font-medium text-sm rounded-xl focus:outline-none ${
                  activeTab === 'formSubmission'
                    ? 'bg-accent-9 text-white'
                    : 'bg-accent-3 text-gray-11'
                }`}
              >
                Sample Form
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="text-center">
                <h2 className="text-lg font-bold text-gray-12">
                  Welcome Waterguardian!
                </h2>
                <div className="mt-4 bg-gray-2 rounded-xl p-6">
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-gray-12">
                      {session.name ? session.name : session.email}
                    </p>
                    <p className="text-sm text-gray-10">
                      Email: {session.email}
                    </p>
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
            </TabsContent>

            <TabsContent value="formSubmission">
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-11"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-11"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-11"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-4 focus:border-accent-6 focus:ring-accent-6 text-lg py-3 px-4"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent-9 text-white py-2 px-4 rounded-xl hover:bg-accent-10 focus:outline-none focus:ring-2 focus:ring-accent-5 focus:ring-offset-2"
                >
                  Submit
                </button>
              </form>
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            <p>You are not signed in.</p>
          </div>
        )}
      </main>
    </div>
  )
}
