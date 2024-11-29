'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import { useMap } from './hooks'
import { Sidebar } from './Sidebar'

interface MeasurementData {
  id: string
  date: string
  geo: [number, number, number]
  values: Record<string, number>
}

const measurementData: MeasurementData[] = [
  {
    id: '1',
    date: '2024-12-31T14:00:00',
    geo: [10.523, 52.256, 0],
    values: { Copper: 0.5, Lead: 0.3, Nickel: 0.2, Mercury: 0.1 },
  },
  {
    id: '2',
    date: '2024-12-31T14:00:00',
    geo: [10.516, 52.272, 0],
    values: { Copper: 0.2, Lead: 0.7, Nickel: 0.8, Mercury: 0.4 },
  },
]

export const Map = () => {
  const { mapContainerRef, map } = useMap({
    draggable: true,
    scrollZoom: false,
    keyboard: false,
  })

  const [selectedData, setSelectedData] = useState<MeasurementData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!map) return

    measurementData.forEach((data) => {
      const marker = new maplibregl.Marker()
        .setLngLat([data.geo[0], data.geo[1]])
        .addTo(map)

      marker.getElement().addEventListener('click', () => {
        setSelectedData(data)
        setSidebarOpen(true)
      })
    })
  }, [map])

  return (
    <div className="relative w-screen h-[80vh] flex overflow-hidden">
      <div ref={mapContainerRef} className="flex-grow w-full h-full"></div>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        {selectedData ? (
          <div>
            <h2 className="text-lg font-bold">Measurement Data</h2>
            <p>
              <strong>Date:</strong>{' '}
              {new Date(selectedData.date).toLocaleString()}
            </p>
            <ul className="mt-4">
              {Object.entries(selectedData.values).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No data selected</p>
        )}
      </Sidebar>
    </div>
  )
}
