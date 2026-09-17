# AquaAlert: Feasible & Deployable System Architecture

## 1. High-Level Architecture Overview

AquaAlert is designed for high performance, low latency, and rapid deployment. It decouples real-time geospatial processing and hydraulic calculation from the frontend rendering engine while enabling edge-cached routing and map visualization.

```
+-----------------------------------------------------------------------------------+
|                                 DATA INGESTION                                    |
|  - Open-Meteo / IMD Weather Radar Stream (Live 5-min Nowcasting)                 |
|  - CartoDEM / ISRO Bhoonidhi Elevation Tiles (DEM 10m/30m)                        |
|  - OpenStreetMap / City Stormwater Drainage Graph (Nodes & Edges)                 |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                        HYDRAULIC NOWCASTING SIMULATION ENGINE                     |
|  - 2D Surface Runoff Computation (Rainfall - Infiltration -> Overland Flow)      |
|  - 1D Drainage Graph Solver (NetworkX / SWMM-light engine in Python/Rust/Wasm)    |
|  - Surface-Subsurface Coupling (Inlet inflow vs pipe capacity surcharge backflow) |
|  - 0-3h Forecast Generator (Outputting GeoJSON layers for 0m, +15m, +30m.. +180m) |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                             NEXT.JS FULLSTACK FRAMEWORK                           |
|  - Next.js 16 (App Router, Server Actions, Dynamic Map Tile Delivery)            |
|  - API Gateway / Edge Routing Engine (A* / Dijkstra with Dynamic Water Edge Weights)|
|  - Citizen Ground Truth WebSocket/REST Sync & Situation Report PDF Generator       |
+----------------------------------------+------------------------------------------+
                                         |
                                         v
+-----------------------------------------------------------------------------------+
|                           NEXT-GEN SEAMLESS FRONTEND (UI/UX)                      |
|  - MapLibre GL / Deck.gl / Leaflet interactive GIS canvas                         |
|  - Dark Glassmorphic Design System (TailwindCSS / Custom Vanilla CSS)              |
|  - Dynamic 0-3 Hour Scrubber, Flood-Safe Routing, Multilingual Engine, PWA Ready  |
+-----------------------------------------------------------------------------------+
```

---

## 2. Dynamic Flood-Safe Routing Algorithm
Standard routing engines (e.g., OSRM, Valhalla) use fixed road speed limits. AquaAlert modifies the edge weight matrix dynamically based on water depth:

$$\text{Weight}(e, t) = \frac{\text{Length}(e)}{\text{Speed}(e)} \times \left(1 + \alpha \cdot \max(0, \text{Depth}(e, t) - \text{Threshold})\right)$$

When predicted depth $\text{Depth}(e, t)$ exceeds safety limits (e.g. 15 cm for regular cars, 30 cm for heavy transit), $\text{Weight}(e, t)$ approaches infinity, forcing the route engine to bypass submerged intersections seamlessly.

---

## 3. Data Flow & Update Cycle
1. **Radar Ingestion**: Every 5–15 minutes, updated radar raster / Open-Meteo precipitation nowcasts are ingested.
2. **Hydraulic Solver**: Surface runoff is routed through 2D elevation grid into manhole inlets. Drainage network graph calculates pipe capacity and flags surcharge nodes.
3. **GeoJSON Cache**: Updated flood depth polygons and road segment hazard tags for $t \in [0, 180]$ mins are written to cache.
4. **Client Reactivity**: Frontend GIS map updates dynamically; user routing queries immediately leverage updated risk maps.
