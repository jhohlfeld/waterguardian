'use client'

import 'maplibre-gl/dist/maplibre-gl.css'
import { useMap } from './hooks'

export const Map = () => {
  const { mapContainer } = useMap({
    draggable: false,
    scrollZoom: false,
    keyboard: false,
  })

  return <div className="w-screen h-[80vh]" ref={mapContainer}></div>
}
