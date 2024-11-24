import { maptilerApiKey, maptilerHeroStyleKey } from '@/config'
import maplibregl from 'maplibre-gl'
import { useEffect, useRef } from 'react'

const lng = 10.522
const lat = 52.264
const zoom = 13
const style = `https://api.maptiler.com/maps/${maptilerHeroStyleKey}/style.json?key=${maptilerApiKey}`

export function useMap(mapOptions?: {
  draggable?: boolean
  scrollZoom?: boolean
  keyboard?: boolean
}) {
  const mapRef = useRef<maplibregl.Map | null>(null)
  const mapContainer = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) {
      return
    }
    mapRef.current = new maplibregl.Map({
      container: mapContainer.current,
      style,
      center: [lng, lat],
      zoom: zoom,
    })

    const map = mapRef.current

    if (mapOptions?.draggable === false) {
      map.dragPan.disable()
    }
    if (mapOptions?.scrollZoom === false) {
      map.scrollZoom.disable()
    }
    if (mapOptions?.keyboard === false) {
      map.keyboard.disable()
    }
  }, [mapOptions])

  return { mapContainer, map: mapRef.current }
}
