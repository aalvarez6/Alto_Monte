import { useState, useEffect } from 'react'
import { Zap, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  const links = [
    { href: '#metricas', label: 'Métricas' },
    { href: '#mapa',     label: 'Mapa' },
    { href: '#dashboard',label: 'Dashboard' },
    { href: '#twin',     label: 'Digital Twin' },
    { href: '#roadmap',  label: 'Roadmap' },
  ]
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-[rgba(247,244,239,.93)] backdrop-blur-xl shadow-[0_2px_20px_rgba(74,103,65,.08)] border-b border-[rgba(123,174,138,.18)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg,#7BAE8A,#A8C5C2)' }}>
            <Zap size={15} color="white" />
          </div>
          <div className="leading-tight">
            <div className="font-mono font-semibold text-[.82rem] tracking-widest text-carbon">ALTO MONTE</div>
            <div className="font-mono text-[.55rem] tracking-[.16em] text-agua uppercase">Energy MED</div>
          </div>
        </a>
        <ul className="hidden md:flex items-center gap-7">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href} className="font-mono text-[.75rem] tracking-wider text-[#666] hover:text-musgo transition-colors no-underline">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <a href="#contacto" className="hidden md:block btn-primary text-xs py-2 px-5">Contactar →</a>
        <button className="md:hidden text-musgo" onClick={() => setOpen(!open)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-[rgba(247,244,239,.97)] backdrop-blur-xl border-t border-[rgba(123,174,138,.2)] px-6 py-6 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}
               className="font-mono text-sm text-musgo no-underline">{l.label}</a>
          ))}
          <a href="#contacto" onClick={() => setOpen(false)} className="btn-primary text-center text-xs">Contactar →</a>
        </div>
      )}
    </nav>
  )
}
