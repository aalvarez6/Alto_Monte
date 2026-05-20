import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const LAYERS = [
  { id:'city',  label:'Ciudad',      icon:'🏙️', desc:'Vista macro de toda la red urbana distribuida',          color:'#7BAE8A' },
  { id:'com',   label:'Comunas',     icon:'🗺️', desc:'Agrupaciones de nodos por barrio y sector',             color:'#A8C5C2' },
  { id:'node',  label:'Nodos',       icon:'⚡', desc:'Nodo barrial: 1 inversor + paneles + BESS',              color:'#9B8FB5' },
  { id:'micro', label:'Microrredes', icon:'🔗', desc:'Conexiones punto a punto entre nodos vecinos',           color:'#C9A96E' },
  { id:'urban', label:'Red Urbana',  icon:'🌐', desc:'Red energética resiliente e interoperable a escala',     color:'#D4A5A5' },
]
const SCALING = [
  { lvl:'01', title:'Casa inteligente',     icon:'🏠', desc:'Medición inteligente, paneles y mini-BESS domiciliario', users:'1 hogar',        color:'#7BAE8A' },
  { lvl:'02', title:'Nodo barrial',         icon:'⚡', desc:'Concentrador de 100–300 hogares con inversor comunitario', users:'200 hogares',   color:'#A8C5C2' },
  { lvl:'03', title:'Microred comunitaria', icon:'🔗', desc:'Red de 5–10 nodos con BESS compartido y capacidad isla', users:'2,000 hogares',  color:'#9B8FB5' },
  { lvl:'04', title:'Distrito energético',  icon:'🏙️', desc:'Múltiples microrredes coordinadas por IA de distrito',  users:'15,000 hogares', color:'#C9A96E' },
  { lvl:'05', title:'Ciudad resiliente',    icon:'🌐', desc:'Red distribuida interoperable a escala urbana',          users:'500,000+ hog.',  color:'#D4A5A5' },
]

export default function DigitalTwin() {
  const [active, setActive] = useState('city')
  const cur = LAYERS.find(l => l.id === active)

  return (
    <>
      {/* ── Digital Twin ──────────────────────────── */}
      <section id="twin" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow block mb-3">gemelo digital urbano</span>
          <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C', marginBottom:'8px' }}>
            Réplica digital de la <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>ciudad energética</em>
          </h2>
          <p className="text-gray-400 text-sm mb-12 max-w-xl">
            Cada nodo tiene su gemelo digital: simula escenarios, detecta anomalías y optimiza el despacho antes de actuar en el sistema físico.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Layer selector */}
            <div className="flex flex-col gap-3">
              {LAYERS.map(l => (
                <button key={l.id} onClick={() => setActive(l.id)}
                        className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-300 ${
                          active === l.id
                            ? 'bg-white shadow-lift'
                            : 'bg-[rgba(247,244,239,.6)] border-[rgba(123,174,138,.15)] hover:border-[rgba(123,174,138,.35)]'
                        }`}
                        style={ active === l.id ? { borderColor:`${l.color}50` } : {} }>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                       style={{ background:`${l.color}12`, border:`1px solid ${l.color}25` }}>
                    {l.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-[.62rem] text-gray-400 mb-0.5">Capa</div>
                    <div className="font-semibold text-carbon text-sm">{l.label}</div>
                    {active === l.id && <p className="text-xs text-gray-400 mt-1">{l.desc}</p>}
                  </div>
                  {active === l.id && <ChevronRight size={15} style={{ color:l.color, flexShrink:0 }}/>}
                </button>
              ))}
            </div>

            {/* SVG diagram */}
            <div className="rounded-2xl overflow-hidden border border-[rgba(123,174,138,.2)] shadow-card p-5"
                 style={{ background:'rgba(247,244,239,.6)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full anim-pulse"
                     style={{ background:cur.color, boxShadow:`0 0 7px ${cur.color}` }}/>
                <span className="font-mono text-[.65rem] text-gray-400 tracking-wider">
                  CAPA ACTIVA — {cur.label.toUpperCase()}
                </span>
              </div>
              <svg viewBox="0 0 480 360" className="w-full">
                <defs>
                  <radialGradient id="rg">
                    <stop offset="0%"   stopColor={cur.color} stopOpacity=".1"/>
                    <stop offset="100%" stopColor="#F7F4EF"  stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <rect width="480" height="360" fill="url(#rg)"/>
                {/* Rings */}
                {[175,135,95,58,26].map((r, i) => (
                  <circle key={i} cx="240" cy="180" r={r}
                          fill="none"
                          stroke={LAYERS[i].color}
                          strokeWidth={LAYERS[i].id === active ? 2 : .8}
                          opacity={LAYERS[i].id === active ? .75 : .2}
                          strokeDasharray={LAYERS[i].id === active ? undefined : '4 6'}/>
                ))}
                {/* Dots on rings */}
                {[[6,175],[5,135],[4,95],[3,58]].map(([cnt, r], ri) =>
                  Array.from({length:cnt}, (_, k) => {
                    const angle = (k/cnt)*Math.PI*2 - Math.PI/2
                    return (
                      <circle key={`${ri}-${k}`}
                              cx={240 + r*Math.cos(angle)} cy={180 + r*Math.sin(angle)} r={4}
                              fill={LAYERS[ri].id === active ? LAYERS[ri].color : '#E8D5B7'}
                              stroke={LAYERS[ri].color}
                              strokeWidth={LAYERS[ri].id === active ? 0 : 1}
                              opacity={LAYERS[ri].id === active ? 1 : .35}/>
                    )
                  })
                )}
                {/* Center */}
                <circle cx="240" cy="180" r="24" fill="white" stroke={cur.color} strokeWidth="2"/>
                <text x="240" y="176" textAnchor="middle" dominantBaseline="middle" fontSize="18">{cur.icon}</text>
                <text x="240" y="196" textAnchor="middle" fill={cur.color} fontSize="8" fontFamily="JetBrains Mono">{cur.label}</text>
                {/* Ring labels */}
                {LAYERS.map((l, i) => {
                  const r = [175,135,95,58,26][i]
                  return (
                    <text key={l.id} x={240+r+10} y={180}
                          fill={l.id === active ? l.color : '#C8B89A'}
                          fontSize={l.id === active ? 9 : 8}
                          fontFamily="JetBrains Mono" dominantBaseline="middle">
                      {l.label}
                    </text>
                  )
                })}
              </svg>
              <div className="mt-4 p-3 rounded-xl"
                   style={{ background:`${cur.color}0e`, border:`1px solid ${cur.color}20` }}>
                <p className="text-xs text-gray-500">{cur.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scaling vision ────────────────────────── */}
      <section className="py-20 bg-niebla overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow block mb-3">visión de escalamiento</span>
          <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C', marginBottom:'48px' }}>
            De la casa a la <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>ciudad resiliente</em>
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-px"
                 style={{ background:'linear-gradient(180deg,#7BAE8A44,#A8C5C244,#9B8FB544,#C9A96E44,#D4A5A544)' }}/>

            <div className="flex flex-col gap-10">
              {SCALING.map((s, i) => (
                <div key={s.lvl}
                     className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-8 ${
                       i%2===0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
                     }`}>
                  {/* Dot */}
                  <div className="absolute left-[18px] sm:left-1/2 w-4 h-4 rounded-full border-2 -translate-x-2 sm:-translate-x-2 bg-niebla"
                       style={{ borderColor:s.color, boxShadow:`0 0 10px ${s.color}66` }}/>
                  {/* Card */}
                  <div className="ml-12 sm:ml-0 sm:w-[calc(50%-40px)] bg-white rounded-2xl p-6 border border-[rgba(123,174,138,.15)] shadow-card hover:shadow-lift transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="font-mono text-xs text-gray-300">{s.lvl}</span>
                      <span className="text-2xl">{s.icon}</span>
                      <span className="ml-auto font-mono text-xs px-2 py-1 rounded"
                            style={{ background:`${s.color}12`, color:s.color }}>{s.users}</span>
                    </div>
                    <h3 className="font-semibold text-carbon mb-2" style={{ fontFamily:'"DM Sans",sans-serif' }}>{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                  <div className="hidden sm:block sm:w-[calc(50%-40px)]"/>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
