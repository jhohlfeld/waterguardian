import {
  maptilerApiKey,
  maptilerHeroStyleKey,
  maptilerHeroStyleKeyDark,
} from '@/config'
import { useDarkMode } from '@/util/useDarkMode'
import maplibregl from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'

const lng = 10.522
const lat = 52.264
const zoom = 13
const getMapStyle = (isDark: boolean) => {
  const styleKey = isDark ? maptilerHeroStyleKeyDark : maptilerHeroStyleKey
  return `https://api.maptiler.com/maps/${styleKey}/style.json?key=${maptilerApiKey}`
}

export function useMap(mapOptions?: {
  draggable?: boolean
  scrollZoom?: boolean
  keyboard?: boolean
}) {
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const isDark = useDarkMode()

  useEffect(() => {
    if (!mapContainerRef.current || map !== null) {
      return
    }

    const instance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(isDark),
      center: [lng, lat],
      zoom: zoom,
    })

    if (mapOptions?.draggable === false) {
      instance.dragPan.disable()
    }
    if (mapOptions?.scrollZoom === false) {
      instance.scrollZoom.disable()
    }
    if (mapOptions?.keyboard === false) {
      instance.keyboard.disable()
    }

    setMap(instance)
  }, [mapOptions, map])

  useEffect(() => {
    // Whenever isDark changes, update the map style
    if (map) {
      const center = map.getCenter()
      const currentZoom = map.getZoom()
      const bearing = map.getBearing()
      const pitch = map.getPitch()

      map.setStyle(getMapStyle(isDark))
      map.once('style.load', () => {
        map.setCenter(center)
        map.setZoom(currentZoom)
        map.setBearing(bearing)
        map.setPitch(pitch)
      })
    }
  }, [isDark, map])

  return { mapContainerRef, map }
}
