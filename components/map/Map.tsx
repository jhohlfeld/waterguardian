'use client'

import { ChevronDownIcon } from '@radix-ui/react-icons'
import { Feature, FeatureCollection, Point } from 'geojson'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useState } from 'react'
import { cn } from '../../util/cn'
import { CustomMarker } from './CustomMarker'
import { FilterPopover } from './FilterPopover'
import { useMap } from './hooks'
import { Sidebar } from './Sidebar'

const typeLabels: Record<string, string> = {
  boje: 'Bojen Daten',
  labor: 'Labor-Daten',
  manuell: 'Citizen Science Daten',
}

interface MeasurementData {
  value: number | string
  unit: string
  group: string
}

interface WaterGuardianProperties {
  id: string
  date: string
  type: string
  measurements: Record<string, MeasurementData>
  measurementGroups: string[]
}

type WaterGuardianFeature = Feature<Point, WaterGuardianProperties>
export type WaterGuardianFeatureCollection = FeatureCollection<
  Point,
  WaterGuardianProperties
>

interface MapProps {
  data?: WaterGuardianFeatureCollection
}

interface CollapsibleGroupProps {
  group: string
  measurements: Array<{ name: string; measurement: MeasurementData }>
  isOpen: boolean
  onToggle: () => void
}

const CollapsibleGroup = ({
  group,
  measurements,
  isOpen,
  onToggle,
}: CollapsibleGroupProps) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onToggle}
        className={cn(
          'flex items-center justify-between w-full',
          'text-sm font-semibold text-[--gray-10]',
          'hover:text-[--gray-12] transition-colors',
        )}
      >
        <span>{group}</span>
        <ChevronDownIcon
          className={cn(
            'text-[--accent-10] transition-transform duration-300',
            isOpen ? 'rotate-180' : '',
          )}
        />
      </button>
      <div
        className={cn(
          'overflow-hidden',
          'duration-300',
          isOpen
            ? 'h-auto animate-in fade-in slide-in-from-top-2'
            : 'h-0 animate-out fade-out slide-out-to-top-2',
        )}
      >
        <div className="bg-[--gray-2] rounded-lg p-4">
          <ul className="space-y-3">
            {measurements.map(({ name, measurement }) => (
              <li key={name} className="flex items-center justify-between">
                <span className="text-[--gray-11]">{name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[--gray-12] font-medium">
                    {typeof measurement.value === 'number'
                      ? measurement.value.toLocaleString('de-DE')
                      : measurement.value}
                  </span>
                  {measurement.unit && (
                    <span className="text-sm text-[--gray-10]">
                      {measurement.unit}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export const Map = ({ data }: MapProps) => {
  const { mapContainerRef, map } = useMap({
    draggable: true,
    scrollZoom: true,
    keyboard: true,
  })

  const [selectedFeature, setSelectedFeature] =
    useState<WaterGuardianFeature | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [filteredTypes, setFilteredTypes] = useState<string[]>([
    'boje',
    'labor',
    'manuell',
  ])
  const [openGroups, setOpenGroups] = useState<string[]>([])

  const handleMarkerClick = (feature: WaterGuardianFeature) => {
    setSelectedFeature(feature)
    setSidebarOpen(true)
    // Open all groups by default when selecting a new feature
    setOpenGroups(feature.properties.measurementGroups)
  }

  const handleFilterChange = (selectedTypes: string[]) => {
    setFilteredTypes(selectedTypes)
  }

  const handleFilterOpen = () => {
    if (sidebarOpen) {
      setSidebarOpen(false)
    }
  }

  const toggleGroup = (group: string) => {
    setOpenGroups((current) =>
      current.includes(group)
        ? current.filter((g) => g !== group)
        : [...current, group],
    )
  }

  if (!map) {
    return <div className="flex-1 relative w-full" ref={mapContainerRef}></div>
  }

  // Group measurements by their category
  const groupedMeasurements = selectedFeature
    ? selectedFeature.properties.measurementGroups.reduce<
        Record<string, Array<{ name: string; measurement: MeasurementData }>>
      >((acc, group) => {
        acc[group] = Object.entries(selectedFeature.properties.measurements)
          .filter(([, measurement]) => measurement.group === group)
          .map(([name, measurement]) => ({ name, measurement }))
        return acc
      }, {})
    : {}

  return (
    <div className="flex-1 relative w-full" ref={mapContainerRef}>
      <FilterPopover
        onFilterChange={handleFilterChange}
        onOpen={handleFilterOpen}
      />
      {data?.features
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
              <div className="text-sm font-semibold text-[--gray-10] mb-1">
                Data Type
              </div>
              <div className="text-[--gray-12]">
                {typeLabels[selectedFeature.properties.type] ||
                  selectedFeature.properties.type}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-[--gray-10] mb-1">
                Location ID
              </div>
              <div className="text-[--gray-12] font-mono">
                {selectedFeature.properties.id}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold text-[--gray-10] mb-1">
                Measurement Date
              </div>
              <div className="text-[--gray-12]">
                {new Date(selectedFeature.properties.date).toLocaleString(
                  'de-DE',
                  {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  },
                )}
              </div>
            </div>

            {/* Measurement Groups */}
            {Object.entries(groupedMeasurements).map(
              ([group, measurements]) => (
                <CollapsibleGroup
                  key={group}
                  group={group}
                  measurements={measurements}
                  isOpen={openGroups.includes(group)}
                  onToggle={() => toggleGroup(group)}
                />
              ),
            )}
          </div>
        ) : (
          <p className="text-[--gray-11]">No data selected</p>
        )}
      </Sidebar>
    </div>
  )
}
