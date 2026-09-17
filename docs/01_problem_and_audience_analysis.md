# AquaAlert: Problem Statement & User Perspective Analysis

## 1. Executive Summary & Problem Context
Urban flooding in major Indian metropolises (Mumbai, Delhi, Chennai, Bengaluru) is an annual high-impact crisis. Traditional Numerical Weather Prediction (NWP) models only forecast volume of rainfall over large spatial grids; they fail to predict street-level inundation because urban flooding is governed by micro-topography, concrete imperviousness, local depressions, and subterranean stormwater drainage capacity.

**AquaAlert** addresses this critical gap by building a real-time, coupled surface-terrain and 1D/2D hydraulic drainage graph nowcasting system. It delivers street-level, 0–3 hour forward-looking flood predictions (water depth in cm, onset time, duration, severity) and interactive flood-safe routing.

---

## 2. Target Audience & User Personas

To avoid the pitfalls of "legacy GIS dashboards" (clunky, complex, desktop-only, table-heavy interfaces), AquaAlert categorizes users into 4 distinct personas and tailors user experience accordingly:

### Persona 1: Municipal Disaster Management Officers (MoES / NCMRWF / Disaster Control Rooms)
* **Goal**: Monitor citywide status, spot critical bottlenecks, evaluate risk thresholds, coordinate emergency deployment, and generate automated situation reports (SitRep).
* **Key Needs**:
  * City-level heatmaps with quick drill-down to manholes/intersections.
  * Real-time alerting panel for overcapacity drains and high-risk zones.
  * 0–3 hour forecast timeline control (scrubber).
  * Automated 1-click SitRep PDF/Summary generator.
  * Offline-capable / resilient interface during severe network degradation.

### Persona 2: Emergency Response Teams & First Responders (Ambulance, Fire, Police)
* **Goal**: Navigate through heavy downpours safely and reach disaster/medical sites without getting stranded in flooded underpasses or submerged streets.
* **Key Needs**:
  * Ultra-fast, responsive Flood-Safe Routing Widget.
  * Live dynamic rerouting as flood depths cross vehicle safety thresholds (e.g. > 15cm for ambulances).
  * Minimal cognitive load, high contrast, dark-mode optimized interface.

### Persona 3: Citizens & General Commuters
* **Goal**: Stay informed about street conditions near home/work, plan safe commutes, receive emergency notifications, and submit real-time ground truth reports.
* **Key Needs**:
  * Seamless mobile-first web app (PWA feel).
  * Multilingual support (English, Hindi, Marathi, Regional).
  * 1-Tap ground-truth verification ("Water is currently 10cm here" + image upload).
  * Quick safe-route search between Point A and Point B.

### Persona 4: Drainage Maintenance & Hydraulic Engineers
* **Goal**: Identify structural bottlenecks, hydraulic backflow points, manhole surcharges, and optimize pumping station schedules.
* **Key Needs**:
  * Underground drainage directed graph visualization (Nodes: manholes/inlets, Edges: pipes/canals).
  * Hydraulic metrics: capacity vs current load, surcharge head, flow velocity, pump status.
  * Maintenance prioritization matrix based on predicted rain and current blockage risks.

---

## 3. UI/UX Paradigm Shift: Moving Beyond Legacy Dashboards

Legacy disaster dashboards fail because they are built like desktop GIS tools (QGIS/ArcGIS interfaces shoved into a browser with 50 sidebars, tiny fonts, and static layers).

**AquaAlert Modern Design Philosophy**:
1. **Fluid Canvas-First Spatial Experience**: The GIS map is the hero element. UI elements float glassmorphically over the canvas with refined backdrop blur, deep rich dark palette (Navy/Teal/Neon Amber alerts), and fluid micro-animations.
2. **Interactive 0–3 Hour Forecast Timeline**: An intuitive temporal scrubber allows users to sweep forward in 15-minute increments, watching floodwaters dynamically rise or recede across roads.
3. **Contextual Drawer & Floating Panels**: Clicking any street segment or drainage node opens a slick, slide-over panel detailing depth (cm), onset time, capacity percentage, and routing impact.
4. **Adaptive Persona Views**: Single unified application with seamless switching between "Citizen View" (simple, clean, routing-focused) and "Authority Mode" (advanced telemetry, node graphs, SitRep exporter).
