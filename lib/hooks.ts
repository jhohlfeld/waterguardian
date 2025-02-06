'use client'

import { useEffect, useState } from 'react'
import { getSession, SessionPayload } from './auth'

export function useSession() {
  const [session, setSession] = useState<SessionPayload | undefined>()

  useEffect(() => {
    getSession().then(setSession)
  }, [])

  return { session }
}
