# PSC Companion — Carbon UI + onboarding design spec
**Date:** 2026-05-08
**Branch:** final-ui

---

## 1. Scope

Two parallel workstreams:

1. **Carbon restyling** — apply the Carbon design system tokens to all existing screens. Layouts, navigation structure, scroll behavior, gestures, modals, and all business logic are untouched. Only visual properties change.
2. **Onboarding + login** — new first-time-user flow (splash → 3-screen feature tour → login) that gates entry to the app. Returning users bypass it entirely.

---

## 2. Carbon design tokens

Replace the current `constants/colors.js` with these tokens:

```js
// constants/colors.js — Carbon tokens
export const Colors = {
  // Surfaces
  bg:        '#16181c',
  surface1:  '#1f2228',
  surface2:  '#1c1f24',
  surface3:  '#22262d',
  border:    '#2a2e35',

  // Text
  text1:     '#e8e8e6',
  text2:     '#9ca0a8',
  text3:     '#7d8087',
  text4:     '#5a5d63',
  navIdle:   '#4a4d54',

  // Status accents (desaturated)
  available: '#7eb281',   // sage
  enRoute:   '#c69556',   // ember
  onScene:   '#c46b66',   // brick
  offDuty:   '#7d8087',   // slate
  info:      '#6a8fb8',   // slate blue
};
```

Status → token mapping:
| App status    | Token             |
|---------------|-------------------|
| SAFE          | `Colors.available` |
| EN ROUTE      | `Colors.enRoute`   |
| ON SCENE      | `Colors.onScene`   |
| NEEDS HELP    | `Colors.onScene`   |
| OFFLINE       | `Colors.offDuty`   |

---

## 3. Typography

System sans-serif stack only — no monospace. Two weights: **400** (body) and **500** (titles, labels, badges). Max weight is 500; remove all `fontWeight: '700'` or `'bold'`.

Sentence case throughout — remove all `textTransform: 'uppercase'`. No letter-spacing on labels (remove existing `letterSpacing` overrides except where spec calls for it explicitly).

| Role              | Size | Weight | Letter-spacing |
|-------------------|------|--------|----------------|
| Hero status word  | 30   | 500    | −0.3           |
| Page title        | 24   | 500    | −0.2           |
| Card title        | 13   | 500    | 0              |
| Section header    | 13   | 500    | 0              |
| Button label      | 13   | 500    | 0              |
| Avatar initials   | 14   | 500    | 0              |
| Detail / address  | 11   | 400    | 0              |
| Code badge        | 11   | 500    | 0.3            |
| Count badge       | 11   | 500    | 0              |
| Micro label       | 10   | 400    | 0.4–0.5        |
| Avatar role       | 9    | 400    | 0              |

Numeric displays (timers, distances, times) use `fontVariant: 'tabular-nums'`.

---

## 4. Borders and radii

| Token             | Value                        | Used on                        |
|-------------------|------------------------------|--------------------------------|
| Card radius       | 13                           | Status buttons, incident cards |
| Hero radius       | 14                           | Status hero block              |
| Pill radius       | 999                          | Count badges, status dots      |
| Hairline border   | 0.5px `Colors.border`        | All cards, default outline     |
| Lit edge          | 1.5px top, status accent     | Hero + selected status button only |
| Severity bar      | 3px left, severity accent    | Incident cards only            |

**No `shadowColor`, `shadowOpacity`, `elevation`, or glow effects anywhere.** Remove all existing shadow styles.

---

## 5. Component specs

### Status hero (check-in screen)
- Background: `Colors.surface1`
- Border: 0.5px `Colors.border` + `borderTopWidth: 1.5`, `borderTopColor: Colors[currentStatus]`
- Radius: 14
- Padding: `{ top: 18, horizontal: 18, bottom: 16 }`
- Layout: row, `justifyContent: 'space-between'`
- Left stack: micro-label "Current status" (10/400/text3) → status word (30/500/text1) → meta "X min · since HH:MM" (11/400/text3)
- Right: status icon 26px, status accent color

### Status button — unselected
- Background: `Colors.surface2`
- Border: 0.5px `Colors.border`, no top accent
- Radius: 13, aspect ratio 1:1, padding 13
- Layout: column, `justifyContent: 'space-between'`
- Top: status icon 22px (accent color)
- Bottom: label (13/500/text1) + sub-label (10/400/0.4px/text3) e.g. "Code 2"

### Status button — selected
- Background: `Colors.surface1`
- `borderTopWidth: 1.5`, `borderTopColor: Colors[thisStatus]`
- Top row: icon + 6px accent dot at far right
- Sub-label text: "Active", color = status accent

### Incident card
- Background: `Colors.surface1`
- `borderLeftWidth: 3`, `borderLeftColor: Colors[severity]`
- Hairline on remaining sides
- Radius: 13, padding: 12
- Layout: row, gap 12, `alignItems: 'center'`
- Slots: severity icon (22px) | body (title 13/500, address 11/400/text3) | right meta (code badge 11/500/0.3px/accent, time 10/400/text3)

### Team member chip (carousel)
- Container: 64px wide, centered
- Avatar: 54×54, `borderRadius: 27` (circle), background `Colors.surface1`, 1.5px border = status accent, initials 14/500/accent
- Status dot: 12×12, `borderRadius: 6`, status accent fill, `border: 2.5px Colors.bg`, positioned `bottom: 0, right: 1`
- Name: 11px, `marginTop: 6`; role: 9px `Colors.text3`
- Offline member: `opacity: 0.55`, border + initials color = `Colors.border`

### Section header
- Padding: `{ top: 14, horizontal: 20, bottom: 8 }`
- Layout: row, `justifyContent: 'space-between'`
- Title 13/500 + optional count pill
- Count pill: 11/500/text2, background `Colors.surface3`, padding `{ vertical: 2, horizontal: 8 }`, radius 999

### Page header (all screens)
- Content: hamburger button + page title (14/500/text1)
- No subtitle line
- No live dot
- Border bottom: 0.5px `Colors.border`

### Bottom tab bar
- No labels under icons
- Active icon: `Colors.text1`; inactive: `Colors.navIdle`
- Center check-in button: 44×44 rounded rect (radius 13), background `Colors.surface1`, border 0.5px `Colors.border`, icon `Colors.text1`
- Center button sits level with all other icons — no vertical offset

---

## 6. Icon changes

Library stays `@expo/vector-icons`. The following swap from Ionicons to `MaterialCommunityIcons`. Everything else remains Ionicons.

| Concept              | Old (Ionicons)              | New (MaterialCommunityIcons) |
|----------------------|-----------------------------|------------------------------|
| Check-in tab         | `radio`                     | `radio-tower`                |
| Team (drawer)        | `people`                    | `account-group-outline`      |
| Status: En route     | `arrow-forward-circle`      | `navigation-outline`         |
| Status: On scene     | `eye`                       | `map-marker-outline`         |
| Status: Needs help   | `warning`                   | `alert-circle-outline`       |
| Medical incident     | `medkit`                    | `medical-bag`                |
| Vehicle accident     | `car`                       | `car-emergency`              |
| Map locate/center    | `locate`                    | `crosshairs-gps`             |
| Certifications       | `ribbon`                    | `certificate-outline`        |

`MaterialCommunityIcons` is already available via `@expo/vector-icons` — no new package needed.

---

## 7. Onboarding flow (new screens)

### Package dependency
`@react-native-async-storage/async-storage` is not in the project — must be installed:
```
npx expo install @react-native-async-storage/async-storage
```

### Routing logic
Routing check lives in `app/index.jsx` (currently a plain `<Redirect>`). Replace it with an async check:
- Read AsyncStorage key `'hasLaunched'`
- If absent → `router.replace('/onboarding')`
- If present → `router.replace('/(drawer)/(tabs)/checkin')`
- While checking, render nothing (or a blank `Colors.bg` view)

`app/_layout.jsx` must register the three new screens in its Stack:
```jsx
<Stack.Screen name="onboarding" options={{ headerShown: false }} />
<Stack.Screen name="tour" options={{ headerShown: false }} />
<Stack.Screen name="login" options={{ headerShown: false }} />
```

### New files
```
app/onboarding.jsx           — splash screen
app/tour.jsx                 — 3-screen swipeable feature tour
app/login.jsx                — login form
```

### Splash screen (`/onboarding`)
- Full `Colors.bg` background
- Centered column: app icon (72×72, radius 18, `Colors.surface1`/border), app name (22/500), tagline (12/400/text3)
- Progress dots: 3 dots, first active (pill shape 16px wide, `Colors.text2`), rest 5px circles (`Colors.border`)
- "Get started" button: full-width, 44px, `Colors.surface1`, radius 13, 13/500
- On press → navigate to `/tour`

### Feature tour (`/tour`)
- Horizontal `FlatList` with `horizontal`, `pagingEnabled`, `showsHorizontalScrollIndicator: false`, `scrollEnabled: false` (navigation driven by the Next button, not free-scroll)
- Each page: "Skip" (top-right, 12/400/text3) | art area (flex: 1) | copy block (title 18/500, desc 12/400/text3, 1.6 line height)
- Copy block bottom: progress dots (same pill style) + "Next" / "Sign in" pill button (36px, radius 999)
- Page 1 art: mini status hero + 2×2 button grid preview
- Page 2 art: ICS banner + map placeholder + controls row
- Page 3 art: 3 alert rows (critical → warning → info)
- Last page button reads "Sign in", routes to `/login`
- Skip routes directly to `/login`

### Login screen (`/login`)
- Logo row: 36×36 icon (radius 9) + app name (15/500)
- Title "Sign in" (22/500, −0.2 spacing)
- Subtitle: "Enter your badge ID and password to access the field operations system." (12/400/text3)
- Field label style: 10/500/text3, 0.4 letter-spacing
- Two fields (Badge ID, Password): 44px, `Colors.surface1`, 0.5px border, radius 11, icon (16px/text3) + text input
- "Sign in" button: 46px, `Colors.surface1`, 0.5px border, radius 13, icon + label
- "Forgot your password? Contact your supervisor." (11/400/text3, centered)
- Footer (pushed to bottom): "PSC Companion v1.0 · For authorized personnel only" (10/400/text4)
- On submit (any credentials, no validation): set AsyncStorage key `'hasLaunched'` to `'true'` → `router.replace('/(drawer)/(tabs)/checkin')` (replace, not push — back button must not return to login)

---

## 8. What does NOT change

- All screen layouts (padding, scroll axes, flex structure)
- All navigation structure (drawer, tabs, stack)
- All gestures (swipe-to-acknowledge, pan filter sheet)
- All modals (incident detail, man-down alert, filter panel)
- All business logic and state management
- All mock data (`constants/mockData.js`)
- All animation logic (Reanimated)
- The `CheckInPanel` component behavior
- Map functionality, hazard zones, filter logic

---

## 9. Implementation order

1. Create `final-ui` branch
2. Update `constants/colors.js` with Carbon tokens
3. Restyle `constants/mockData.js` StatusStyles to use new tokens
4. Restyle components: `Avatar`, `StatusBadge`, `SignalBars`, `IncidentCard`, `TeamMemberRow`, `HamburgerButton`
5. Restyle all 5 screens: `checkin`, `alerts`, `index` (dashboard), `map`, `profile`
6. Update drawer layout and tab bar layout (header cleanup, tab bar alignment)
7. Build onboarding screens: `splash`, `tour`, `login`
8. Wire routing logic in root `_layout.jsx`
