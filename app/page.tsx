import { type FeatureCollection, Map } from '@/components/map/Map'
import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<FeatureCollection | undefined>()

  useEffect(() => {
    fetch('/graph/samples')
      .then((response) => response.json() as Promise<FeatureCollection>)
      .then((featureCollection) => setData(featureCollection))
  }, [])

  return (
    <main className="flex-grow flex">
      <Map data={data} />
    </main>
  )
}
