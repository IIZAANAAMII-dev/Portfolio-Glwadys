# Art Direction & Visual Identity: "The Creative Layers"

## 1. Concept & Narrative Philosophy
The digital portfolio of **Glwadys Dalleau** embodies the tension and synergy between **spontaneous creative intuition** and **structured brand strategy**.
We avoid generic web developer layouts and SaaS templates in favor of a **high-fashion, editorial digital magazine experience** meets **cinematic spatial 3D gallery**.

---

## 2. Color Palette & Tonal Worlds

### Core Editorial Palette
- **Obsidian Dark (Canvas Void)**: `#0B0C0E` — The base infinite depth.
- **Warm Ivory / Cream (Strategic Light)**: `#F5F3EF` & `#EAE6DF` — Used for the Strategy, Comptoir, and editorial text moments.
- **Champagne / Muted Gold Accent**: `#D8C29D` & `#C5A880` — Subtle luxury accent for index marks, active timeline pills, and micro-lines.
- **Charcoal / Graphite**: `#181A1E` & `#23272D` — For glass panels, phone chassis, and behind-the-scenes cards.
- **Warm Terracotta / Cocoa**: `#7D4F39` & `#3E271D` — Warm gourmet tones dedicated to Le Comptoir de Mathilde.
- **Solar Sunset / Lavender Tint**: `#E27D60` & `#C98686` — Marseille Girls Club vibrant Mediterranean community tone.

---

## 3. Typography Hierarchy

### Display Type
- **Serif / Editorial Display**: High-contrast, elegant editorial headline type (`Playfair Display` or `Italiana` / `Instrument Serif`).
- **Sans Display / Grotesque**: Crisp, impactful grotesque for punchy titles (`Plus Jakarta Sans` / `Syne` / `Clash Display`).

### Body & Micro Typography
- **Body Text**: Clean neutral sans (`Inter` / `Plus Jakarta Sans`) with optical kerning and measured line-height (`1.55`).
- **Technical & Metadata**: Monospace (`JetBrains Mono` / `Space Mono`) for chapter indices, time codes, coordinates, and aspect ratios (`10px` uppercase, `letter-spacing: 0.15em`).

### Korean (KO) Typography
- Native Korean typography support (`Noto Sans KR` / `Pretendard`) preserving visual weight, balanced character spacing, and graceful multi-line word breaks (`word-break: keep-all`).

---

## 4. Spatial Planes & Depth Philosophy

```
Z-Depth Hierarchy:
+-------------------------------------------------------------+
| Foreground (Z: +2.0 to +4.0): Micro-glass badges, active cards |
| Midground    (Z: 0.0 to +1.5): Main Headlines, Active Subject  |
| Background   (Z: -1.5 to -4.0): Inactive Media, Grids, Moodboard|
| Deep Void    (Z: -5.0 to -15.0): Ghost year markers, ambient aura|
+-------------------------------------------------------------+
```

---

## 5. Motion Pacing & Rhythmic Breathing
The experience cycles deliberately between:
1. **High-Impact Cinematic Moments (WOW)**: Phone camera dive, portrait grid deconstruction, project constellation travel.
2. **Quiet Editorial Breathing Spaces (CALME)**: About statement, Le Comptoir slow zoom, Strategy ivory grid, final footer stillness.
3. **Pacing Rules**:
   - Scroll scrubbing is weighted and damped (`scrub: 1.2`).
   - Velocity creates micro-shearing and subtle depth shifts without excessive distortion.
   - Reduced motion mode disables camera translation in favor of gentle 2D opacity/scale reveals.

---

## 6. Glass & Tactile Materials
- Glass materials are restricted to navigation headers, timecode tags, and interactive filters (`backdrop-filter: blur(16px)`, `background: rgba(20, 20, 24, 0.65)`, `border: 1px solid rgba(255, 255, 255, 0.08)`).
- Paper & film grain textures add organic warmth to digital photography planes.
