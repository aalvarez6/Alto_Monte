"""
Gemelo Digital — Nodo La Torre
Cerro Pan de Azúcar · Comuna 8 · Medellín
ALTO MONTE ENERGY

Deploy gratuito: streamlit.io/cloud
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots

from physics import (
    full_day_simulation, annual_summary, sizing_recommendation,
    solar_curve_hourly, load_profile_hourly, simulate_bess,
    BESS_CAPACITY_KWH, BESS_POWER_KW, PANEL_WP,
    HOUSEHOLDS, BESS_SOC_INIT
)

# ── Paleta de colores ALTO MONTE ──────────────────────────────────────────────
C = {
    "bosque":   "#0B3D2E",
    "energia":  "#2ECC71",
    "teal":     "#1ABC9C",
    "petroleo": "#1F3A5F",
    "solar":    "#F4D03F",
    "agua":     "#7BAE8A",
    "lavanda":  "#9B8FB5",
    "arena":    "#E8D5B7",
    "niebla":   "#F7F4EF",
    "carbon":   "#2C2C2C",
    "rosa":     "#D4A5A5",
    "oro":      "#C9A96E",
}

MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"]
MONTH_NUMS = list(range(1, 13))

# ── Config página ─────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="Gemelo Digital · Nodo La Torre",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── CSS global ────────────────────────────────────────────────────────────────
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

html, body, [class*="css"] { font-family: 'Poppins', sans-serif; }

/* Background */
.stApp { background: #F7F4EF; }
[data-testid="stSidebar"] { background: #0B3D2E !important; }
[data-testid="stSidebar"] * { color: #E8D5B7 !important; }
[data-testid="stSidebar"] .stSelectbox label,
[data-testid="stSidebar"] .stSlider label { color: #A8C5C2 !important; }
[data-testid="stSidebar"] hr { border-color: rgba(168,197,194,.25) !important; }

/* Metric cards */
[data-testid="metric-container"] {
    background: white;
    border: 1px solid rgba(74,103,65,.15);
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(11,61,46,.07);
}
[data-testid="metric-container"] [data-testid="stMetricValue"] {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 1.6rem !important;
    color: #0B3D2E !important;
    font-weight: 600 !important;
}
[data-testid="metric-container"] [data-testid="stMetricLabel"] {
    color: #9ca3af !important;
    font-size: .75rem !important;
    font-family: 'JetBrains Mono', monospace !important;
    letter-spacing: .06em !important;
    text-transform: uppercase !important;
}
[data-testid="metric-container"] [data-testid="stMetricDelta"] {
    font-family: 'JetBrains Mono', monospace !important;
}

/* Section titles */
.section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2rem;
    font-weight: 400;
    color: #0B3D2E;
    margin-bottom: 4px;
}
.section-sub {
    font-size: .82rem;
    color: #9ca3af;
    margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: .05em;
}
.eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: .65rem;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #2ECC71;
    margin-bottom: 4px;
}

/* Info box */
.info-box {
    background: rgba(46,204,113,.07);
    border: 1px solid rgba(46,204,113,.25);
    border-left: 3px solid #2ECC71;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: .83rem;
    color: #0B3D2E;
    margin: 12px 0;
    font-family: 'Poppins', sans-serif;
}
.warn-box {
    background: rgba(244,208,63,.07);
    border: 1px solid rgba(244,208,63,.3);
    border-left: 3px solid #F4D03F;
    border-radius: 10px;
    padding: 14px 18px;
    font-size: .83rem;
    color: #5a4a00;
    margin: 12px 0;
}
.data-badge {
    display:inline-block;
    background:rgba(11,61,46,.08);
    border:1px solid rgba(11,61,46,.15);
    border-radius:99px;
    padding:3px 10px;
    font-family:'JetBrains Mono',monospace;
    font-size:.7rem;
    color:#0B3D2E;
    margin:2px;
}

/* Hide Streamlit branding */
#MainMenu, footer { visibility: hidden; }
</style>
""", unsafe_allow_html=True)


# ═══════════════════════════════════════════════════════════════════════════════
# SIDEBAR — controles del gemelo digital
# ═══════════════════════════════════════════════════════════════════════════════
with st.sidebar:
    st.markdown("""
    <div style='text-align:center;padding:16px 0 8px'>
        <div style='font-family:"Poppins",sans-serif;font-weight:700;font-size:1.1rem;
                    letter-spacing:.08em;color:#E8D5B7'>ALTO MONTE</div>
        <div style='font-family:"JetBrains Mono",monospace;font-size:.6rem;
                    letter-spacing:.18em;color:#2ECC71;margin-top:2px'>ENERGY · GEMELO DIGITAL</div>
    </div>
    <hr/>
    """, unsafe_allow_html=True)

    st.markdown("**⛰️ Nodo La Torre**")
    st.markdown("""<div style='font-size:.75rem;color:#A8C5C2;margin-bottom:16px'>
        Cerro Pan de Azúcar · C8 · Medellín<br>
        <span style='font-family:"JetBrains Mono",monospace;font-size:.65rem'>6.231°N · 75.551°O · 1850 msnm</span>
    </div>""", unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("##### 🔧 Parámetros del sistema")

    n_panels = st.slider(
        "Paneles solares (545 Wp c/u)",
        min_value=50, max_value=600, value=180, step=10,
        help="Total de módulos fotovoltaicos instalados en el nodo"
    )
    kwp = round(n_panels * PANEL_WP / 1000, 1)
    st.caption(f"→ **{kwp} kWp** instalados")

    n_households = st.slider(
        "Viviendas en la microred",
        min_value=20, max_value=500, value=80, step=10,
        help="Hogares estrato 1-2 conectados al nodo"
    )

    bess_cap = st.slider(
        "Capacidad BESS (kWh)",
        min_value=25, max_value=400, value=120, step=25,
        help="Batería LFP comunitaria de almacenamiento"
    )

    st.markdown("---")
    st.markdown("##### 📅 Escenario de simulación")

    month_sel = st.selectbox(
        "Mes",
        options=list(range(1, 13)),
        format_func=lambda x: MONTHS[x - 1],
        index=5,
        help="Mes del año — afecta nubosidad y curva solar"
    )

    day_type = st.radio(
        "Tipo de día",
        ["laboral", "festivo"],
        format_func=lambda x: "📅 Laboral" if x == "laboral" else "🎉 Festivo"
    )

    soc_init = st.slider(
        "SOC inicial BESS (%)",
        min_value=10, max_value=95, value=60, step=5,
        help="Estado de carga inicial de la batería al inicio del día"
    ) / 100

    st.markdown("---")
    st.caption("Datos IDEAM · UPME · EPM 2023-24")
    st.caption("Modelo: PVLib simplificado + BESS LFP")


# ═══════════════════════════════════════════════════════════════════════════════
# TABS PRINCIPALES
# ═══════════════════════════════════════════════════════════════════════════════
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "⚡ Simulación diaria",
    "📊 Resumen anual",
    "🔋 Estado BESS",
    "📐 Dimensionamiento",
    "ℹ️ Ficha técnica",
])


# ─────────────────────────────────────────────────────────────────────────────
# TAB 1 — SIMULACIÓN DIARIA
# ─────────────────────────────────────────────────────────────────────────────
with tab1:
    df = full_day_simulation(n_panels, n_households, month_sel, day_type, soc_init)

    st.markdown(f"""
    <div class='eyebrow'>simulación horaria · {MONTHS[month_sel-1]} · día {day_type}</div>
    <div class='section-title'>Nodo La Torre — Balance energético</div>
    <div class='section-sub'>Cerro Pan de Azúcar · {n_panels} paneles · {n_households} viviendas · BESS {bess_cap} kWh</div>
    """, unsafe_allow_html=True)

    # ── KPIs del día ─────────────────────────────────────────────────────────
    total_solar   = df["solar_kw"].sum()
    total_load    = df["load_kw"].sum()
    total_grid    = df["grid_import"].sum()
    total_curtail = df["curtail"].sum()
    solar_frac    = (1 - total_grid / max(total_load, 1)) * 100
    soc_final     = df["soc_pct"].iloc[-1]
    peak_solar    = df["solar_kw"].max()
    peak_load     = df["load_kw"].max()
    co2_day       = total_solar * 0.214

    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("☀️ Generación solar", f"{total_solar:.0f} kWh", f"Pico {peak_solar:.0f} kW")
    col2.metric("⚡ Carga total", f"{total_load:.0f} kWh", f"Pico {peak_load:.0f} kW")
    col3.metric("🌿 Cobertura solar", f"{solar_frac:.1f}%",
                "✅ Autónomo" if solar_frac >= 85 else "⚠️ Apoyo red")
    col4.metric("🔋 SOC final", f"{soc_final:.0f}%",
                f"{'▲' if soc_final > soc_init * 100 else '▼'} {soc_final - soc_init*100:+.0f}%")
    col5.metric("🔌 Importado red", f"{total_grid:.1f} kWh",
                "Bajo" if total_grid < 20 else "Medio" if total_grid < 80 else "Alto")
    col6.metric("🌍 CO₂ evitado", f"{co2_day:.1f} kg", f"{co2_day*365/1000:.1f} t/año")

    st.markdown("")

    # ── Gráfica principal: solar + carga ─────────────────────────────────────
    fig1 = go.Figure()

    # Área solar
    fig1.add_trace(go.Scatter(
        x=df["hora"], y=df["solar_kw"],
        name="☀️ Generación solar (kW)",
        fill="tozeroy",
        line=dict(color=C["energia"], width=2.5),
        fillcolor="rgba(46,204,113,.12)",
    ))

    # Área carga
    fig1.add_trace(go.Scatter(
        x=df["hora"], y=df["load_kw"],
        name="⚡ Demanda comunidad (kW)",
        line=dict(color=C["petroleo"], width=2, dash="dot"),
        fillcolor="rgba(31,58,95,.06)",
        fill="tozeroy",
    ))

    # Excedente / déficit como barras pequeñas
    balance = df["balance_kw"]
    fig1.add_trace(go.Bar(
        x=df["hora"], y=balance.where(balance >= 0),
        name="+ Excedente",
        marker_color="rgba(46,204,113,.35)",
        marker_line_width=0,
    ))
    fig1.add_trace(go.Bar(
        x=df["hora"], y=balance.where(balance < 0),
        name="- Déficit",
        marker_color="rgba(212,165,165,.45)",
        marker_line_width=0,
    ))

    fig1.update_layout(
        title=dict(text="Generación vs Demanda · 24 horas", font=dict(family="Cormorant Garamond", size=18, color=C["bosque"])),
        plot_bgcolor="white", paper_bgcolor="white",
        font=dict(family="JetBrains Mono", size=11, color=C["carbon"]),
        legend=dict(orientation="h", y=-0.15, font=dict(size=10)),
        margin=dict(l=40, r=20, t=50, b=60),
        xaxis=dict(gridcolor="rgba(74,103,65,.08)", title="Hora del día"),
        yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kW"),
        barmode="overlay",
        height=380,
    )
    st.plotly_chart(fig1, use_container_width=True)

    # ── BESS + Grid ───────────────────────────────────────────────────────────
    col_a, col_b = st.columns([3, 2])

    with col_a:
        fig2 = make_subplots(specs=[[{"secondary_y": True}]])

        fig2.add_trace(go.Scatter(
            x=df["hora"], y=df["soc_pct"],
            name="SOC Batería (%)",
            line=dict(color=C["teal"], width=2.5),
            fill="tozeroy", fillcolor="rgba(26,188,156,.08)",
        ), secondary_y=True)

        fig2.add_trace(go.Bar(
            x=df["hora"], y=df["bess_charge"],
            name="↑ Cargando BESS",
            marker_color="rgba(46,204,113,.5)",
        ), secondary_y=False)

        fig2.add_trace(go.Bar(
            x=df["hora"], y=-df["bess_discharge"],
            name="↓ Descargando BESS",
            marker_color="rgba(244,208,63,.6)",
        ), secondary_y=False)

        fig2.update_layout(
            title=dict(text="Estado de la Batería (BESS)", font=dict(family="Cormorant Garamond", size=16, color=C["bosque"])),
            plot_bgcolor="white", paper_bgcolor="white",
            font=dict(family="JetBrains Mono", size=10),
            legend=dict(orientation="h", y=-0.2, font=dict(size=9)),
            margin=dict(l=40, r=40, t=50, b=70),
            barmode="relative",
            height=300,
            xaxis=dict(gridcolor="rgba(74,103,65,.08)"),
            yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kW carga/desc"),
            yaxis2=dict(title="SOC (%)", range=[0, 100], showgrid=False),
        )
        st.plotly_chart(fig2, use_container_width=True)

    with col_b:
        st.markdown("**Importaciones de la red pública**")
        fig3 = go.Figure(go.Bar(
            x=df["hora"], y=df["grid_import"],
            marker_color=[C["rosa"] if v > 0 else "rgba(0,0,0,.03)" for v in df["grid_import"]],
            marker_line_width=0,
        ))
        fig3.update_layout(
            title=dict(text="Importación Red (kW)", font=dict(family="Cormorant Garamond", size=15, color=C["bosque"])),
            plot_bgcolor="white", paper_bgcolor="white",
            font=dict(family="JetBrains Mono", size=10),
            margin=dict(l=30, r=10, t=50, b=40),
            height=300,
            xaxis=dict(gridcolor="rgba(74,103,65,.08)", tickangle=45, tickfont=dict(size=8)),
            yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kW"),
        )
        st.plotly_chart(fig3, use_container_width=True)

        if total_grid < 10:
            st.markdown("""<div class='info-box'>
            ✅ <b>Nodo autónomo</b> — La generación solar + BESS cubre toda la demanda comunitaria durante este día.
            </div>""", unsafe_allow_html=True)
        elif total_grid < 50:
            st.markdown("""<div class='warn-box'>
            ⚠️ <b>Apoyo parcial de red</b> — Algunas horas de baja irradiancia requieren respaldo de EPM.
            </div>""", unsafe_allow_html=True)

    # ── Tabla horaria ─────────────────────────────────────────────────────────
    with st.expander("📋 Ver datos horarios completos"):
        df_show = df.copy()
        df_show.columns = ["Hora","Solar kW","Carga kW","Balance kW","SOC %",
                           "BESS Carga kW","BESS Desc. kW","Red Import. kW","Curtail kW"]
        st.dataframe(df_show.style.format("{:.1f}", subset=df_show.columns[1:])
                     .background_gradient(subset=["Solar kW"], cmap="Greens")
                     .background_gradient(subset=["SOC %"], cmap="Blues"),
                     use_container_width=True)


# ─────────────────────────────────────────────────────────────────────────────
# TAB 2 — RESUMEN ANUAL
# ─────────────────────────────────────────────────────────────────────────────
with tab2:
    st.markdown("""
    <div class='eyebrow'>proyección anual · 12 meses simulados</div>
    <div class='section-title'>Producción y Ahorro — Año completo</div>
    <div class='section-sub'>Promedio laboral/festivo · datos IDEAM · tarifa EPM estrato 2</div>
    """, unsafe_allow_html=True)

    with st.spinner("Simulando 12 meses..."):
        ann = annual_summary(n_panels, n_households)

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("☀️ Energía solar/año", f"{ann['solar_anual_kwh']:,} kWh", f"{ann['kwp_instalados']} kWp")
    c2.metric("🌿 Cobertura solar", f"{ann['solar_fraction_pct']} %",
              "Excelente" if ann['solar_fraction_pct'] >= 80 else "Aceptable")
    c3.metric("🌍 CO₂ evitado/año", f"{ann['co2_ton_yr']} ton", "≈ 0.214 kgCO₂/kWh")
    c4.metric("💰 Ahorro/año", f"${ann['ahorro_cop_yr']:,.0f} COP",
              f"${ann['ahorro_cop_yr']/12:,.0f}/mes")

    st.markdown("")

    # Gráficas mensuales
    monthly_data = []
    for m in range(1, 13):
        df_m = full_day_simulation(n_panels, n_households, month=m, day_type="laboral")
        days_m = [31,28,31,30,31,30,31,31,30,31,30,31][m-1]
        monthly_data.append({
            "mes": MONTHS[m-1],
            "solar_kwh": round(df_m["solar_kw"].sum() * days_m),
            "load_kwh":  round(df_m["load_kw"].sum() * days_m),
            "grid_kwh":  round(df_m["grid_import"].sum() * days_m),
        })
    df_monthly = pd.DataFrame(monthly_data)
    df_monthly["cobertura_pct"] = (
        (df_monthly["solar_kwh"] / df_monthly["load_kwh"]) * 100
    ).clip(0, 100).round(1)

    col_l, col_r = st.columns([3, 2])

    with col_l:
        fig_ann = go.Figure()
        fig_ann.add_trace(go.Bar(
            x=df_monthly["mes"], y=df_monthly["solar_kwh"],
            name="☀️ Generación solar", marker_color=C["energia"], opacity=.85,
        ))
        fig_ann.add_trace(go.Bar(
            x=df_monthly["mes"], y=df_monthly["load_kwh"],
            name="⚡ Demanda", marker_color=C["petroleo"], opacity=.6,
        ))
        fig_ann.add_trace(go.Scatter(
            x=df_monthly["mes"], y=df_monthly["cobertura_pct"],
            name="% Cobertura", mode="lines+markers",
            line=dict(color=C["solar"], width=2.5, dash="dot"),
            marker=dict(size=7),
            yaxis="y2",
        ))
        fig_ann.update_layout(
            title=dict(text="Generación vs Demanda Mensual", font=dict(family="Cormorant Garamond", size=18, color=C["bosque"])),
            plot_bgcolor="white", paper_bgcolor="white",
            font=dict(family="JetBrains Mono", size=10),
            barmode="group",
            legend=dict(orientation="h", y=-0.18, font=dict(size=9)),
            margin=dict(l=40, r=50, t=50, b=70),
            height=380,
            xaxis=dict(gridcolor="rgba(74,103,65,.08)"),
            yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kWh/mes"),
            yaxis2=dict(title="% Cobertura", overlaying="y", side="right", range=[0,120], showgrid=False),
        )
        st.plotly_chart(fig_ann, use_container_width=True)

    with col_r:
        # Donut distribución energía
        labels = ["Autoconsumo solar", "Red pública", "Curtailment"]
        auto   = ann["solar_anual_kwh"] - ann["curtail_kwh"]
        vals   = [auto, ann["grid_anual_kwh"], ann["curtail_kwh"]]
        colors = [C["energia"], C["rosa"], C["arena"]]

        fig_pie = go.Figure(go.Pie(
            labels=labels, values=vals,
            hole=.55,
            marker_colors=colors,
            textinfo="percent+label",
            textfont=dict(family="JetBrains Mono", size=10),
        ))
        fig_pie.add_annotation(
            text=f"<b>{ann['solar_fraction_pct']}%</b><br>Solar",
            x=0.5, y=0.5, font=dict(size=16, family="Poppins", color=C["bosque"]),
            showarrow=False,
        )
        fig_pie.update_layout(
            title=dict(text="Origen de la energía", font=dict(family="Cormorant Garamond", size=16, color=C["bosque"])),
            plot_bgcolor="white", paper_bgcolor="white",
            margin=dict(l=10, r=10, t=50, b=10),
            height=300,
            legend=dict(font=dict(size=9, family="JetBrains Mono")),
            showlegend=True,
        )
        st.plotly_chart(fig_pie, use_container_width=True)

        # Ahorro económico mensual
        tarifa = 820  # COP/kWh
        df_monthly["ahorro_cop"] = (df_monthly["solar_kwh"] - df_monthly["grid_kwh"]) * tarifa
        st.metric("💰 Ahorro prom. mensual", f"${df_monthly['ahorro_cop'].mean():,.0f} COP",
                  f"${df_monthly['ahorro_cop'].sum():,.0f} COP/año")
        st.metric("🌳 Equiv. árboles/año", f"{int(ann['co2_ton_yr'] * 1000 / 11.7)} árboles",
                  "a 11.7 kg CO₂/árbol/año")


# ─────────────────────────────────────────────────────────────────────────────
# TAB 3 — ESTADO BESS DETALLADO
# ─────────────────────────────────────────────────────────────────────────────
with tab3:
    st.markdown("""
    <div class='eyebrow'>análisis del sistema de almacenamiento</div>
    <div class='section-title'>BESS — Batería LFP Comunitaria</div>
    <div class='section-sub'>Simulación ciclos de carga/descarga · temperatura nominal 20°C</div>
    """, unsafe_allow_html=True)

    df3 = full_day_simulation(n_panels, n_households, month_sel, day_type, soc_init)

    # KPIs BESS
    max_soc  = df3["soc_pct"].max()
    min_soc  = df3["soc_pct"].min()
    cycles   = (df3["bess_discharge"].sum()) / max(bess_cap, 1)
    autonomy = (bess_cap * (soc_init - 0.1) * 0.94) / max(df3["load_kw"].max(), 1)

    cb1, cb2, cb3, cb4 = st.columns(4)
    cb1.metric("🔋 SOC máximo", f"{max_soc:.0f}%")
    cb2.metric("🪫 SOC mínimo", f"{min_soc:.0f}%")
    cb3.metric("🔄 Ciclos equiv./día", f"{cycles:.2f}")
    cb4.metric("⏱️ Autonomía máx.", f"{autonomy:.1f} h", "Desde SOC inicial")

    # Curva SOC detallada
    fig_soc = go.Figure()
    fig_soc.add_hrect(y0=85, y1=100, fillcolor="rgba(46,204,113,.06)", line_width=0,
                      annotation_text="Zona óptima alta", annotation_position="right")
    fig_soc.add_hrect(y0=10, y1=25, fillcolor="rgba(212,165,165,.1)", line_width=0,
                      annotation_text="Zona crítica", annotation_position="right")

    fig_soc.add_trace(go.Scatter(
        x=df3["hora"], y=df3["soc_pct"],
        name="SOC (%)",
        line=dict(color=C["teal"], width=3),
        fill="tozeroy", fillcolor="rgba(26,188,156,.07)",
        mode="lines+markers", marker=dict(size=5, color=C["teal"]),
    ))

    # Zonas de carga / descarga
    fig_soc.add_trace(go.Scatter(
        x=df3["hora"], y=df3["bess_charge"] * 2,
        name="↑ Cargando",
        line=dict(color=C["energia"], width=1.5, dash="dot"),
        yaxis="y2",
    ))
    fig_soc.add_trace(go.Scatter(
        x=df3["hora"], y=df3["bess_discharge"] * 2,
        name="↓ Descargando",
        line=dict(color=C["solar"], width=1.5, dash="dot"),
        yaxis="y2",
    ))

    fig_soc.update_layout(
        title=dict(text="Evolución del Estado de Carga (SOC) — BESS", font=dict(family="Cormorant Garamond", size=18, color=C["bosque"])),
        plot_bgcolor="white", paper_bgcolor="white",
        font=dict(family="JetBrains Mono", size=10),
        legend=dict(orientation="h", y=-0.18, font=dict(size=9)),
        margin=dict(l=40, r=80, t=50, b=70),
        height=380,
        xaxis=dict(gridcolor="rgba(74,103,65,.08)", title="Hora"),
        yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="SOC (%)", range=[0, 102]),
        yaxis2=dict(title="kW", overlaying="y", side="right", showgrid=False),
    )
    st.plotly_chart(fig_soc, use_container_width=True)

    # Análisis multi-mes del BESS
    st.markdown("#### Comportamiento mensual del BESS")
    bess_monthly = []
    for m in range(1, 13):
        df_m = full_day_simulation(n_panels, n_households, month=m, day_type="laboral")
        days_m = [31,28,31,30,31,30,31,31,30,31,30,31][m-1]
        bess_monthly.append({
            "mes":        MONTHS[m-1],
            "carga_kwh":  round(df_m["bess_charge"].sum() * days_m),
            "desc_kwh":   round(df_m["bess_discharge"].sum() * days_m),
            "soc_min":    df_m["soc_pct"].min(),
            "soc_max":    df_m["soc_pct"].max(),
        })
    df_bm = pd.DataFrame(bess_monthly)

    fig_bm = go.Figure()
    fig_bm.add_trace(go.Bar(x=df_bm["mes"], y=df_bm["carga_kwh"],
                            name="↑ Carga BESS kWh", marker_color=C["energia"], opacity=.8))
    fig_bm.add_trace(go.Bar(x=df_bm["mes"], y=df_bm["desc_kwh"],
                            name="↓ Descarga kWh", marker_color=C["teal"], opacity=.7))
    fig_bm.update_layout(
        barmode="group", plot_bgcolor="white", paper_bgcolor="white",
        font=dict(family="JetBrains Mono", size=10),
        margin=dict(l=40, r=10, t=20, b=40), height=280,
        xaxis=dict(gridcolor="rgba(74,103,65,.08)"),
        yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kWh/mes"),
        legend=dict(font=dict(size=9)),
    )
    st.plotly_chart(fig_bm, use_container_width=True)

    st.markdown(f"""<div class='info-box'>
    💡 <b>Vida útil estimada:</b> Con {cycles:.2f} ciclos/día equivalentes, la batería LFP
    alcanza ~{int(3000/max(cycles*365, 1))} años de vida útil (≥3,000 ciclos garantizados a 80% SOH).
    Ciclos reales varían con temperatura y profundidad de descarga.
    </div>""", unsafe_allow_html=True)


# ─────────────────────────────────────────────────────────────────────────────
# TAB 4 — DIMENSIONAMIENTO
# ─────────────────────────────────────────────────────────────────────────────
with tab4:
    st.markdown("""
    <div class='eyebrow'>herramienta de dimensionamiento</div>
    <div class='section-title'>¿Cuántos paneles y qué BESS necesito?</div>
    <div class='section-sub'>Calcula el sistema óptimo para el número de viviendas y autonomía deseada</div>
    """, unsafe_allow_html=True)

    col_dim1, col_dim2 = st.columns(2)
    with col_dim1:
        h_dim = st.slider("Viviendas a cubrir", 20, 600, n_households, 10, key="dim_h")
        aut_h = st.slider("Autonomía deseada (horas sin sol)", 2, 24, 6, 1,
                          help="Horas que el nodo puede operar solo con baterías durante cortes o noches largas")

    rec = sizing_recommendation(h_dim, aut_h)

    with col_dim2:
        st.markdown(f"""
        <div style='background:rgba(11,61,46,.05);border:1px solid rgba(11,61,46,.15);
                    border-radius:14px;padding:20px;margin-top:8px'>
            <div style='font-family:"Cormorant Garamond",serif;font-size:1.3rem;color:#0B3D2E;margin-bottom:12px'>
                Recomendación del modelo
            </div>
            <div style='display:grid;grid-template-columns:1fr 1fr;gap:10px'>
                <div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:.65rem;color:#9ca3af;text-transform:uppercase'>Paneles</div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:1.4rem;color:#2ECC71;font-weight:600'>{rec["panels_rec"]}</div>
                    <div style='font-size:.72rem;color:#9ca3af'>{rec["kwp_rec"]} kWp</div>
                </div>
                <div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:.65rem;color:#9ca3af;text-transform:uppercase'>BESS</div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:1.4rem;color:#1ABC9C;font-weight:600'>{rec["bess_kwh_rec"]} kWh</div>
                    <div style='font-size:.72rem;color:#9ca3af'>{rec["bess_power_rec"]} kW potencia</div>
                </div>
                <div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:.65rem;color:#9ca3af;text-transform:uppercase'>Carga pico</div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:1.4rem;color:#F4D03F;font-weight:600'>{rec["peak_load_kw"]} kW</div>
                </div>
                <div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:.65rem;color:#9ca3af;text-transform:uppercase'>Autonomía</div>
                    <div style='font-family:"JetBrains Mono",monospace;font-size:1.4rem;color:#9B8FB5;font-weight:600'>{rec["autonomy_h"]} h</div>
                </div>
            </div>
        </div>
        """, unsafe_allow_html=True)

    st.markdown("---")

    # Análisis de sensibilidad: paneles vs cobertura
    st.markdown("#### Sensibilidad: paneles instalados vs cobertura solar")
    panel_range = range(50, 601, 25)
    cov_list = []
    for p in panel_range:
        df_s = full_day_simulation(p, h_dim, month=6)
        sol_frac = (1 - df_s["grid_import"].sum() / max(df_s["load_kw"].sum(), 1)) * 100
        cov_list.append({"paneles": p, "kwp": round(p * PANEL_WP / 1000, 1),
                         "cobertura": round(sol_frac, 1)})
    df_sens = pd.DataFrame(cov_list)

    fig_sens = go.Figure()
    fig_sens.add_trace(go.Scatter(
        x=df_sens["kwp"], y=df_sens["cobertura"],
        mode="lines+markers",
        line=dict(color=C["energia"], width=2.5),
        marker=dict(size=4),
        fill="tozeroy", fillcolor="rgba(46,204,113,.07)",
        name="Cobertura solar (%)",
    ))
    # Línea de objetivo 80 %
    fig_sens.add_hline(y=80, line_dash="dash", line_color=C["solar"],
                       annotation_text="Objetivo 80% cobertura", annotation_position="right")
    # Punto actual
    cur_kwp = round(n_panels * PANEL_WP / 1000, 1)
    cur_cov = df_sens.loc[(df_sens["kwp"] - cur_kwp).abs().idxmin(), "cobertura"]
    fig_sens.add_trace(go.Scatter(
        x=[cur_kwp], y=[cur_cov],
        mode="markers", marker=dict(size=12, color=C["teal"], symbol="diamond"),
        name=f"Config. actual ({cur_kwp} kWp)",
    ))

    fig_sens.update_layout(
        plot_bgcolor="white", paper_bgcolor="white",
        font=dict(family="JetBrains Mono", size=10),
        margin=dict(l=40, r=80, t=20, b=50),
        height=300,
        xaxis=dict(gridcolor="rgba(74,103,65,.08)", title="kWp instalados"),
        yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="Cobertura solar (%)", range=[0, 105]),
        legend=dict(font=dict(size=9)),
    )
    st.plotly_chart(fig_sens, use_container_width=True)

    # BESS vs autonomía
    st.markdown("#### Capacidad BESS vs autonomía nocturna")
    bess_range = range(50, 401, 25)
    aut_list = []
    pk = rec["peak_load_kw"]
    for b in bess_range:
        aut_v = round((b * (BESS_SOC_MAX - BESS_SOC_MIN) * 0.94) / max(pk, 1), 1) if pk > 0 else 0
        aut_list.append({"bess_kwh": b, "autonomia_h": aut_v})
    df_aut = pd.DataFrame(aut_list)

    fig_aut = go.Figure(go.Scatter(
        x=df_aut["bess_kwh"], y=df_aut["autonomia_h"],
        mode="lines+markers", line=dict(color=C["teal"], width=2.5),
        fill="tozeroy", fillcolor="rgba(26,188,156,.07)",
    ))
    fig_aut.add_hline(y=aut_h, line_dash="dash", line_color=C["lavanda"],
                      annotation_text=f"Objetivo {aut_h}h", annotation_position="right")
    fig_aut.add_trace(go.Scatter(
        x=[bess_cap], y=[round((bess_cap * 0.85 * 0.94) / max(pk, 1), 1)],
        mode="markers", marker=dict(size=12, color=C["oro"], symbol="diamond"),
        name=f"Config. actual ({bess_cap} kWh)",
    ))
    fig_aut.update_layout(
        plot_bgcolor="white", paper_bgcolor="white",
        font=dict(family="JetBrains Mono", size=10),
        margin=dict(l=40, r=80, t=10, b=50),
        height=260,
        xaxis=dict(gridcolor="rgba(74,103,65,.08)", title="Capacidad BESS (kWh)"),
        yaxis=dict(gridcolor="rgba(74,103,65,.08)", title="Autonomía (horas)"),
        legend=dict(font=dict(size=9)),
        showlegend=True,
    )
    st.plotly_chart(fig_aut, use_container_width=True)

    # BESS_SOC_MAX como constante local para usarse en cálculo arriba
    BESS_SOC_MAX = 0.95


# ─────────────────────────────────────────────────────────────────────────────
# TAB 5 — FICHA TÉCNICA
# ─────────────────────────────────────────────────────────────────────────────
with tab5:
    st.markdown("""
    <div class='eyebrow'>documentación técnica · v0.1-alpha</div>
    <div class='section-title'>Ficha Técnica — Nodo La Torre</div>
    <div class='section-sub'>Cerro Pan de Azúcar · Comuna 8 · Medellín · ALTO MONTE ENERGY</div>
    """, unsafe_allow_html=True)

    col_f1, col_f2 = st.columns(2)

    with col_f1:
        st.markdown("#### 📍 Localización")
        st.markdown("""
        <div class='data-badge'>6.231°N · 75.551°O</div>
        <div class='data-badge'>1,850 msnm</div>
        <div class='data-badge'>Cerro Pan de Azúcar</div>
        <div class='data-badge'>Comuna 8 · Medellín</div>
        """, unsafe_allow_html=True)
        st.markdown("")

        st.markdown("#### ☀️ Recurso solar")
        sol_data = {
            "Parámetro": ["Irradiación diaria media", "Irradiancia pico (GHI)", "HSP promedio", "Temperatura ambiente", "NOCT módulo", "Variabilidad estacional"],
            "Valor": ["4.7 kWh/m²/día", "850 W/m²", "4.7 h", "20.5 °C", "44 °C", "±8% (lluvias abr-may, sep-oct)"],
            "Fuente": ["IDEAM 2023","IDEAM Atlas","IDEAM","IDEAM Medellín","IEC 61215","IDEAM"],
        }
        st.dataframe(pd.DataFrame(sol_data), use_container_width=True, hide_index=True)

        st.markdown("#### ⚡ Sistema FV")
        fv_data = {
            "Parámetro": ["Tecnología módulo", "Potencia pico módulo", "Eficiencia STC", "Coef. temperatura Pmax", "Eficiencia inversor", "Performance Ratio base"],
            "Valor": ["Monocristalino PERC", "545 Wp", "21.0%", "-0.35 %/°C", "97.5%", "80.0%"],
        }
        st.dataframe(pd.DataFrame(fv_data), use_container_width=True, hide_index=True)

    with col_f2:
        st.markdown("#### 🔋 Sistema BESS")
        bess_data = {
            "Parámetro": ["Tecnología", "Capacidad nominal", "Potencia max. C/D", "Eficiencia RTE", "SOC mínimo", "SOC máximo", "Vida útil estimada"],
            "Valor": ["LFP (LithiumFerroPhosphate)", "200 kWh", "80 kW", "94%", "10%", "95%", ">3,000 ciclos (≥15 años)"],
        }
        st.dataframe(pd.DataFrame(bess_data), use_container_width=True, hide_index=True)

        st.markdown("#### 🏘️ Demanda comunitaria")
        dem_data = {
            "Parámetro": ["Viviendas en la microred", "Estrato socioeconómico", "Consumo típico/vivienda", "Perfil de carga", "Carga pico estimada", "Carga valle estimada"],
            "Valor": ["~380 hogares", "Estrato 1-2", "155 kWh/mes (EPM 2023)", "Doble pico (mañana + noche)", "~115 kW (18:30-20:00h)", "~35 kW (03:00-05:00h)"],
        }
        st.dataframe(pd.DataFrame(dem_data), use_container_width=True, hide_index=True)

        st.markdown("#### 📐 Marco regulatorio")
        st.markdown("""
        <div class='data-badge'>Ley 1715 de 2014</div>
        <div class='data-badge'>Ley 2099 de 2021</div>
        <div class='data-badge'>Res. CREG 174/2021</div>
        <div class='data-badge'>RETIE / NTC 5001</div>
        <div class='data-badge'>FENOGE</div>
        <div class='data-badge'>IPSE</div>
        """, unsafe_allow_html=True)

    st.markdown("---")
    st.markdown("#### 🔬 Referencias y supuestos del modelo")
    st.markdown("""
    <div class='info-box'>
    <b>Modelo solar:</b> Campana gaussiana calibrada con datos IDEAM (Atlas Solar Colombia 2014).
    Temperatura de célula calculada con método NOCT-IEC 61215.
    Pérdidas por temperatura aplicadas con coeficiente estándar para módulos PERC.<br><br>
    <b>Perfil de carga:</b> Basado en mediciones UPME / ICONTEC para estrato 1-2 periurbano Antioquia.
    Doble pico mañana/noche característico de hogares sin aire acondicionado en clima templado.<br><br>
    <b>BESS:</b> Modelo energético simple (sin térmica de celda). Eficiencia RTE 94% constante.
    Degradación de capacidad no modelada en v0.1.<br><br>
    <b>Factor CO₂:</b> 0.214 kgCO₂/kWh — factor de emisión red Colombia, XM (2023).<br><br>
    <b>Tarifa energía:</b> $820 COP/kWh — promedio EPM estrato 2, segundo semestre 2024.
    </div>
    """, unsafe_allow_html=True)

    st.markdown("""
    <div style='text-align:center;padding:24px;font-family:"JetBrains Mono",monospace;
                font-size:.65rem;color:#9ca3af;margin-top:24px'>
        ALTO MONTE ENERGY · Gemelo Digital Nodo La Torre v0.1-alpha · 2025<br>
        Modelo educativo / pre-inversión — No substituye ingeniería de detalle certificada
    </div>
    """, unsafe_allow_html=True)
