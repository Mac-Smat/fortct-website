import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default function ContactMap({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const map = L.map(el, {
      center: [7.3776, 3.947],
      zoom: 14,
      zoomControl: false,
      scrollWheelZoom: false,
      attributionControl: true,
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)
    const icon = L.divIcon({
      className: '',
      html:
        '<div style="width:48px;height:48px;border-radius:9999px;background:rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.15)">' +
        '<div style="width:16px;height:16px;border-radius:9999px;background:#E0EC38"></div></div>',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    })
    L.marker([7.3776, 3.947], { icon }).addTo(map)
    return () => {
      map.remove()
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`w-full lg:w-[567px] h-[420px] lg:h-[520px] shrink-0 rounded-[24px] overflow-hidden [&_.leaflet-tile]:grayscale [&_.leaflet-tile]:brightness-[1.12] [&_.leaflet-tile]:contrast-[0.95] ${className}`}
    />
  )
}