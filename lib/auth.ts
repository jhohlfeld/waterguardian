'use server'

import { JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { decrypt, encrypt } from './jwt'
import client from './mongodb'

interface User {
  email: string
  name: string
  role: string
  token: string
}

export type SessionPayload = Exclude<User, 'token'> & JWTPayload

export async function loadAllUsers() {
  const data = await client.collection('users').find({}).toArray()
  return data
}

type FormState = { message?: string } | undefined

export async function signIn(_state: FormState, formData: FormData) {
  console.log('got formData:', JSON.stringify(formData))

  const { email, token } = Object.fromEntries(formData.entries()) as {
    email: string
    token: string
  }
  const user = await client
    .collection<User>('users')
    .findOne({ email, token }, { projection: { token: 0 } })

  if (user === null) {
    return { message: 'Invalid credentials' }
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime()
  const { _id, ...payload } = user
  const session = await encrypt({ sub: String(_id), ...payload })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const jwt = (await cookies()).get('session')?.value

  if (!jwt) {
    return
  }

  try {
    return await decrypt(jwt)
  } catch (error) {
    console.error('Error decrypting session:', error)
  }
}
