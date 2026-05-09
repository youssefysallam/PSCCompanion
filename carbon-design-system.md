# Carbon design system
**First responder companion app — design handoff**

This document is the source of truth for the Carbon visual concept. Drop the tokens into your stylesheet, then build components against the specs below. Everything is flat — no shadows, no gradients, no glow filters.

---

## 1. Design language

Graphite surface, raised cards in slightly lighter charcoal, accent colors desaturated toward sage / ember / brick rather than full-saturation safety colors. The interface should read as a piece of professional equipment — closer to a Garmin handheld or a DJI controller than to either a dispatch terminal or an iOS settings screen.

Two restraint rules carry the whole system:
1. **Color lives in icons and accent strokes, never in card fills.** Card backgrounds are always neutral.
2. **The "lit edge" is rare.** Only the current-status hero and the selected status button get a 1.5px colored top border. If it appears everywhere, it stops meaning anything.

---

## 2. Color tokens

Drop into `:root` of your global stylesheet.

```css
:root {
  /* Surfaces */
  --carbon-bg:         #16181c;  /* App background */
  --carbon-surface-1:  #1f2228;  /* Raised cards: hero, incident, selected button, avatar fill */
  --carbon-surface-2:  #1c1f24;  /* Subdued cards: unselected status buttons */
  --carbon-surface-3:  #22262d;  /* Pills, count badges */
  --carbon-border:     #2a2e35;  /* Default hairline */

  /* Text */
  --carbon-text-1:     #e8e8e6;  /* Primary: titles, body, hero status */
  --carbon-text-2:     #9ca0a8;  /* Secondary: menu icons, count badge text */
  --carbon-text-3:     #7d8087;  /* Tertiary: meta, addresses, sub-labels, "since 14:18" */
  --carbon-text-4:     #5a5d63;  /* Disabled: off-duty member role */
  --carbon-nav-idle:   #4a4d54;  /* Inactive bottom-nav icons */

  /* Status accents — desaturated on purpose */
  --carbon-available:  #7eb281;  /* sage */
  --carbon-en-route:   #c69556;  /* ember */
  --carbon-on-scene:   #c46b66;  /* brick */
  --carbon-off-duty:   #7d8087;  /* slate (same as text-3 — intentional) */
  --carbon-info:       #6a8fb8;  /* slate blue — Code 1 / non-urgent */
}
```

**Where each accent gets used:** icon color inside its status button · text color of the status word in the hero · LED top border of the hero (when that status is current) and of the selected button · severity-color left bar on incident cards · avatar ring + status dot on team chips · code-badge text in incident cards.

---

## 3. Typography

Font: native sans-serif system stack (no webfont). Two weights only — **400** for everything that isn't emphasized, **500** for titles, labels, and badges. Never 600 or 700.

| Role               | Size | Weight | Letter-spacing | Color           |
|--------------------|------|--------|----------------|-----------------|
| Hero status        | 30px | 500    | -0.3px         | --carbon-text-1 |
| Page title         | 24px | 500    | -0.2px         | --carbon-text-1 |
| Card title         | 13px | 500    | 0              | --carbon-text-1 |
| Section header     | 13px | 500    | 0              | --carbon-text-1 |
| Button label       | 13px | 500    | 0              | --carbon-text-1 |
| Avatar initials    | 14px | 500    | 0              | accent          |
| Detail / address   | 11px | 400    | 0              | --carbon-text-3 |
| Code badge         | 11px | 500    | 0.3px          | accent          |
| Count badge        | 11px | 500    | 0              | --carbon-text-2 |
| Micro label        | 10px | 400    | 0.4–0.5px      | --carbon-text-3 |
| Avatar role        | 9px  | 400    | 0              | --carbon-text-3 |

Sentence case throughout. No `text-transform: uppercase`. No Title Case.

All numeric displays — timers, "23 min", "12 min", "0.4 mi", "14:18" — get `font-variant-numeric: tabular-nums` so digits don't shift width as values change.

```css
.tabular { font-variant-numeric: tabular-nums; }
```

---

## 4. Spacing

2px grid. The values you'll actually use:

`2 · 4 · 6 · 8 · 10 · 12 · 13 · 14 · 16 · 18 · 20`

Patterns to keep consistent:

| Pattern                            | Value     |
|------------------------------------|-----------|
| Page horizontal — content area     | 16px      |
| Page horizontal — chrome / headers | 20px      |
| Section header padding             | 14px / 8px (top/bottom) |
| Gap between status buttons (grid)  | 8px       |
| Gap between incident cards         | 8px       |
| Card internal padding — compact    | 12–13px   |
| Card internal padding — hero       | 18px 18px 16px |
| Bottom nav padding                 | 12px / 16px (top/bottom) |
| Avatar status-dot offset           | bottom 0, right 1px |

---

## 5. Borders & radii

```css
:root {
  --carbon-radius-card: 13px;     /* Status buttons, incident cards */
  --carbon-radius-hero: 14px;     /* Hero status block */
  --carbon-radius-pill: 999px;    /* Count badges, status dots */
  --carbon-border-hairline: 0.5px solid var(--carbon-border);
}
```

Three border treatments do specific jobs:

1. **Hairline** — `0.5px solid var(--carbon-border)` — every card's default outline.
2. **Lit edge** — `border-top: 1.5px solid var(--carbon-{status})` — applied **only** to the hero and the currently-selected status button. This is the system's signature; spend it sparingly.
3. **Severity bar** — `border-left: 3px solid var(--carbon-{severity})` — applied to every incident card based on call code.

A card never gets both a lit top edge and a severity left bar at once. Status buttons use the lit edge; incident cards use the severity bar. Don't mix them.

---

## 6. Components

Specs assume `box-sizing: border-box`. HTML examples are skeletal — class names are illustrative.

### 6.1 Status hero

The current-status display that sits above the 2x2 grid.

| Property         | Value                                                            |
|------------------|------------------------------------------------------------------|
| Background       | `var(--carbon-surface-1)`                                        |
| Border           | hairline + `border-top: 1.5px solid var(--carbon-{currentStatus})` |
| Radius           | `var(--carbon-radius-hero)`                                      |
| Padding          | `18px 18px 16px`                                                 |
| Margin           | `4px 16px 16px`                                                  |
| Layout           | flex, content + icon, `justify-content: space-between`           |

Inner content stack (`gap` not used; explicit margins):
1. **Mini-label** — "Current status" — 10px / 400 / 0.5px tracking / `--carbon-text-3` / `margin-bottom: 8px`
2. **Status word** — "Available" — 30px / 500 / -0.3px tracking / `--carbon-text-1` / `line-height: 1`
3. **Meta** — "23 min · since 14:18" — 11px / `--carbon-text-3` / `margin-top: 10px` / tabular-nums

Right side: status icon, 26px, color = current-status accent, `margin-top: 4px` so it aligns to the mini-label baseline.

```html
<div class="hero">
  <div>
    <div class="mini">Current status</div>
    <div class="word">Available</div>
    <div class="meta tabular">23 min · since 14:18</div>
  </div>
  <i class="ti ti-circle-check icon-26"></i>
</div>
```

### 6.2 Status button — unselected

| Property        | Value                                          |
|-----------------|------------------------------------------------|
| Background      | `var(--carbon-surface-2)`                      |
| Border          | hairline only (no top accent)                  |
| Radius          | `var(--carbon-radius-card)`                    |
| Aspect ratio    | `1 / 1`                                        |
| Padding         | `13px`                                         |
| Layout          | flex column, `justify-content: space-between`  |

Top: status icon, 22px, status accent color.
Bottom: label (13px / 500 / `--carbon-text-1`) + sub-label (10px / 0.4px tracking / `--carbon-text-3` / `margin-top: 2px`) e.g. "Code 2", "Code 3", "OOS".

### 6.3 Status button — selected

Same as unselected, with three changes:

1. Background → `var(--carbon-surface-1)` (one tier brighter).
2. Top border → `1.5px solid var(--carbon-{thisStatus})`.
3. Top row becomes a flex row containing the icon **and** a 6px accent dot at the far right.
4. Sub-label text becomes "Active" and color becomes the status accent (not `--carbon-text-3`).

```html
<div class="btn btn-selected">
  <div class="row">
    <i class="ti ti-circle-check icon-22 c-available"></i>
    <span class="dot-6 c-available"></span>
  </div>
  <div>
    <div class="label">Available</div>
    <div class="sublabel c-available">Active</div>
  </div>
</div>
```

### 6.4 Incident card

| Property        | Value                                                          |
|-----------------|----------------------------------------------------------------|
| Background      | `var(--carbon-surface-1)`                                      |
| Border          | hairline + `border-left: 3px solid var(--carbon-{severity})`   |
| Radius          | `var(--carbon-radius-card)`                                    |
| Padding         | `12px`                                                         |
| Layout          | flex row, `gap: 12px`, `align-items: center`                   |

Slots, left → right:
1. **Severity icon** — 22px, severity accent color, `flex-shrink: 0`.
2. **Body** — flex column, `flex: 1; min-width: 0`. Title (13px / 500), then address (11px / `--carbon-text-3` / `margin-top: 2px` / `text-overflow: ellipsis`).
3. **Right meta** — text-aligned right. Code badge (11px / 500 / 0.3px tracking / severity accent) over time (10px / `--carbon-text-3` / tabular-nums).

Severity → accent map:

| Code   | Token                  | Used for         |
|--------|------------------------|------------------|
| Code 3 | `--carbon-on-scene`    | Structure fire, lights & sirens |
| Code 2 | `--carbon-en-route`    | Urgent, no lights |
| Code 1 | `--carbon-info`        | Non-urgent / medical assist |

### 6.5 Team member chip

Carousel item. Each chip: `width: 64px; text-align: center; flex-shrink: 0`.

Avatar wrapper — `position: relative; width: 54px; height: 54px; margin: 0 auto`.

Avatar circle:
- 54×54
- `border-radius: 50%`
- background `var(--carbon-surface-1)`
- 1.5px solid border in the member's current-status accent
- initials in 14px / 500, color = same accent

Status dot:
- `position: absolute; bottom: 0; right: 1px`
- 12×12, `border-radius: 50%`
- background = status accent
- `border: 2.5px solid var(--carbon-bg)` — the page-color ring is what makes the dot pop off the avatar without needing a shadow

Below the avatar: name (11px / `margin-top: 6px`) and role (9px / `--carbon-text-3`).

For an off-duty member, wrap the whole chip in `opacity: 0.55` and use `--carbon-border` for both the avatar ring and initials color.

Carousel container:
```css
.carousel { display: flex; gap: 10px; overflow-x: auto; padding: 4px 16px 8px; scrollbar-width: none; }
.carousel::-webkit-scrollbar { display: none; }
```

### 6.6 Section header

Padding `14px 20px 8px`. Flex row with `justify-content: space-between`.

Left: title (13px / 500) + optional count pill.
Right: optional meta text (11px / `--carbon-text-3`).

Count pill:
```css
.count-pill {
  font-size: 11px; font-weight: 500;
  color: var(--carbon-text-2);
  background: var(--carbon-surface-3);
  padding: 2px 8px;
  border-radius: var(--carbon-radius-pill);
}
```

### 6.7 Bottom nav

```css
.bottom-nav {
  display: flex; justify-content: space-around;
  padding: 12px 20px 16px; align-items: center;
  margin-top: auto;
}
.bottom-nav .icon { font-size: 22px; color: var(--carbon-nav-idle); }
.bottom-nav .icon.active { color: var(--carbon-text-1); }
```

No labels under the icons. Active state is color only.

---

## 7. Icons

The mockups use [Tabler outline](https://tabler.io/icons) — clean and weight-matched to the type. Outline only, never filled. Suggested mapping:

| Concept            | Icon                  |
|--------------------|-----------------------|
| Available          | `ti-circle-check`     |
| En route           | `ti-route`            |
| On scene           | `ti-map-pin`          |
| Off duty           | `ti-power`            |
| Structure fire     | `ti-flame`            |
| Vehicle accident   | `ti-car-crash`        |
| Medical            | `ti-heart`            |
| Menu               | `ti-menu-2`           |
| Nav: status home   | `ti-grid-dots`        |
| Nav: team          | `ti-users`            |
| Nav: map           | `ti-map-2`            |

If you swap icon libraries, keep stroke width consistent across the set.

---

## 8. Anti-patterns

- ❌ `box-shadow` on cards. Carbon uses borders and surface contrast, not depth.
- ❌ Gradient backgrounds. (That's the Onyx LED concept, not this one.)
- ❌ Saturated safety colors — `#dc2626`, `#16a34a`, `#f59e0b`. Use the muted tokens.
- ❌ `border-radius` above 14px on cards — pushes toward "iOS app icon" / cartoon territory.
- ❌ Pastel-tinted card fills (e.g. `#fde2e1`). Color stays in icons, accent borders, and status dots — never as a card background.
- ❌ Lit top edge on more than two component types. If you add it to a third, remove it from one.
- ❌ Centered icon-over-label inside the status buttons. The icon-top-left / label-bottom-left layout is what makes them read as controls rather than home-screen tiles.

---

## 9. Tailwind preset (optional)

If your app uses Tailwind, drop this into `tailwind.config.js` to expose the tokens as utilities (`bg-carbon-surface-1`, `text-carbon-text-3`, `border-carbon-available`, etc.):

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        carbon: {
          bg: '#16181c',
          'surface-1': '#1f2228',
          'surface-2': '#1c1f24',
          'surface-3': '#22262d',
          border: '#2a2e35',
          'text-1': '#e8e8e6',
          'text-2': '#9ca0a8',
          'text-3': '#7d8087',
          'text-4': '#5a5d63',
          'nav-idle': '#4a4d54',
          available: '#7eb281',
          'en-route': '#c69556',
          'on-scene': '#c46b66',
          'off-duty': '#7d8087',
          info: '#6a8fb8',
        },
      },
      borderRadius: {
        'carbon-card': '13px',
        'carbon-hero': '14px',
      },
      fontVariantNumeric: {
        tabular: 'tabular-nums',
      },
    },
  },
};
```

---

## 10. Implementation order

A reasonable build sequence for Claude Code:

1. Drop the `:root` block from §2 into your global CSS. Verify dark surface renders correctly.
2. Build the **status button** component first (it's the most reused). Wire selected/unselected as a prop.
3. Build the **status hero** — it shares the lit-edge logic with the selected button.
4. Build the **incident card** — independent of the status components.
5. Build the **team chip** + carousel container.
6. Compose the two pages (status home, team page) using the section header + bottom nav.
7. Replace placeholder data with real bindings.

Steps 2–5 are parallelizable; the page composition in step 6 is the only one with real ordering dependencies.
