import { useEffect, useRef } from 'react'
import { ArrowRight, Cpu, Globe, Zap } from 'lucide-react'

/* Warm watercolor particles */
function Particles() {
  const pts = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    delay: Math.random() * 5,
    dur: Math.random() * 3 + 2.5,
    col: ['#7BAE8A','#A8C5C2','#9B8FB5','#C9A96E','#D4A5A5'][i % 5],
  }))
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map(p => (
        <div key={p.id} className="absolute rounded-full opacity-0"
             style={{
               left: `${p.x}%`, top: `${p.y}%`,
               width: p.size, height: p.size,
               background: p.col,
               animation: `particle ${p.dur}s ${p.delay}s ease-in-out infinite`,
             }} />
      ))}
    </div>
  )
}

/* Subtle grid overlay */
function GridOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{
      backgroundImage: `
        linear-gradient(rgba(123,174,138,.07) 1px, transparent 1px),
        linear-gradient(90deg, rgba(123,174,138,.07) 1px, transparent 1px)
      `,
      backgroundSize: '52px 52px',
    }}/>
  )
}

/* Orbit ring */
function OrbitRing({ size, color, speed }) {
  return (
    <div className="absolute rounded-full pointer-events-none"
         style={{
           width: size, height: size,
           border: `1px dashed ${color}`,
           opacity: .18,
           top: '50%', left: '50%',
           transform: 'translate(-50%,-50%)',
           animation: `breathe ${speed}s ease-in-out infinite`,
         }}/>
  )
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden"
             style={{ background: 'linear-gradient(160deg, #2C3E30 0%, #1e2d3a 55%, #2a1f35 100%)' }}>
      <GridOverlay />
      <Particles />

      {/* Ambient glows */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 80% 55% at 50% 0%, rgba(123,174,138,.18) 0%, transparent 70%)' }}/>
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 55% 45% at 80% 75%, rgba(155,143,181,.1) 0%, transparent 60%)' }}/>

      {/* Orbit rings */}
      <div className="absolute top-1/2 left-1/2" style={{ transform: 'translate(-50%,-50%)', width:0, height:0 }}>
        <div style={{ position:'absolute', transform:'translate(-50%,-50%)' }}>
          <OrbitRing size={320} color="#7BAE8A" speed={7} />
          <OrbitRing size={500} color="#A8C5C2" speed={10} />
          <OrbitRing size={680} color="#9B8FB5" speed={14} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-12 text-center">

        {/* Badge chip */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 anim-in"
             style={{ background: 'rgba(123,174,138,.15)', border: '1px solid rgba(123,174,138,.3)' }}>
          <div className="w-2 h-2 rounded-full anim-pulse" style={{ background: '#7BAE8A' }}/>
          <span className="font-mono text-[.7rem] tracking-widest text-[#A8C5C2] uppercase">
            Sistema Operativo Energético Urbano
          </span>
        </div>

        {/* Title — Cormorant Garamond */}
        <h1 className="anim-d1"
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(3rem, 8vw, 6.5rem)',
              fontWeight: 300,
              lineHeight: 1.06,
              color: '#E8D5B7',
              marginBottom: '24px',
            }}>
          Infraestructura energética<br />
          <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>distribuida</em> para<br />
          ciudades resilientes.
        </h1>

        <p className="anim-d2 text-[#A8C5C2] text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
           style={{ fontWeight: 300 }}>
          ALTO MONTE desarrolla nodos energéticos urbanos impulsados por inteligencia artificial,
          microredes y gemelos digitales para transformar comunidades en redes energéticas inteligentes.
        </p>

        {/* CTAs */}
        <div className="anim-d3 flex flex-wrap items-center justify-center gap-4 mb-16">
          <a href="#dashboard" className="btn-primary flex items-center gap-2">
            <Cpu size={15}/> Explorar simulación
          </a>
          <a href="#mapa" className="btn-ghost flex items-center gap-2">
            <Globe size={15}/> Ver nodos urbanos <ArrowRight size={13}/>
          </a>
        </div>

        {/* Live status bar */}
        <div className="anim-d4 max-w-3xl mx-auto rounded-2xl px-6 py-4 flex flex-wrap justify-around gap-4"
             style={{
               background: 'rgba(247,244,239,.07)',
               backdropFilter: 'blur(10px)',
               border: '1px solid rgba(123,174,138,.2)',
             }}>
          {[
            { icon: <Zap size={13} color="#7BAE8A"/>, value:'2,847 kWh', label:'Generados hoy' },
            { icon: <div className="w-2 h-2 rounded-full anim-pulse" style={{ background:'#7BAE8A' }}/>, value:'8 / 8', label:'Nodos en línea' },
            { icon: <Zap size={13} color="#A8C5C2"/>, value:'1.84 t', label:'CO₂ evitado' },
            { icon: <Zap size={13} color="#C9A96E"/>, value:'94%', label:'Eficiencia IA' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-left">
              {s.icon}
              <div>
                <div className="font-mono text-sm font-semibold text-[#E8D5B7]">{s.value}</div>
                <div className="font-mono text-xs text-[#7BAE8A80]">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <a href="#metricas"
         className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 no-underline"
         style={{ color: 'rgba(123,174,138,.5)' }}>
        <span className="font-mono text-[.6rem] tracking-widest">SCROLL</span>
        <div className="w-px h-12 bg-[#7BAE8A] scroll-line"/>
      </a>
    </section>
  )
}
