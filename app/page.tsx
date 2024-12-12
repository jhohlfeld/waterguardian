'use client'

import { Map, type WaterGuardianFeatureCollection } from '@/components/map/Map'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<WaterGuardianFeatureCollection | undefined>()

  useEffect(() => {
    fetch('/graph/samples')
      .then(
        (response) =>
          response.json() as Promise<WaterGuardianFeatureCollection>,
      )
      .then((featureCollection) => setData(featureCollection))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <main className="flex-grow flex">
      <Map data={data} />
    </main>
  )
}
