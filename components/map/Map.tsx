'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect } from 'react'
import { useMap } from './hooks'

interface MeasurementData {
  id: string
  date: string
  geo: [number, number, number]
  values: Record<string, number>
}

const measurementData: MeasurementData[] = [
  {
    id: '1',
    date: '20241231T00:00:00',
    geo: [10.522, 52.264, 0],
    values: { Copper: 0.5, Lead: 0.3, Nickel: 0.2, Mercury: 0.1 },
  },
  // Add more data as needed
]

export const Map = () => {
  const { mapContainerRef, map } = useMap({
    draggable: false,
    scrollZoom: false,
    keyboard: false,
  })

  useEffect(() => {
    if (!map) return

    measurementData.forEach((data) => {
      new maplibregl.Marker().setLngLat([data.geo[0], data.geo[1]]).addTo(map)
    })
  }, [map])

  return (
    <div className="relative w-screen h-[80vh]">
      <div ref={mapContainerRef} className="w-full h-full"></div>
    </div>
  )
}
