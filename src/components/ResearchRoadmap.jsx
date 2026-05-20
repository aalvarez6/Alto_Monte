import { RESEARCH_ITEMS, ROADMAP } from '../data/simulatedData'

export default function ResearchRoadmap() {
  return (
    <>
      {/* ── Research & Impact ─────────────────────── */}
      <section id="research" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow block mb-3">investigación & impacto</span>
          <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C', marginBottom:'48px' }}>
            Tecnología al servicio de la <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>transición energética</em>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {RESEARCH_ITEMS.map((r, i) => (
              <div key={i} className="bg-niebla rounded-2xl p-6 border border-[rgba(123,174,138,.15)] hover:shadow-lift hover:-translate-y-1 transition-all duration-300 flex flex-col">
                <div className="text-3xl mb-4">{r.icon}</div>
                <h3 className="font-semibold text-carbon mb-2 text-base">{r.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed flex-1 mb-5">{r.desc}</p>
                <div className="p-3 rounded-xl"
                     style={{ background:'rgba(123,174,138,.08)', border:'1px solid rgba(123,174,138,.18)' }}>
                  <div className="font-display font-semibold text-2xl"
                       style={{ fontFamily:'"Cormorant Garamond",serif', background:'linear-gradient(135deg,#7BAE8A,#A8C5C2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    {r.metric}
                  </div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{r.metricLabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CO2 progress bars */}
          <div className="bg-niebla rounded-2xl border border-[rgba(123,174,138,.18)] p-8 shadow-card">
            <div className="grid sm:grid-cols-3 gap-8 items-center">
              <div className="sm:col-span-2">
                <h3 className="font-semibold text-carbon mb-2">Reducción de CO₂ acumulada</h3>
                <p className="text-xs text-gray-400 mb-6">
                  Impacto medioambiental acumulado de todos los nodos. Equivale a plantar 84 árboles diariamente.
                </p>
                <div className="space-y-4">
                  {[
                    { label:'Nodos estables (6)',    pct:92, color:'#7BAE8A' },
                    { label:'Nodos advertencia (2)', pct:55, color:'#C9A96E' },
                    { label:'Meta 2026',             pct:38, color:'#9B8FB5' },
                  ].map((b, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs font-mono mb-1.5">
                        <span className="text-gray-400">{b.label}</span>
                        <span style={{ color:b.color }}>{b.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[rgba(123,174,138,.12)] overflow-hidden">
                        <div className="h-full rounded-full shimmer-bar" style={{ width:`${b.pct}%` }}/>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="font-display text-5xl mb-2"
                     style={{ fontFamily:'"Cormorant Garamond",serif', background:'linear-gradient(135deg,#4A6741,#7BAE8A,#A8C5C2)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                  1.84
                </div>
                <div className="text-gray-400 text-sm font-mono">toneladas CO₂/día</div>
                <div className="text-xs text-gray-300 mt-1 font-mono">≈ 672 ton/año</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roadmap ───────────────────────────────── */}
      <section id="roadmap" className="py-20 bg-niebla">
        <div className="max-w-7xl mx-auto px-6">
          <span className="eyebrow block mb-3">roadmap tecnológico</span>
          <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(1.9rem,4vw,2.9rem)', fontWeight:400, lineHeight:1.2, color:'#2C2C2C', marginBottom:'48px' }}>
            Hoja de ruta <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>2026 → 2030</em>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ROADMAP.map((stage, i) => {
              const colors = ['#7BAE8A','#A8C5C2','#9B8FB5','#C9A96E']
              const c = colors[i]
              return (
                <div key={stage.year}
                     className="bg-white rounded-2xl overflow-hidden border shadow-card hover:-translate-y-1 transition-all duration-300"
                     style={{ borderColor: stage.status === 'active' ? `${c}55` : 'rgba(123,174,138,.12)' }}>
                  <div className="p-5 border-b border-[rgba(123,174,138,.08)]"
                       style={{ background: stage.status === 'active' ? `${c}08` : 'transparent' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display text-3xl font-semibold"
                            style={{ fontFamily:'"Cormorant Garamond",serif', color:c }}>{stage.year}</span>
                      {stage.status === 'active' && (
                        <span className="flex items-center gap-1.5 text-[.65rem] font-mono px-2 py-1 rounded"
                              style={{ background:`${c}15`, color:c }}>
                          <div className="w-1.5 h-1.5 rounded-full anim-pulse" style={{ background:c }}/>
                          ACTIVO
                        </span>
                      )}
                      {stage.status === 'upcoming' && (
                        <span className="text-[.65rem] font-mono text-gray-400 px-2 py-1 border border-gray-200 rounded">
                          PRÓXIMO
                        </span>
                      )}
                      {stage.status === 'future' && (
                        <span className="text-[.65rem] font-mono text-gray-300 px-2 py-1 border border-gray-100 rounded">
                          FUTURO
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-2.5">
                    {stage.items.map((item, j) => (
                      <div key={j} className="flex items-start gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                             style={{ background: stage.status === 'active' ? c : '#D1C9BC',
                                      boxShadow: stage.status === 'active' ? `0 0 5px ${c}` : 'none' }}/>
                        <span className="text-xs text-gray-400 leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-1"
                       style={{ background: stage.status === 'active'
                         ? `linear-gradient(90deg, ${c}, transparent)` : 'transparent' }}/>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
