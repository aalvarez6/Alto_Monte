import { useState, useEffect, useRef } from 'react'
import { Zap, Leaf, Network, Battery, Clock, Coins } from 'lucide-react'
import { BASE_METRICS } from '../data/simulatedData'

function useCounter(target, duration = 1400, decimals = 0) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  const ref = useRef(null)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          setValue(+(eased * target).toFixed(decimals))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration, decimals])
  return [value, ref]
}

function Card({ icon: Icon, value, unit, label, color, decimals = 0, prefix = '' }) {
  const [count, ref] = useCounter(value, 1600, decimals)
  return (
    <div ref={ref} className="metric-card group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
             style={{ background:`${color}15`, border:`1px solid ${color}28` }}>
          <Icon size={17} style={{ color }}/>
        </div>
        <div className="w-2 h-2 rounded-full anim-pulse mt-1"
             style={{ background: color, boxShadow:`0 0 7px ${color}` }}/>
      </div>
      <div className="font-mono font-bold text-2xl text-carbon mb-1" style={{ fontFamily:'"JetBrains Mono",monospace' }}>
        {prefix}{decimals > 0 ? count.toFixed(decimals) : count.toLocaleString()}
        <span className="text-xs font-normal ml-1" style={{ color }}>{unit}</span>
      </div>
      <p className="text-xs text-gray-400 font-mono tracking-wide">{label}</p>
    </div>
  )
}

export default function MetricsBar() {
  const [live, setLive] = useState(BASE_METRICS)
  useEffect(() => {
    const id = setInterval(() => setLive(m => ({
      ...m,
      energyToday: m.energyToday + Math.round(Math.random() * 4),
      co2Avoided:  +(m.co2Avoided + Math.random() * 0.002).toFixed(3),
      communitySavings: m.communitySavings + Math.round(Math.random() * 500),
    })), 3000)
    return () => clearInterval(id)
  }, [])

  const cards = [
    { icon: Zap,     value: live.energyToday,  unit: 'kWh',   label:'Energía generada hoy',   color:'#7BAE8A' },
    { icon: Leaf,    value: live.co2Avoided,    unit: 'ton',   label:'CO₂ evitado',             color:'#4A6741', decimals:2 },
    { icon: Network, value: live.activeNodes,   unit: '',      label:'Nodos activos',            color:'#A8C5C2' },
    { icon: Zap,     value: live.totalCapacity, unit: 'kW',    label:'Capacidad distribuida',   color:'#9B8FB5' },
    { icon: Clock,   value: live.autonomy,      unit: 'h',     label:'Autonomía energética',    color:'#C9A96E', decimals:1 },
    { icon: Coins,   value: live.communitySavings/1_000_000, unit:'M COP', label:'Ahorro comunitario', color:'#D4A5A5', decimals:1, prefix:'$' },
  ]

  return (
    <section id="metricas" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-10">
          <span className="eyebrow">métricas en tiempo real</span>
          <div className="flex items-center gap-1.5 text-xs font-mono text-gray-400 ml-auto">
            <div className="w-2 h-2 rounded-full anim-pulse" style={{ background:'#7BAE8A' }}/>
            Actualizando cada 3s
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {cards.map((c, i) => <Card key={i} {...c}/>)}
        </div>
      </div>
    </section>
  )
}
