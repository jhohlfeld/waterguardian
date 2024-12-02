'use client'

import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useEffect, useState } from 'react'
import rawData from './data/data.json'
import { useMap } from './hooks'
import { Sidebar } from './Sidebar'

interface MeasurementData {
  id: string
  date: string
  geo: [number, number, number]
  values: Record<string, number>
}

// Define a type for the raw JSON data
type RawMeasurementData = Omit<MeasurementData, 'geo'> & { geo: number[] }

// Cast the imported JSON data to the correct type
const measurementData: MeasurementData[] = (
  rawData as RawMeasurementData[]
).map((data) => ({
  ...data,
  geo: data.geo as [number, number, number],
}))

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
