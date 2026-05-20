import { Zap, Mail, MapPin, Github, Linkedin, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <>
      {/* ── Contact CTA ───────────────────────────── */}
      <section id="contacto" className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="eyebrow justify-center block mb-4">contacto</span>
          <h2 style={{ fontFamily:'"Cormorant Garamond",serif', fontSize:'clamp(2.2rem,5vw,4rem)', fontWeight:300, lineHeight:1.1, color:'#2C2C2C', marginBottom:'16px' }}>
            Construyamos la<br/>
            <em style={{ fontStyle:'italic', color:'#7BAE8A' }}>ciudad energética del futuro</em>
          </h2>
          <p className="text-gray-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            ¿Representas una ciudad, fondo de inversión o comunidad? Estamos buscando co-creadores para los primeros nodos piloto en Medellín.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a href="mailto:hola@altomonte.energy" className="btn-primary">
              <Mail size={15}/> hola@altomonte.energy
            </a>
            <a href="#mapa" className="btn-outline">
              <MapPin size={15}/> Ver nodos activos
            </a>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 max-w-xl mx-auto">
            {[
              { icon:<MapPin size={17} color="#7BAE8A"/>, label:'Ubicación', value:'Medellín, Colombia' },
              { icon:<Mail size={17} color="#A8C5C2"/>,   label:'Email',     value:'hola@altomonte.energy' },
              { icon:<Zap size={17} color="#C9A96E"/>,    label:'Estado',    value:'Buscando pilotos' },
            ].map((c, i) => (
              <div key={i} className="bg-niebla rounded-xl p-4 border border-[rgba(123,174,138,.18)] text-center">
                <div className="flex justify-center mb-2">{c.icon}</div>
                <div className="text-xs text-gray-400 font-mono mb-1">{c.label}</div>
                <div className="text-sm font-semibold text-carbon">{c.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────── */}
      <footer style={{ background:'#2C3E30' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                     style={{ background:'linear-gradient(135deg,#7BAE8A,#A8C5C2)' }}>
                  <Zap size={15} color="white"/>
                </div>
                <div className="leading-tight">
                  <div className="font-mono font-semibold text-[.82rem] tracking-widest text-[#E8D5B7]">ALTO MONTE</div>
                  <div className="font-mono text-[.55rem] tracking-[.16em] text-[#7BAE8A] uppercase">Energy MED</div>
                </div>
              </div>
              <p className="text-xs text-[rgba(232,213,183,.55)] max-w-xs leading-relaxed mb-3">
                <strong className="text-[rgba(232,213,183,.8)]">Misión:</strong> Democratizar el acceso a energía limpia y distribuida para comunidades urbanas en América Latina.
              </p>
              <p className="text-xs text-[rgba(232,213,183,.55)] max-w-xs leading-relaxed">
                <strong className="text-[rgba(232,213,183,.8)]">Visión:</strong> Ser la plataforma líder de infraestructura energética distribuida inteligente en LATAM para 2030.
              </p>
            </div>
            {/* Links col 1 */}
            <div>
              <h4 className="font-mono text-[.7rem] text-[rgba(232,213,183,.5)] uppercase tracking-widest mb-4">Plataforma</h4>
              <ul className="flex flex-col gap-2.5">
                {['Métricas en vivo','Mapa de nodos','Dashboard','Digital Twin','Roadmap'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-[rgba(232,213,183,.55)] hover:text-[#7BAE8A] transition-colors no-underline font-mono">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Links col 2 */}
            <div>
              <h4 className="font-mono text-[.7rem] text-[rgba(232,213,183,.5)] uppercase tracking-widest mb-4">Tecnología</h4>
              <ul className="flex flex-col gap-2.5">
                {['IA Energética','Gemelos Digitales','Microrredes','BESS','IoT Energético'].map(l => (
                  <li key={l}>
                    <a href="#" className="text-xs text-[rgba(232,213,183,.55)] hover:text-[#7BAE8A] transition-colors no-underline font-mono">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* Bottom bar */}
          <div className="border-t border-[rgba(123,174,138,.15)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[rgba(232,213,183,.3)] font-mono">
              © 2025 ALTO MONTE ENERGY MED · Medellín, Colombia 🇨🇴
            </span>
            <div className="flex items-center gap-4">
              {[[<Github size={15}/>, '#'], [<Linkedin size={15}/>, '#'], [<Twitter size={15}/>, '#']].map(([icon, href], i) => (
                <a key={i} href={href} className="text-[rgba(232,213,183,.3)] hover:text-[#7BAE8A] transition-colors">{icon}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
