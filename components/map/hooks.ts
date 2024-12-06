import { maptilerApiKey, maptilerHeroStyleKey } from '@/config'
import maplibregl from 'maplibre-gl'
import { useEffect, useRef, useState } from 'react'

const lng = 10.522
const lat = 52.264
const zoom = 13
const style = `https://api.maptiler.com/maps/${maptilerHeroStyleKey}/style.json?key=${maptilerApiKey}`

export function useMap(mapOptions?: {
  draggable?: boolean
  scrollZoom?: boolean
  keyboard?: boolean
}) {
  const [map, setMap] = useState<maplibregl.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || map !== null) {
      return
    }

    const instance = new maplibregl.Map({
      container: mapContainerRef.current,
      style,
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

  return { mapContainerRef, map }
}
