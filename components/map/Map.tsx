'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'
import { CustomMarker } from './CustomMarker'
import geoData from './data/data.json'
import { FilterPopover } from './FilterPopover'
import { useMap } from './hooks'
import { Sidebar } from './Sidebar'

// GeoJSON types following the specification
type Coordinates = [number, number, number]

interface Geometry {
  type: 'Point'
  coordinates: Coordinates
}

interface Properties {
  id: string
  date: string
  measurements: Record<string, number>
  type: string
}

interface Feature {
  type: 'Feature'
  geometry: Geometry
  properties: Properties
}

interface FeatureCollection {
  type: 'FeatureCollection'
  features: Feature[]
}

// Safely cast the imported data
const geojsonData = geoData as unknown as FeatureCollection

export const Map = () => {
  const { mapContainerRef, map } = useMap({
    draggable: true,
    scrollZoom: false,
    keyboard: false,
  })

  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filteredTypes, setFilteredTypes] = useState<string[]>([
    'boje',
    'labor',
    'manuell',
  ])

  if (!map) {
    return (
      <div className="relative w-screen h-[80vh]">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>
    )
  }

  const handleMarkerClick = (feature: Feature) => {
    setSelectedFeature(feature)
    setSidebarOpen(true)
  }

  const handleFilterChange = (selectedTypes: string[]) => {
    setFilteredTypes(selectedTypes)
  }

  return (
    <div className="relative w-screen h-[80vh]">
      <div ref={mapContainerRef} className="w-full h-full relative">
        <FilterPopover onFilterChange={handleFilterChange} />
      </div>
      {geojsonData.features
        .filter((feature) => filteredTypes.includes(feature.properties.type))
        .map((feature) => (
          <CustomMarker
            key={feature.properties.id}
            map={map}
            position={[
              feature.geometry.coordinates[0],
              feature.geometry.coordinates[1],
            ]}
            onClick={() => handleMarkerClick(feature)}
            isSelected={
              selectedFeature?.properties.id === feature.properties.id
            }
          />
        ))}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        {selectedFeature ? (
          <div>
            <h2 className="text-lg font-bold">Measurement Data</h2>
            <div className="mt-2 text-sm text-gray-11">
              ID: {selectedFeature.properties.id}
            </div>
            <p className="mt-2">
              <strong>Date:</strong>{' '}
              {new Date(selectedFeature.properties.date).toLocaleString()}
            </p>
            <ul className="mt-4 space-y-2">
              {Object.entries(selectedFeature.properties.measurements).map(
                ([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <strong>{key}:</strong>
                    <span>{value}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : (
          <p>No data selected</p>
        )}
      </Sidebar>
    </div>
  )
}
