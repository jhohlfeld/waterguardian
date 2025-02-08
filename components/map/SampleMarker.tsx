'use client'

import maplibregl from 'maplibre-gl'
import { useEffect, useRef } from 'react'
import colors from 'tailwindcss/colors'

interface CustomMarkerProps {
  map: maplibregl.Map
  position: [number, number]
  onClick: () => void
  isSelected?: boolean
}

export const SampleMarker = ({
  map,
  position,
  onClick,
  isSelected,
}: CustomMarkerProps) => {
  const markerRef = useRef<maplibregl.Marker | null>(null)

  useEffect(() => {
    if (!map) return

    // Create marker using Tailwind's colors
    const marker = new maplibregl.Marker({
      color: isSelected ? colors.green[600] : colors.blue[600],
      scale: isSelected ? 1 : 0.8,
    })
      .setLngLat(position)
      .addTo(map)

    // Add click handler
    marker.getElement().addEventListener('click', onClick)

    // Store marker reference
    markerRef.current = marker

    // Cleanup
    return () => {
      marker.remove()
    }
  }, [map, position, onClick, isSelected])

  return null
}
