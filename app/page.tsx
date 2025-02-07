import { Map } from '@/components/map/Map'
import { Waterguardian } from './api/samples/types'

async function getSamples() {
  const response = await fetch('http://localhost:3000/api/samples', {
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
