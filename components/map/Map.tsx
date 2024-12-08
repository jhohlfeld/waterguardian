'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'
import { CustomMarker } from './CustomMarker'
import geoData from './data/data.json'
import { FilterPopover } from './FilterPopover'
import { useMap } from './hooks'
import { Sidebar } from './Sidebar'

const typeLabels: Record<string, string> = {
  boje: 'Bojen Daten',
  labor: 'Labor-Daten',
  manuell: 'Citizen Science Daten',
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

  const handleMarkerClick = (feature: Feature) => {
    setSelectedFeature(feature)
    setSidebarOpen(true)
  }

  const handleFilterChange = (selectedTypes: string[]) => {
    setFilteredTypes(selectedTypes)
  }

  const handleFilterOpen = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  if (!map) {
    return (
      <div className="relative w-screen h-[80vh]" ref={mapContainerRef}></div>
    )
  }

  return (
    <div className="relative w-screen h-[80vh]" ref={mapContainerRef}>
      <FilterPopover
        onFilterChange={handleFilterChange}
        onOpen={handleFilterOpen}
      />
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
          <div className="space-y-6">
            <div>
              <div className="text-sm font-semibold text-gray-10 mb-1">
                Data Type
              </div>
              <div className="text-gray-12">
                {typeLabels[selectedFeature.properties.type]}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-10 mb-1">
                Location ID
              </div>
              <div className="text-gray-12 font-mono">
                {selectedFeature.properties.id}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-10 mb-1">
                Measurement Date
              </div>
              <div className="text-gray-12">
                {new Date(selectedFeature.properties.date).toLocaleString(
                  'de-DE',
                  {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  },
                )}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-10 mb-1">
                Measurements
              </div>
              <div className="bg-gray-2 rounded-lg p-4">
                <ul className="space-y-3">
                  {Object.entries(selectedFeature.properties.measurements).map(
                    ([key, value]) => (
                      <li
                        key={key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-11">{key}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-12 font-medium">
                            {value}
                          </span>
                          <span className="text-sm text-gray-10">mg/L</span>
                        </div>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-11">No data selected</p>
        )}
      </Sidebar>
    </div>
  )
}

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
