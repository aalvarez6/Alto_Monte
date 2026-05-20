// ── Simulated urban energy nodes (Medellín-inspired) ─────────────────────────
export const URBAN_NODES = [
  {
    id: 'N001', name: 'Nodo El Poblado', lat: 6.2086, lng: -75.5659,
    solar: 342, consumption: 280, battery: 88, status: 'stable',
    commune: 'El Poblado', capacity: 500, panels: 128, households: 240,
  },
  {
    id: 'N002', name: 'Nodo Laureles', lat: 6.2494, lng: -75.5934,
    solar: 198, consumption: 231, battery: 52, status: 'warning',
    commune: 'Laureles-Estadio', capacity: 300, panels: 80, households: 140,
  },
  {
    id: 'N003', name: 'Nodo Envigado Centro', lat: 6.1735, lng: -75.5920,
    solar: 415, consumption: 310, battery: 95, status: 'stable',
    commune: 'Envigado', capacity: 600, panels: 160, households: 320,
  },
  {
    id: 'N004', name: 'Nodo Belén', lat: 6.2310, lng: -75.6064,
    solar: 88, consumption: 210, battery: 18, status: 'critical',
    commune: 'Belén', capacity: 250, panels: 64, households: 95,
  },
  {
    id: 'N005', name: 'Nodo Robledo', lat: 6.2787, lng: -75.5890,
    solar: 276, consumption: 195, battery: 74, status: 'stable',
    commune: 'Robledo', capacity: 400, panels: 112, households: 180,
  },
  {
    id: 'N006', name: 'Nodo Aranjuez', lat: 6.2960, lng: -75.5640,
    solar: 145, consumption: 178, battery: 42, status: 'warning',
    commune: 'Aranjuez', capacity: 220, panels: 58, households: 110,
  },
  {
    id: 'N007', name: 'Nodo Itagüí', lat: 6.1849, lng: -75.5990,
    solar: 388, consumption: 290, battery: 82, status: 'stable',
    commune: 'Itagüí', capacity: 550, panels: 140, households: 270,
  },
  {
    id: 'N008', name: 'Nodo Sabaneta', lat: 6.1521, lng: -75.6157,
    solar: 312, consumption: 195, battery: 91, status: 'stable',
    commune: 'Sabaneta', capacity: 450, panels: 110, households: 205,
  },
]

// ── 24-hour timeseries ────────────────────────────────────────────────────────
export function generate24h() {
  return Array.from({ length: 24 }, (_, h) => {
    const solarPeak  = h >= 6 && h <= 18 ? Math.sin((h - 6) / 12 * Math.PI) : 0
    const solar      = Math.round(solarPeak * 380 + Math.random() * 30)
    const consumption= Math.round(160 + Math.sin(h / 24 * Math.PI * 2) * 80 + Math.random() * 40)
    return {
      hour:        `${String(h).padStart(2, '0')}:00`,
      solar,
      consumption,
      battery:     Math.max(0, Math.round(solar - consumption + Math.random() * 20)),
      balance:     solar - consumption,
    }
  })
}

// ── Commune demand breakdown ──────────────────────────────────────────────────
export const COMMUNE_DATA = [
  { name: 'El Poblado',  demand: 280, generation: 342, efficiency: 94 },
  { name: 'Laureles',   demand: 231, generation: 198, efficiency: 71 },
  { name: 'Envigado',   demand: 310, generation: 415, efficiency: 98 },
  { name: 'Belén',      demand: 210, generation: 88,  efficiency: 32 },
  { name: 'Robledo',    demand: 195, generation: 276, efficiency: 88 },
  { name: 'Sabaneta',   demand: 195, generation: 312, efficiency: 96 },
]

// ── Real-time metrics baseline ────────────────────────────────────────────────
export const BASE_METRICS = {
  energyToday:    2847,    // kWh
  co2Avoided:     1.84,    // tons
  activeNodes:    8,
  totalCapacity:  3270,    // kW
  autonomy:       6.4,     // hours
  communitySavings: 4820000, // COP
}

// ── Research pillars ──────────────────────────────────────────────────────────
export const RESEARCH_ITEMS = [
  {
    icon: '🧠',
    title: 'IA Energética',
    desc: 'Modelos de ML predicen la demanda y generación solar con hasta 94% de precisión, optimizando el despacho en tiempo real.',
    metric: '94%', metricLabel: 'Precisión predictiva',
  },
  {
    icon: '🏙️',
    title: 'Resiliencia Urbana',
    desc: 'Arquitectura de microrredes con operación en isla garantiza suministro continuo durante eventos de falla en la red principal.',
    metric: '6.4h', metricLabel: 'Autonomía media',
  },
  {
    icon: '🔮',
    title: 'Gemelos Digitales',
    desc: 'Réplica digital de cada nodo energético permite simular escenarios, detectar anomalías y optimizar el despacho antes de actuar.',
    metric: '1:1', metricLabel: 'Fidelidad del modelo',
  },
  {
    icon: '🌍',
    title: 'Impacto Climático',
    desc: 'Cada nodo evita en promedio 1.84 toneladas de CO₂ al día — equivalente a plantar 84 árboles diariamente.',
    metric: '1.84t', metricLabel: 'CO₂ evitado/día',
  },
]

// ── Roadmap ───────────────────────────────────────────────────────────────────
export const ROADMAP = [
  {
    year: '2026', status: 'active',
    items: ['MVP Plataforma web', 'Nodo piloto Envigado', 'Dashboard monitoreo', 'Integración IoT básica'],
  },
  {
    year: '2027', status: 'upcoming',
    items: ['Microred comunitaria piloto', 'Gemelo digital v1', 'Integración BESS', '5 nodos operativos'],
  },
  {
    year: '2028', status: 'future',
    items: ['Gemelo digital urbano', 'IA predictiva avanzada', 'API pública v1', '20 nodos en 4 comunas'],
  },
  {
    year: '2030', status: 'future',
    items: ['Red energética distribuida', 'Interoperabilidad entre ciudades', '100+ nodos', 'Exportación modelo LATAM'],
  },
]
