import { useState, useEffect } from 'react'

const NODES = [
  { id:'solar',  x:50,  y:18,  label:'Solar Array',    icon:'☀️',  color:'#C9A96E' },
  { id:'hub',    x:50,  y:48,  label:'Nodo Central',   icon:'⚡',  color:'#7BAE8A' },
  { id:'bess',   x:18,  y:74,  label:'Almacenamiento', icon:'🔋',  color:'#A8C5C2' },
  { id:'homes',  x:82,  y:74,  label:'Hogares',        icon:'🏠',  color:'#9B8FB5' },
  { id:'grid',   x:50,  y:90,  label:'Red Pública',    icon:'🔌',  color:'#D4A5A5' },
]
const LINKS = [
  { from:'solar', to:'hub',   active:true,  power:'342 kW' },
  { from:'hub',   to:'bess',  active:true,  power:'80 kW'  },
  { from:'hub',   to:'homes', active:true,  power:'280 kW' },
  { from:'bess',  to:'grid',  active:false, power:'0 kW'   },
]
function coord(id, W, H) {
  const n = NODES.find(n => n.id === id)
  return { x:(n.x/100)*W, y:(n.y/100)*H }
}

export default function EnergyFlow() {
  const [tick, setTick] = useState(0)
  const W = 540, H = 320
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 55)
    return () => clearInterval(id)
  }, [])

  return (
    <section id="flow" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <span className="eyebrow block mb-3">flujo energético simulado</span>
        <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C', marginBottom:'8px' }}>
          La energía como <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>sistema vivo</em>
        </h2>
        <p className="text-gray-400 text-sm mb-12 max-w-xl">
          Flujo energético en tiempo real entre generación solar, almacenamiento y consumo comunitario.
        </p>
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* SVG */}
          <div className="rounded-2xl overflow-hidden border border-[rgba(123,174,138,.2)] shadow-card p-4"
               style={{ background:'rgba(247,244,239,.7)' }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ fontFamily:'"JetBrains Mono",monospace' }}>
              {/* Grid */}
              {Array.from({length:11},(_, i)=>(
                <line key={`h${i}`} x1={0} y1={i*30} x2={W} y2={i*30} stroke="rgba(123,174,138,.06)" strokeWidth="1"/>
              ))}
              {Array.from({length:19},(_, i)=>(
                <line key={`v${i}`} x1={i*30} y1={0} x2={i*30} y2={H} stroke="rgba(123,174,138,.06)" strokeWidth="1"/>
              ))}

              {/* Links */}
              {LINKS.map((l, i) => {
                const a = coord(l.from, W, H)
                const b = coord(l.to,   W, H)
                const len = Math.hypot(b.x-a.x, b.y-a.y)
                const off = (tick * (l.active ? 2 : 0)) % (len * 2)
                const c = l.active ? '#7BAE8A' : '#D1C9BC'
                return (
                  <g key={i}>
                    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={c} strokeWidth={l.active?2:1} opacity={.25}/>
                    {l.active && (
                      <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                            stroke="url(#flowGrad)" strokeWidth={3} opacity={.85}
                            strokeDasharray={`${len*.28} ${len*1.5}`}
                            strokeDashoffset={-off}/>
                    )}
                    <text x={(a.x+b.x)/2+8} y={(a.y+b.y)/2-8}
                          fill={c} fontSize="8" opacity=".75">{l.power}</text>
                  </g>
                )
              })}

              {/* Gradient for animated line */}
              <defs>
                <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7BAE8A"/>
                  <stop offset="100%" stopColor="#A8C5C2"/>
                </linearGradient>
              </defs>

              {/* Nodes */}
              {NODES.map(n => {
                const { x, y } = coord(n.id, W, H)
                const r = n.id === 'hub' ? 27 : 20
                return (
                  <g key={n.id}>
                    <circle cx={x} cy={y} r={r+10} fill={n.color} opacity={.06}/>
                    <circle cx={x} cy={y} r={r+4} fill="none" stroke={n.color} strokeWidth="1" opacity={.22} strokeDasharray="4 5"/>
                    <circle cx={x} cy={y} r={r} fill="white" stroke={n.color} strokeWidth={n.id==='hub'?2:1.5}/>
                    <text x={x} y={y+1} textAnchor="middle" dominantBaseline="middle" fontSize={n.id==='hub'?17:13}>{n.icon}</text>
                    <text x={x} y={y+r+13} textAnchor="middle" fill="#9ca3af" fontSize="8">{n.label}</text>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Stats column */}
          <div className="flex flex-col gap-4">
            {[
              { icon:'☀️', title:'Generación solar', value:'342 kW', sub:'82% de capacidad instalada', color:'#C9A96E' },
              { icon:'⚡', title:'Balance del nodo',  value:'+62 kW', sub:'Excedente hacia batería',    color:'#7BAE8A' },
              { icon:'🔋', title:'Estado BESS',       value:'SOC 74%', sub:'Cargando a 80 kW',          color:'#A8C5C2' },
              { icon:'🏠', title:'Consumo hogares',   value:'280 kW', sub:'240 hogares abastecidos',    color:'#9B8FB5' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-[rgba(123,174,138,.18)] flex items-center gap-4 hover:shadow-card transition-all">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                     style={{ background:`${s.color}12`, border:`1px solid ${s.color}28` }}>
                  {s.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 font-mono mb-0.5">{s.title}</div>
                  <div className="font-mono font-bold text-carbon">{s.value}</div>
                  <div className="text-xs text-gray-400 truncate">{s.sub}</div>
                </div>
                <div className="w-2 h-2 rounded-full anim-pulse flex-shrink-0"
                     style={{ background:s.color, boxShadow:`0 0 7px ${s.color}` }}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
