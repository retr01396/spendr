# SPENDR - Design System & Visual Specification

This specification documents the authoritative visual system for **SPENDR (Premium Subscription Handler)**. It is derived exclusively from the 6 canonical Stitch screens:

- **OVERVIEW:** `17773b1a708a441ea19161d04269d583`
- **SUBSCRIPTIONS:** `604b2e4c37d9470ba15c384943572c99`
- **ANALYTICS:** `7262f76a71634d1ab008a942031ac2e3`
- **BILLING CALENDAR:** `d4a3a1106a7d45b29f336ea850fe2f7d`
- **SETTINGS:** `afcf66d53f654ebeb059cfc429a54189`
- **ADD SUBSCRIPTION MODAL:** `f5ff35f132cf462eb73032950a9709ad`

---

## 1. Color System

The visual identity is anchored in a deep, atmospheric dark theme driven by high-contrast monochrome tones and intense Red accents.

### Strict Color Palette
The final implementation MUST strictly use:
- **BLACK**
- **DARK GRAPHITE**
- **GREY**
- **LIGHT GREY**
- **WHITE**
- **RED**

> [!CAUTION]
> **Prohibited Colors:** Do NOT introduce Gold, Yellow, Amber, Orange, Purple, Blue, or Green into UI surfaces, status badges, or charts. All historical iterations containing these colors are non-canonical.

### Color Tokens

| Token Name | Hex / RGBA Value | Applied Usage |
|---|---|---|
| `color-bg-base` | `#000000` | Primary viewport background |
| `color-bg-surface-dark` | `#0A0A0C` | Page body background, deep containers |
| `color-bg-surface` | `#121216` | Main card background, table containers |
| `color-bg-surface-elevated` | `#1A1A22` | Hovered cards, active rows, input fields |
| `color-bg-glass` | `rgba(18, 18, 22, 0.85)` | Liquid Glass panels (modals, dropdowns) |
| `color-border-subtle` | `rgba(255, 255, 255, 0.06)` | Table dividers, default card borders |
| `color-border-medium` | `rgba(255, 255, 255, 0.12)` | Active card borders, input borders |
| `color-border-highlight` | `rgba(255, 255, 255, 0.25)` | Hover state borders, focused controls |
| `color-border-accent` | `rgba(229, 9, 20, 0.40)` | Red accent borders, active selection highlights |
| **`color-primary-red`** | **`#E50914`** | Primary CTAs, active indicators, brand logo |
| **`color-red-bright`** | **`#FF3B30`** | Hover states on primary buttons, alert indicators |
| **`color-red-dim`** | **`rgba(229, 9, 20, 0.15)`** | Red glow fills, active menu item backgrounds |
| `color-text-primary` | `#FFFFFF` | High-emphasis headings, key metrics, active text |
| `color-text-secondary` | `#E0E0E0` | Subtitles, body copy, form labels |
| `color-text-muted` | `#8888A0` | Secondary metadata, dates, inactive tab text |
| `color-text-dim` | `#666680` | Table headers, icon fills, subtle captions |

---

## 2. Typography

Typography combines a modern sans-serif for UI layout with a high-legibility monospace font for all financial data.

### Font Families
- **Primary Interface Font:** `'Inter'`, `'Plus Jakarta Sans'`, or `'Geist'`, sans-serif
- **Numerical & Financial Font:** `'JetBrains Mono'`, monospace (with tabular figures `font-feature-settings: "tnum" 1, "lnum" 1`)

### Typography Hierarchy

| Style Level | Font | Size | Weight | Letter Spacing | Case |
|---|---|---|---|---|---|
| **Display Title (H1)** | Sans-serif | `36px` / `2.25rem` | `700` (Bold) | `-0.02em` | Sentence case |
| **Section Heading (H2)** | Sans-serif | `24px` / `1.50rem` | `600` (SemiBold) | `-0.015em` | Sentence case |
| **Card Heading (H3)** | Sans-serif | `18px` / `1.125rem` | `600` (SemiBold) | `-0.01em` | Sentence case |
| **Body Large** | Sans-serif | `16px` / `1.00rem` | `400` / `500` | `normal` | Standard |
| **Body Medium** | Sans-serif | `14px` / `0.875rem` | `400` (Regular) | `normal` | Standard |
| **Body Small** | Sans-serif | `13px` / `0.8125rem` | `400` / `500` | `normal` | Standard |
| **Label / Caption** | Sans-serif | `12px` / `0.75rem` | `600` (SemiBold) | `+0.05em` | UPPERCASE |
| **Metric Value (Hero)** | Monospace | `32px` / `2.00rem` | `700` (Bold) | `-0.02em` | Tabular numbers |
| **Metric Value (Card)** | Monospace | `22px` / `1.375rem` | `600` (SemiBold) | `-0.01em` | Tabular numbers |
| **Table Price / Amount**| Monospace | `14px` / `0.875rem` | `600` (SemiBold) | `normal` | Tabular numbers |

---

## 3. Layout Architecture

The application adopts a desktop-first dashboard structure with a fixed sidebar and structured grid content.

- **Sidebar Width:** `260px` fixed desktop width (`72px` collapsed rail on medium viewports).
- **Content Area:** `calc(100% - 260px)`, centered with max-width `1600px`.
- **Page Margins:** `32px` padding around workspace content (`24px` tablet, `16px` mobile).
- **Grid System:** 12-column CSS Grid with `24px` column gap and `24px` row gap.
- **Card Padding:** `24px` standard inner padding (`16px` for compact cards).
- **Border Radius:** `12px` standard card radius, `8px` button/input radius, `16px` modal radius, `9999px` pills.
- **Spacing Scale:** Base `8px` grid system (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px).

---

## 4. Component Specification

### Sidebar & Navigation
- **Header:** SPENDR logo with glowing red flame icon (`#E50914`) and white typography.
- **Navigation Links:** `44px` height items. Active state features a `3px` solid `#E50914` left indicator bar, `#1A1A22` background, and red tinted text/icon. Hover state subtle white overlay `rgba(255, 255, 255, 0.04)`.
- **User Profile Footer:** Compact avatar block with user name, plan status ("PRO"), and quick settings trigger.

### Metric Cards
- Background `#121216` with `1px solid rgba(255, 255, 255, 0.07)` border.
- Primary Highlight Metric Card features a top border gradient line in Red (`#E50914`) and subtle red radial background glow (`rgba(229, 9, 20, 0.08)`).
- Contains title label, monetary value in monospace, percentage change badge, and sparkline or comparison indicator.

### Subscription Table & List Rows
- **Table Header:** Background `#0A0A0C`, uppercase captions in `#666680`, bottom border `1px solid rgba(255, 255, 255, 0.08)`.
- **Rows:** Height `64px`, dark graphite background `#121216`, hover highlight `#1A1A22` with smooth 150ms transition.
- **Brand Avatar Container:** `40x40px` square with `8px` rounded corners, dark grey fill `#1A1A22`, crisp service icon or initials.
- **Subscription Metadata:** Service name in bold white, billing cycle & category in muted grey (`#8888A0`).
- **Amount & Status:** Right-aligned price in white monospace text. Status pills: Active (Dark grey badge with white text), Upcoming (Dark grey badge with subtle red border dot), Cancelled (Muted dark badge).

### Buttons & Inputs
- **Primary Button:** `#E50914` background, white bold text, shadow `0 4px 20px rgba(229, 9, 20, 0.35)`. Hover: `#FF3B30` with `0 6px 24px rgba(229, 9, 20, 0.55)`.
- **Secondary Button:** `#1A1A22` background, `1px solid rgba(255, 255, 255, 0.12)` border, white text. Hover: border `rgba(255, 255, 255, 0.25)`.
- **Ghost Button:** Transparent background, muted text (`#8888A0`). Hover: text `#FFFFFF`, background `rgba(255, 255, 255, 0.05)`.
- **Input Fields:** Background `#0A0A0C`, border `1px solid rgba(255, 255, 255, 0.1)`. Focus: border `#E50914` with box shadow `0 0 12px rgba(229, 9, 20, 0.25)`.

### Liquid Glass Modals & Drawers
- **Modal Overlay:** `rgba(0, 0, 0, 0.85)` backdrop with `backdrop-filter: blur(16px)`.
- **Modal Container:** Centered dialog, width `560px` max, background `rgba(18, 18, 22, 0.92)`, border `1px solid rgba(255, 255, 255, 0.14)`, top accent line `1px solid rgba(229, 9, 20, 0.40)`.
- **Drawer Panel:** Right slide-in panel `480px` wide, background `rgba(14, 14, 18, 0.95)`, `backdrop-filter: blur(24px)`, `border-left: 1px solid rgba(255, 255, 255, 0.12)`.

### Billing Calendar
- Monthly grid view with 7 weekday columns.
- Cell background `#0A0A0C` with `1px solid rgba(255, 255, 255, 0.05)` grid borders.
- Days with due subscriptions highlight the date cell with a subtle red outline (`rgba(229, 9, 20, 0.3)`) and display stacked subscription pills showing brand logo + due amount.

---

## 5. Visual Material: Liquid Glass Specification

To ensure a refined financial SaaS aesthetic:

> [!IMPORTANT]
> **NO Global Transparency:** The main application canvas and major card containers MUST remain solid Black and Dark Graphite (`#000000`, `#0A0A0C`, `#121216`). Glass surfaces are applied selectively for floating overlay components only.

### Glass Application Rules

```css
/* Canonical Liquid Glass Class */
.liquid-glass-panel {
  background: rgba(18, 18, 22, 0.88);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 20px 50px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

### Selective Usage Scope
1. **Modals & Dialogs:** Add Subscription modal, confirmation dialogs.
2. **Slide-in Drawers:** Subscription details view, filter panels.
3. **Dropdown Menus & Popovers:** Category selectors, sorting menus, date pickers.
4. **Floating Action Controls:** Floating navigation bar, floating filter pills.
5. **Tooltips:** Hover data cards on charts and tables.

---

## 6. Financial Charts Specification

Charts are styled strictly to resemble high-end institutional financial analytics.

- **No Rainbow Colors:** All chart series use shades of Red, Dark Graphite, Grey, and White.
- **Primary Trend Line:** Solid Red (`#E50914`), stroke width `2.5px`, with gradient area fill from `rgba(229, 9, 20, 0.25)` at the top fading to `rgba(229, 9, 20, 0.0)` at the baseline.
- **Category Bar Chart:** Highest expense category highlighted in Red (`#E50914`). Secondary categories in dark graphite (`#222230`) and neutral grey (`#444458`).
- **Distribution Donut Chart:** Inner cutout `70%`. Top category slice in `#E50914`, secondary slices in `#444458`, `#2A2A38`, and `#1A1A24`. Center readout displays total monthly expenditure in white monospace text.
- **Grid & Axes:** Axes lines `#222230`, tick text `#666680` in 11px monospace, grid lines horizontal-only at `rgba(255, 255, 255, 0.04)`.

---

## 7. Interaction States

- **Card Hover:** Subtle `translateY(-2px)` elevation shift, border brightens from `rgba(255,255,255,0.07)` to `rgba(255,255,255,0.18)`, shadow deepens (`0 8px 30px rgba(0,0,0,0.5)`).
- **Row Hover:** Smooth 150ms background transition to `#1A1A22`. Left indicator line glows red.
- **Primary Button Hover:** Scale `1.02`, glow expands to `0 6px 24px rgba(229, 9, 20, 0.55)`. Active click: scale `0.98`.
- **Form Focus:** Input border transitions to `#E50914` with a `3px` outer red aura (`rgba(229, 9, 20, 0.25)`).

---

## 8. Motion & Page Transition Sequence

Motion enhances perceived responsiveness without distracting from data density.

### Entrance & Scroll Animations
- **Staggered Page Entrance:** Main section cards fade up (`translateY(16px)` to `0`, opacity `0` to `1`) with `60ms` staggered delays per card.
- **Chart Animation:** Trendline draws from left-to-right over `800ms` with `cubic-bezier(0.16, 1, 0.3, 1)`. Bar charts expand upward from 0 baseline.

### Canonical Page Transition Sequence
When switching views (Dashboard, Subscriptions, Analytics, Calendar, Settings):

1. **Compression:** Current workspace content subtly compresses toward center (`scale(0.98)`, opacity `0.7`, `duration: 180ms`).
2. **Element Scale:** Active cards and tables scale down slightly into background (`filter: blur(2px)`).
3. **Background Particle Convergence:** Ambient dark particles in the canvas background accelerate slightly toward center axis.
4. **Fade to Dark:** Active view fades to near-black (`opacity: 0`, `duration: 120ms`).
5. **Red Title Flash:** Destination page title (e.g. `ANALYTICS`) appears centered briefly in crisp RED (`#E50914`, `letter-spacing: 0.15em`, `font-size: 24px`, bold).
6. **Title Fade:** Destination title fades out smoothly (`duration: 150ms`).
7. **Expansion:** Destination view expands outward from `scale(0.98)` to `scale(1.0)`.
8. **Staggered Entrance:** New page content cards enter with staggered opacity and `translateY(12px)` motion.
9. **Chart Draw:** Financial charts animate stroke lines into final position.
10. **Settlement:** All UI elements lock into static position cleanly.

> [!CAUTION]
> **Strict Transition Constraint:** The Red page title callout is temporary (display duration < 250ms). NEVER create permanent red background blocks, spinning rectangles, rotating 3D cubes, or persistent floating red shapes behind the application interface.

---

## 9. Integrated 3D Element Specification

A subtle, high-end 3D metallic asset represents the premium subscription card.

- **Visual Style:** Ultra-sleek dark metallic financial card with micro-brushed texture and a subtle red edge rim light (`#E50914`).
- **Placement:** Integrated within the hero summary card on the Overview Dashboard or Analytics page.
- **Behavior:**
  - Floating idle animation: Smooth slow vertical floating (`±6px` movement, `6s` sine loop).
  - Cursor Parallax: Mouse-reactive tilt (`rotateX` max `±8deg`, `rotateY` max `±12deg`) centered on mouse position over the hero container.
- **Non-Interference Rule:** The 3D element MUST remain strictly contained within its dedicated hero canvas space and must NEVER obscure table rows, metric labels, or interactive navigation controls.

---

## 10. Responsive Adaptability

- **Desktop (> 1200px):** Full 3-column overview grid, persistent `260px` left sidebar, expanded analytics charts side-by-side.
- **Tablet / Small Laptop (768px – 1199px):** Sidebar collapses to `72px` icon rail, metric grid shifts to 2 columns, main analytics stack vertically, tables maintain horizontal overflow scroll with sticky first column.
- **Mobile (< 768px):** Sidebar converts to top header bar with brand logo + hamburger trigger opening a full-height Liquid Glass drawer. Dashboard cards stack in single column. Subscription tables render as compact card rows. Modals display as bottom-sheet overlays.

---

*This document serves as the absolute visual blueprint for SPENDR.*
