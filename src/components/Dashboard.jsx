import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { generate24h, COMMUNE_DATA } from '../data/simulatedData'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white rounded-xl p-3 border border-[rgba(123,174,138,.25)] shadow-card text-xs font-mono">
      <p className="text-gray-400 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background:p.color }}/>
          <span className="text-gray-500">{p.name}:</span>
          <span className="text-carbon font-semibold">{p.value} kW</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [data, setData] = useState(generate24h())
  const [tab, setTab] = useState('generacion')
  useEffect(() => {
    const id = setInterval(() => setData(generate24h()), 8000)
    return () => clearInterval(id)
  }, [])

  const tabs = [
    { id:'generacion', label:'Generación & Consumo' },
    { id:'comunas',    label:'Demanda por Comuna' },
    { id:'balance',    label:'Balance Energético' },
  ]

  return (
    <section id="dashboard" className="py-20 bg-niebla">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow block mb-3">dashboard energético</span>
            <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C' }}>
              Monitoreo <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>en tiempo real</em>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <div className="w-2 h-2 rounded-full anim-pulse" style={{ background:'#7BAE8A' }}/>
            Actualizando cada 8s
          </div>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
                    className={`px-4 py-2 rounded-lg text-xs font-mono transition-all duration-200 ${
                      tab === t.id
                        ? 'text-white'
                        : 'bg-white border border-[rgba(123,174,138,.2)] text-gray-400 hover:text-musgo'
                    }`}
                    style={ tab === t.id
                      ? { background:'linear-gradient(135deg,#7BAE8A,#A8C5C2)' }
                      : {} }>
              {t.label}
            </button>
          ))}
        </div>

        {/* Chart panel */}
        <div className="bg-white rounded-2xl border border-[rgba(123,174,138,.18)] shadow-card p-6">
          {tab === 'generacion' && (
            <>
              <p className="text-xs text-gray-400 font-mono mb-6">Generación solar vs. consumo — 24 horas (kW)</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="gSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#7BAE8A" stopOpacity={.25}/>
                      <stop offset="95%" stopColor="#7BAE8A" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gConsumo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#9B8FB5" stopOpacity={.2}/>
                      <stop offset="95%" stopColor="#9B8FB5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 6"/>
                  <XAxis dataKey="hour" tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <YAxis tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:'JetBrains Mono', color:'#9ca3af' }}/>
                  <Area type="monotone" dataKey="solar"       name="Solar"   stroke="#7BAE8A" strokeWidth={2} fill="url(#gSolar)"  dot={false}/>
                  <Area type="monotone" dataKey="consumption" name="Consumo" stroke="#9B8FB5" strokeWidth={2} fill="url(#gConsumo)" dot={false}/>
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === 'comunas' && (
            <>
              <p className="text-xs text-gray-400 font-mono mb-6">Generación vs. demanda por comuna (kW)</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={COMMUNE_DATA}>
                  <CartesianGrid strokeDasharray="3 6"/>
                  <XAxis dataKey="name" tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <YAxis tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:'JetBrains Mono', color:'#9ca3af' }}/>
                  <Bar dataKey="generation" name="Generación" fill="#7BAE8A" opacity={.9} radius={[4,4,0,0]}/>
                  <Bar dataKey="demand"     name="Demanda"    fill="#A8C5C2" opacity={.85} radius={[4,4,0,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
          {tab === 'balance' && (
            <>
              <p className="text-xs text-gray-400 font-mono mb-6">Balance energético neto — kW (positivo = excedente)</p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 6"/>
                  <XAxis dataKey="hour" tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <YAxis tick={{ fill:'#9ca3af', fontSize:9, fontFamily:'JetBrains Mono' }}/>
                  <Tooltip content={<CustomTooltip/>}/>
                  <Legend wrapperStyle={{ fontSize:11, fontFamily:'JetBrains Mono', color:'#9ca3af' }}/>
                  <Line type="monotone" dataKey="balance" name="Balance neto" stroke="#4A6741" strokeWidth={2.5} dot={false}/>
                  <Line type="monotone" dataKey="battery" name="Batería"      stroke="#9B8FB5" strokeWidth={1.5} dot={false} strokeDasharray="6 3"/>
                </LineChart>
              </ResponsiveContainer>
            </>
          )}
        </div>

        {/* Bottom KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {[
            { label:'Eficiencia media',   value:'91%',     icon:'📈', color:'#7BAE8A' },
            { label:'Factor de carga',    value:'0.74',    icon:'⚖️', color:'#A8C5C2' },
            { label:'Horas punta solar',  value:'5.8 HSP', icon:'☀️', color:'#C9A96E' },
            { label:'Reducción pico red', value:'38%',     icon:'🔽', color:'#9B8FB5' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-[rgba(123,174,138,.18)] text-center hover:shadow-card transition-all">
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="font-mono font-bold text-lg" style={{ color:s.color }}>{s.value}</div>
              <div className="text-xs text-gray-400 font-mono mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
