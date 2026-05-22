# ⚡ Gemelo Digital — Nodo La Torre
### ALTO MONTE ENERGY · Cerro Pan de Azúcar · Comuna 8 · Medellín

> Simulación física de una microred comunitaria solar + BESS en ladera urbana.
> Desplegable **gratis** en Streamlit Cloud en < 5 minutos.

---

## 🚀 Deploy en Streamlit Cloud (recomendado — 100% gratis)

### Paso 1 — Subir a GitHub
```bash
git init
git add .
git commit -m "feat: gemelo digital nodo la torre v0.1"
git remote add origin https://github.com/TU_USUARIO/nodo-la-torre-twin.git
git push -u origin main
```

### Paso 2 — Conectar Streamlit Cloud
1. Ir a **[share.streamlit.io](https://share.streamlit.io)** → Sign in with GitHub
2. Clic en **"New app"**
3. Seleccionar el repo `nodo-la-torre-twin`
4. Main file path: `app.py`
5. Clic **Deploy** → URL pública en ~60 segundos

**URL resultante:**
```
https://TU_USUARIO-nodo-la-torre-twin-app-XXXXXX.streamlit.app
```

---

## 💻 Desarrollo local

```bash
# Instalar dependencias
pip install -r requirements.txt

# Correr la app
streamlit run app.py
# → http://localhost:8501
```

---

## 📁 Estructura del proyecto

```
nodo-la-torre-twin/
├── app.py              ← Dashboard Streamlit principal (5 pestañas)
├── physics.py          ← Motor de simulación física
│   ├── solar_curve_hourly()      → Curva irradiancia horaria (IDEAM)
│   ├── load_profile_hourly()     → Perfil carga estrato 1-2 Medellín
│   ├── simulate_bess()           → Simulación ciclos LFP
│   ├── full_day_simulation()     → Día completo hora a hora
│   ├── annual_summary()          → Proyección 12 meses
│   └── sizing_recommendation()   → Dimensionamiento óptimo
├── requirements.txt    ← Dependencias Python
└── README.md
```

---

## 🧪 Qué simula el gemelo digital

| Módulo | Descripción |
|--------|-------------|
| ☀️ **Solar** | Curva de irradiancia horaria calibrada con datos IDEAM Medellín. Efecto temperatura de célula (NOCT). Variación estacional por nubosidad (temporadas lluviosas abr-may, sep-oct) |
| ⚡ **Carga** | Perfil típico estrato 1-2 ladera. Doble pico: mañana (6-8h) y noche (19-21h). Ruido estocástico ±3% |
| 🔋 **BESS LFP** | Ciclos carga/descarga con eficiencia RTE 94%. SOC mín/máx protegidos. Restricción de potencia |
| 📊 **Balance** | Excedente → batería → red. Curtailment cuando BESS lleno. Importación cuando BESS vacío |
| 📅 **Anual** | Proyección 12 meses (laboral + festivo). CO₂ evitado. Ahorro COP |
| 📐 **Sizing** | Dimensionamiento óptimo para N viviendas y autonomía deseada. Curvas de sensibilidad |

---

## 📊 Datos y referencias

| Parámetro | Valor | Fuente |
|-----------|-------|--------|
| Irradiación media Medellín | 4.7 kWh/m²/día | IDEAM Atlas Solar 2023 |
| Consumo típico estrato 1-2 | 155 kWh/mes | EPM 2024 |
| Factor CO₂ Colombia | 0.214 kgCO₂/kWh | XM 2023 |
| Tarifa referencia EPM | $820 COP/kWh | EPM E2 2024 |
| Temperatura ambiente | 20.5°C | IDEAM Medellín |
| Altitud Cerro Pan de Azúcar | 1,850 msnm | IGAC |

---

## 🔮 Próximas versiones

- [ ] **v0.2** — Integración datos reales (CSV facturas EPM)
- [ ] **v0.3** — Modelo térmico de batería
- [ ] **v0.4** — Predicción solar con ML (LSTM)
- [ ] **v1.0** — API REST + conexión IoT sensores en campo
- [ ] **v1.1** — Multi-nodo: comparar los 7 cerros simultáneamente

---

## ⚠️ Disclaimer

> Modelo educativo / pre-inversión v0.1-alpha.
> No substituye ingeniería de detalle, estudios RETIE ni certificación técnica.
> Para proyectos reales usar PVsyst + SAM (NREL) con datos medidos en campo.

---

**ALTO MONTE ENERGY · Medellín, Colombia 🇨🇴**
`hola@altomonte.energy`
