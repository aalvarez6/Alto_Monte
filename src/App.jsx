import { useEffect, useState } from 'react'
import Navbar        from './components/Navbar'
import Hero          from './components/Hero'
import MetricsBar    from './components/MetricsBar'
import MapSection    from './components/MapSection'
import EnergyFlow    from './components/EnergyFlow'
import Dashboard     from './components/Dashboard'
import DigitalTwin   from './components/DigitalTwin'
import ResearchRoadmap from './components/ResearchRoadmap'
import Footer        from './components/Footer'

// Load Leaflet from CDN — avoids SSR issues and keeps bundle lean
function useLeafletCDN() {
  const [ready, setReady] = useState(!!window.L)

  useEffect(() => {
    if (window.L) { setReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setReady(true)
    document.head.appendChild(script)
  }, [])

  return ready
}

export default function App() {
  const leafletReady = useLeafletCDN()

  return (
    <div className="min-h-screen bg-void text-white">
      <Navbar />
      <Hero />
      <MetricsBar />
      {leafletReady && <MapSection />}
      <EnergyFlow />
      <Dashboard />
      <DigitalTwin />
      <ResearchRoadmap />
      <Footer />
    </div>
  )
}
