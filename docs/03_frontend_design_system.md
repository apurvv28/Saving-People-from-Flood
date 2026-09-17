# AquaAlert: Frontend Design System (Turquoise Green & White Theme)

## 1. Visual Language & Color Palette

AquaAlert uses a clean, high-contrast, professional **Turquoise Green & White** design system for maximum clarity and ease of use.

* **Theme**: Crisp White & Slate Light Base (`#f8fafc`, `#ffffff`) with rich Turquoise Teal (`#0d9488`, `#0f766e`, `#14b8a6`) accents.
* **Palette**:
  * **Primary Background**: `#f1f5f9` (Soft Light Gray)
  * **Card / Panel Surface**: `#ffffff` with crisp `1px solid #e2e8f0` borders and soft drop shadows (`box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05)`).
  * **Brand Accent (Turquoise)**: Primary `#0d9488` (Teal 600), Light `#2dd4bf` (Teal 300), Dark `#115e59` (Teal 800).
  * **Text Headers**: Deep Navy Slate `#0f172a`.
  * **Text Muted**: `#64748b`.
  * **Flood Severity Color Scale**:
    * **Safe (0–8 cm)**: Turquoise Green (`#0d9488`)
    * **Warning (8–20 cm)**: Amber Gold (`#d97706`)
    * **Critical (20–40 cm)**: Warm Orange (`#ea580c`)
    * **Severe (> 40 cm)**: Crimson Red (`#dc2626`)

---

## 2. Core Principles

1. **No Noise / No Unwanted Animations**: Clean, static, readable typography and high-contrast indicators instead of distracting glowing keyframes or pinging badges.
2. **High Legibility**: High contrast dark navy text on bright white/turquoise backgrounds, readable in direct sunlight or indoor command control displays.
3. **Responsive Vector GIS Canvas**: Uses CartoDB Positron light map tiles for clean spatial rendering.
