'use client'

import { useSession } from '@/lib/hooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { useState } from 'react'
import { DashboardContent } from './components/DashboardContent'
import { SampleForm } from './components/SampleForm'

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
              <DashboardContent session={session} />
            </TabsContent>

            <TabsContent value="formSubmission">
              <SampleForm />
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
