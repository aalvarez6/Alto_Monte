"""
physics.py
Núcleo de simulación del Gemelo Digital — Nodo La Torre
Basado en datos IDEAM Medellín + perfiles típicos Colombia estrato 1-2

Referencias:
  - IDEAM Atlas de Radiación Solar Colombia (2014)
  - UPME / IPSE: Perfiles de carga residencial rural/urbana-ladera
  - IEA PVPS Task 1 report (módulos policristalinos)
  - Temperatura Cerro Pan de Azúcar: ~19-21°C promedio
"""

import numpy as np
import pandas as pd

# ── Constantes del nodo ───────────────────────────────────────────────────────
LAT         = 6.231      # °N  — Cerro Pan de Azúcar
LON         = -75.551    # °W
ALTITUDE    = 1850       # msnm
TEMP_AMB    = 20.5       # °C promedio anual
HOUSEHOLDS  = 380        # viviendas en la microred
CONSUMPTION_MONTHLY_KWH = 155  # kWh/mes típico estrato 1-2 Medellín (CHEC/EPM 2023)

# IDEAM: irradiación global horizontal media diaria Medellín ~4.5–4.9 kWh/m²/día
# Cerros tienen ligera ventaja de elevación → usamos 4.7
GHI_DAILY_MEAN  = 4.7    # kWh/m²/día — Medellín cerros
GHI_PEAK        = 850    # W/m² — irradiancia pico típica al mediodía solar

# ── Parámetros del sistema FV ─────────────────────────────────────────────────
PANEL_WP        = 545    # W pico — módulo monocristalino moderno (Canadian/Longi 2024)
PANEL_EFF       = 0.21   # eficiencia STC
PANEL_TEMPCO    = -0.35  # %/°C coeficiente de temperatura Pmax
INVERTER_EFF    = 0.975  # eficiencia inversor string
PR_BASE         = 0.80   # Performance Ratio base (sombreado, cableado, suciedad)

# ── Parámetros BESS ───────────────────────────────────────────────────────────
BESS_CAPACITY_KWH  = 200.0   # kWh — batería LFP comunitaria
BESS_POWER_KW      = 80.0    # kW — potencia carga/descarga
BESS_EFF_RTE       = 0.94    # Round-trip efficiency LFP
BESS_SOC_MIN       = 0.10    # 10 % mínimo (protección celulas)
BESS_SOC_MAX       = 0.95    # 95 % máximo
BESS_SOC_INIT      = 0.60    # 60 % estado inicial


# ─────────────────────────────────────────────────────────────────────────────
# MODELOS
# ─────────────────────────────────────────────────────────────────────────────

def solar_curve_hourly(panels: int, month: int = 6) -> np.ndarray:
    """
    Curva de irradiancia horaria (0-23h) para Medellín.
    Modelo simplificado: campana gaussiana centrada en hora solar local.
    month: 1-12 — afecta levemente el ancho y pico (estacionalidad mínima en trópico).
    """
    hours = np.arange(24)
    # En Medellín, hora solar pico ~12:30 UTC-5 → hora local 12.5
    solar_noon = 12.3 + 0.2 * np.sin((month - 6) / 12 * 2 * np.pi)
    # Ancho de la campana — varía ligeramente con mes (nubes de temporada)
    # Temporada lluviosa: abr-may, sep-oct → más nubosidad
    rainy = month in [4, 5, 9, 10]
    sigma = 2.5 if not rainy else 2.1
    peak_ghi = GHI_PEAK * (0.88 if rainy else 1.0)

    ghi = peak_ghi * np.exp(-0.5 * ((hours - solar_noon) / sigma) ** 2)
    ghi = np.where((hours < 5) | (hours > 20), 0, ghi)  # no hay sol de noche

    # Temperatura de célula: Tcell = Tamb + GHI/800 * (NOCT-20)
    NOCT = 44  # Normal Operating Cell Temperature típico
    t_cell = TEMP_AMB + (ghi / 800) * (NOCT - 20)

    # Degradación por temperatura
    temp_factor = 1 + (PANEL_TEMPCO / 100) * (t_cell - 25)
    temp_factor = np.clip(temp_factor, 0.75, 1.02)

    # Potencia FV del nodo
    p_stc_kw  = (panels * PANEL_WP) / 1000  # kWp instalados
    p_solar   = (ghi / 1000) * p_stc_kw * temp_factor * INVERTER_EFF * PR_BASE

    return np.round(np.clip(p_solar, 0, None), 2)


def load_profile_hourly(households: int = HOUSEHOLDS, day_type: str = "laboral") -> np.ndarray:
    """
    Perfil de carga residencial ladera Medellín — estrato 1-2.
    Basado en datos UPME / mediciones ICONTEC NSR-10 tipo ZNI/periurbana.
    Dos picos: mañana (5:30-7:30) y noche (18:30-21:30).
    day_type: 'laboral' | 'festivo'
    """
    hours = np.arange(24)

    # Consumo medio por vivienda por hora (kWh/h)
    c_month = CONSUMPTION_MONTHLY_KWH
    c_day   = c_month / 30.4
    c_mean  = c_day / 24  # kW promedio (perfectamente plano sería esto)

    if day_type == "laboral":
        # Perfil normalizado (suma = 24 → media = 1)
        base  = np.array([
            0.55, 0.50, 0.48, 0.47, 0.50, 0.70,   # 0-5
            1.20, 1.45, 1.30, 1.10, 0.95, 0.90,   # 6-11
            0.85, 0.80, 0.82, 0.88, 1.05, 1.40,   # 12-17
            1.80, 1.90, 1.70, 1.40, 1.10, 0.75,   # 18-23
        ])
    else:  # festivo — sin pico mañana, más uniforme mediodía, pico noche
        base = np.array([
            0.60, 0.55, 0.50, 0.48, 0.50, 0.55,
            0.70, 0.85, 1.00, 1.05, 1.10, 1.15,
            1.15, 1.10, 1.05, 1.05, 1.20, 1.45,
            1.75, 1.85, 1.65, 1.35, 1.00, 0.75,
        ])

    # Normalizar para que la media sea c_mean
    base_normalized = base / base.mean()
    per_household   = c_mean * base_normalized  # kW por vivienda

    load_total = per_household * households  # kW total del nodo

    # Añadir pequeño ruido estocástico (±3 %)
    np.random.seed(42)
    noise = 1 + np.random.normal(0, 0.03, 24)
    return np.round(load_total * noise, 2)


def simulate_bess(solar_kw: np.ndarray, load_kw: np.ndarray,
                  soc_init: float = BESS_SOC_INIT) -> dict:
    """
    Simulación horaria del BESS (LFP comunitario).
    Retorna arrays de SOC, carga/descarga, balance, red.
    """
    n = len(solar_kw)
    soc        = np.zeros(n + 1)
    p_charge   = np.zeros(n)   # kW cargando (+ = cargando)
    p_discharge= np.zeros(n)   # kW descargando
    p_grid     = np.zeros(n)   # kW de/hacia red pública (+ = importar, - = exportar)
    p_curtail  = np.zeros(n)   # kW curtailed (excedente no aprovechable)

    soc[0] = soc_init
    cap    = BESS_CAPACITY_KWH

    for t in range(n):
        balance = solar_kw[t] - load_kw[t]   # kW neto

        if balance >= 0:
            # Excedente solar → cargar batería
            p_chg = min(balance, BESS_POWER_KW)
            delta_soc = (p_chg * BESS_EFF_RTE) / cap
            new_soc   = min(soc[t] + delta_soc, BESS_SOC_MAX)
            actual_p  = (new_soc - soc[t]) * cap / BESS_EFF_RTE
            p_charge[t]  = round(actual_p, 2)
            p_curtail[t] = round(max(balance - actual_p, 0), 2)
            soc[t + 1]   = new_soc
        else:
            # Déficit → descargar batería
            deficit   = -balance
            p_dis     = min(deficit, BESS_POWER_KW)
            delta_soc = p_dis / (cap * BESS_EFF_RTE)
            new_soc   = max(soc[t] - delta_soc, BESS_SOC_MIN)
            actual_p  = (soc[t] - new_soc) * cap * BESS_EFF_RTE
            p_discharge[t] = round(actual_p, 2)
            residual       = deficit - actual_p
            p_grid[t]      = round(max(residual, 0), 2)   # importar de red
            soc[t + 1]     = new_soc

    return {
        "soc":         soc[1:],      # SOC al final de cada hora
        "p_charge":    p_charge,
        "p_discharge": p_discharge,
        "p_grid":      p_grid,
        "p_curtail":   p_curtail,
    }


def full_day_simulation(panels: int, households: int,
                         month: int = 6, day_type: str = "laboral",
                         soc_init: float = BESS_SOC_INIT) -> pd.DataFrame:
    """
    Simulación completa de un día. Retorna DataFrame horario.
    """
    solar = solar_curve_hourly(panels, month)
    load  = load_profile_hourly(households, day_type)
    bess  = simulate_bess(solar, load, soc_init)

    hours = [f"{h:02d}:00" for h in range(24)]
    df = pd.DataFrame({
        "hora":          hours,
        "solar_kw":      solar,
        "load_kw":       load,
        "balance_kw":    solar - load,
        "soc_pct":       np.round(bess["soc"] * 100, 1),
        "bess_charge":   bess["p_charge"],
        "bess_discharge":bess["p_discharge"],
        "grid_import":   bess["p_grid"],
        "curtail":       bess["p_curtail"],
    })
    return df


def annual_summary(panels: int, households: int, n_panels_per_kwp: int = 2) -> dict:
    """
    Resumen anual: producción, CO2, ahorro económico.
    Simula 12 meses (días laborales y festivos).
    """
    months_days   = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    work_fraction = 0.72   # 72 % días laborales en Colombia

    total_solar_kwh    = 0
    total_load_kwh     = 0
    total_grid_kwh     = 0
    total_curtail_kwh  = 0

    for m in range(1, 13):
        days = months_days[m - 1]
        for dtype, frac in [("laboral", work_fraction), ("festivo", 1 - work_fraction)]:
            df = full_day_simulation(panels, households, month=m, day_type=dtype)
            days_this = days * frac
            total_solar_kwh   += df["solar_kw"].sum() * days_this
            total_load_kwh    += df["load_kw"].sum() * days_this
            total_grid_kwh    += df["grid_import"].sum() * days_this
            total_curtail_kwh += df["curtail"].sum() * days_this

    solar_fraction = 1 - total_grid_kwh / max(total_load_kwh, 1)

    # CO2: factor emisión Colombia (XM 2023) 0.214 kgCO2/kWh
    co2_evitado_ton = total_solar_kwh * 0.214 / 1000

    # Tarifa EPM estrato 2 promedio 2024: ~$820 COP/kWh
    tarifa_cop = 820
    ahorro_cop = (total_load_kwh - total_grid_kwh) * tarifa_cop

    # Capacidad instalada
    kwp = (panels * PANEL_WP) / 1000

    return {
        "kwp_instalados":    round(kwp, 1),
        "solar_anual_kwh":   round(total_solar_kwh),
        "carga_anual_kwh":   round(total_load_kwh),
        "grid_anual_kwh":    round(total_grid_kwh),
        "curtail_kwh":       round(total_curtail_kwh),
        "solar_fraction_pct":round(solar_fraction * 100, 1),
        "co2_ton_yr":        round(co2_evitado_ton, 1),
        "ahorro_cop_yr":     round(ahorro_cop),
        "households":        households,
    }


def sizing_recommendation(households: int, autonomy_h: float = 6.0) -> dict:
    """
    Dimensionamiento inicial recomendado dado número de viviendas y autonomía deseada.
    """
    # Demanda pico estimada
    peak_load_kw = load_profile_hourly(households).max()
    # Energía necesaria para autonomía en horas de máxima demanda
    bess_kwh_needed = peak_load_kw * autonomy_h / BESS_EFF_RTE / (BESS_SOC_MAX - BESS_SOC_MIN)

    # Paneles: cubrir 100 % de la carga diaria más 20 % buffer
    daily_load = CONSUMPTION_MONTHLY_KWH / 30.4 * households
    panels_needed = int(np.ceil(daily_load * 1.20 / (GHI_DAILY_MEAN * PANEL_WP / 1000 * PR_BASE * INVERTER_EFF)))

    return {
        "peak_load_kw":    round(peak_load_kw, 1),
        "panels_rec":      panels_needed,
        "kwp_rec":         round(panels_needed * PANEL_WP / 1000, 1),
        "bess_kwh_rec":    round(bess_kwh_needed, 1),
        "bess_power_rec":  round(peak_load_kw * 0.75, 1),
        "autonomy_h":      autonomy_h,
    }
