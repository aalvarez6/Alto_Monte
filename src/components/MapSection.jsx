import { useEffect, useRef } from 'react'
import { URBAN_NODES } from '../data/simulatedData'

const SCOLOR = { stable:'#7BAE8A', warning:'#C9A96E', critical:'#D4A5A5' }
const SLABEL = { stable:'ESTABLE', warning:'ADVERTENCIA', critical:'CRÍTICO' }

function popupHTML(n) {
  const c = SCOLOR[n.status]
  return `
    <div style="font-family:'DM Sans',sans-serif;min-width:230px;padding:4px">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <div style="width:8px;height:8px;border-radius:50%;background:${c};box-shadow:0 0 7px ${c}"></div>
        <span style="font-family:'JetBrains Mono',monospace;font-size:10px;color:${c};letter-spacing:.1em">${SLABEL[n.status]}</span>
        <span style="font-family:'JetBrains Mono',monospace;font-size:9px;color:#9ca3af;margin-left:auto">${n.id}</span>
      </div>
      <h3 style="font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:600;color:#2C2C2C;margin-bottom:3px">${n.name}</h3>
      <p style="font-size:11px;color:#9ca3af;margin-bottom:12px">📍 ${n.commune}</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">
        ${[['☀️ Solar',`${n.solar} kW`],['⚡ Consumo',`${n.consumption} kW`],['🔋 Batería',`${n.battery}%`],['🏠 Hogares',`${n.households}`],['📐 Capacidad',`${n.capacity} kW`],['🔆 Paneles',`${n.panels}`]].map(([k,v])=>`
          <div style="background:rgba(123,174,138,.08);border:1px solid rgba(123,174,138,.2);border-radius:8px;padding:7px">
            <div style="font-size:9px;color:#9ca3af;margin-bottom:2px">${k}</div>
            <div style="font-size:12px;font-weight:600;color:#2C2C2C;font-family:'JetBrains Mono',monospace">${v}</div>
          </div>`).join('')}
      </div>
      <div style="margin-top:10px;background:rgba(123,174,138,.08);border-radius:8px;padding:9px">
        <div style="font-size:9px;color:#9ca3af;margin-bottom:4px">Balance energético</div>
        <div style="height:3px;background:rgba(74,103,65,.1);border-radius:99px;overflow:hidden">
          <div style="height:100%;width:${Math.min((n.solar/n.consumption)*100,100)}%;background:linear-gradient(90deg,#7BAE8A,#A8C5C2);border-radius:99px"></div>
        </div>
        <div style="font-size:10px;color:${n.solar>n.consumption?'#4A6741':'#C9A96E'};margin-top:3px;font-family:'JetBrains Mono',monospace">
          ${n.solar>n.consumption?'+ Excedente':'- Déficit'}: ${Math.abs(n.solar-n.consumption)} kW
        </div>
      </div>
    </div>`
}

export default function MapSection() {
  const mapRef = useRef(null)
  const instance = useRef(null)

  useEffect(() => {
    if (instance.current || !window.L) return
    const L = window.L
    const map = L.map(mapRef.current, { center:[6.23,-75.593], zoom:12, zoomControl:true })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom:18 }).addTo(map)

    // Connection lines
    const coords = URBAN_NODES.map(n => [n.lat, n.lng])
    for (let i = 0; i < coords.length - 1; i++) {
      L.polyline([coords[i], coords[(i+1)%coords.length]], {
        color: 'rgba(123,174,138,.35)', weight:1.5, dashArray:'6 8'
      }).addTo(map)
    }

    URBAN_NODES.forEach(n => {
      const c = SCOLOR[n.status]
      const icon = L.divIcon({
        className:'',
        html:`<div style="position:relative;width:30px;height:30px">
          <div style="position:absolute;inset:0;border-radius:50%;background:${c}18;border:1px solid ${c}44;animation:breathe 5s ease-in-out infinite"></div>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:13px;height:13px;border-radius:50%;background:${c};box-shadow:0 0 10px ${c}99"></div>
        </div>`,
        iconSize:[30,30], iconAnchor:[15,15],
      })
      L.marker([n.lat, n.lng], { icon }).addTo(map)
        .bindPopup(popupHTML(n), { maxWidth:260 })
    })
    instance.current = map
  }, [])

  return (
    <section id="mapa" className="py-20 bg-niebla">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <span className="eyebrow block mb-3">mapa de nodos urbanos</span>
            <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C' }}>
              Red energética <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>Valle de Aburrá</em>
            </h2>
            <p className="text-gray-500 text-sm mt-2 max-w-lg">
              8 nodos distribuidos en Medellín y el área metropolitana. Clic en cada nodo para ver su estado operativo.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono">
            {Object.entries(SCOLOR).map(([k,c]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background:c, boxShadow:`0 0 6px ${c}` }}/>
                <span className="text-gray-400 uppercase tracking-wider">{SLABEL[k]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-card border border-[rgba(123,174,138,.2)]" style={{ height:480 }}>
          <div ref={mapRef} style={{ height:'100%', width:'100%' }}/>
        </div>

        {/* Node chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {URBAN_NODES.map(n => (
            <div key={n.id} className="bg-white rounded-xl p-3 border transition-all hover:shadow-card cursor-default"
                 style={{ borderColor:`${SCOLOR[n.status]}30` }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0"
                     style={{ background:SCOLOR[n.status], boxShadow:`0 0 5px ${SCOLOR[n.status]}` }}/>
                <span className="font-mono text-[.65rem] text-gray-400 truncate">{n.id}</span>
              </div>
              <p className="text-xs font-semibold text-carbon truncate mb-1">{n.name}</p>
              <div className="flex justify-between text-xs font-mono text-gray-400">
                <span>☀️ {n.solar}kW</span>
                <span>🔋 {n.battery}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
