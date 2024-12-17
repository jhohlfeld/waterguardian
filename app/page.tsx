'use client'

import { Map } from '@/components/map/Map'
import { useEffect, useState } from 'react'
import { Waterguardian } from './graph/samples/types'

export default function Home() {
  const [data, setData] = useState<
    Waterguardian.FeatureCollection | undefined
  >()

  useEffect(() => {
    fetch('/graph/samples')
      .then(
        (response) =>
          response.json() as Promise<Waterguardian.FeatureCollection>,
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
