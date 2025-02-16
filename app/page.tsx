import { Map } from '@/components/map/Map'
import { Waterguardian } from './api/samples/types'

async function getSamples() {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const response = await fetch(`${baseUrl}/api/samples`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error('Failed to fetch samples')
  }

  return response.json() as Promise<Waterguardian.FeatureCollection>
}

export default async function Home() {
  const data = await getSamples()

  return (
    <main className="flex-grow flex">
      <Map data={data} />
    </main>
  )
}
