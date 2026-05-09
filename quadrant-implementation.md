# Quadrant logo — implementation kit

Everything you need to wire the Quadrant mark into the app as both the application icon and the animated splash screen.

This guide assumes the Carbon design system is already in place (`--carbon-bg: #16181c`, `--carbon-available: #7eb281`).

---

## 1. The mark (drop-in SVG)

Save as `assets/quadrant-logo.svg` (or wherever your project keeps assets). The outlines use `currentColor` so the same file works on dark and light surfaces — just set `color` on the parent.

```svg
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quadrant logo">
  <rect x="20" y="20" width="26" height="26" rx="4" fill="#7eb281"/>
  <rect x="54" y="20" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
  <rect x="20" y="54" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
  <rect x="54" y="54" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
</svg>
```

**Stroke widths at small sizes** — the 2.5 stroke is calibrated for ≥48px. Below that, bump it:

| Render size | stroke-width |
|------------|--------------|
| 16 px      | 5            |
| 24 px      | 4            |
| 32 px      | 3.5          |
| 48 px      | 3            |
| ≥ 64 px    | 2.5          |

For app-icon and splash use cases (always ≥120px), the default 2.5 is correct.

---

## 2. App icon

Master file at 1024×1024 with the dark squircle background. All platform-specific sizes get exported from this.

```svg
<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Quadrant app icon">
  <rect width="1024" height="1024" rx="180" fill="#16181c"/>
  <g transform="translate(112 112) scale(8)">
    <rect x="20" y="20" width="26" height="26" rx="4" fill="#7eb281"/>
    <rect x="54" y="20" width="26" height="26" rx="4" fill="none" stroke="#e8e8e6" stroke-width="2.5"/>
    <rect x="20" y="54" width="26" height="26" rx="4" fill="none" stroke="#e8e8e6" stroke-width="2.5"/>
    <rect x="54" y="54" width="26" height="26" rx="4" fill="none" stroke="#e8e8e6" stroke-width="2.5"/>
  </g>
</svg>
```

### Export targets

| Platform | Sizes (px) | Notes |
|----------|------------|-------|
| iOS App Store | 1024×1024 | No transparency, no rounding (Apple rounds) |
| iOS app sizes | 20, 29, 40, 60, 76, 83.5 — at @1x/@2x/@3x | Generated from the master |
| Android Play Store | 512×512 | PNG, no transparency |
| Android adaptive | foreground 432×432 + background 432×432 | Background = solid `#16181c`; foreground = the four rects only (no squircle) |
| Web favicon | 16, 32, 48 (favicon.ico) + 192, 512 (PWA) | SVG also works in modern browsers |
| Apple touch icon | 180×180 | iOS home-screen for web apps |

### Generating sizes

Pick whichever fits your stack:

- **icon.kitchen** (web tool) — drag in the 1024 PNG, downloads everything zipped.
- **`react-native-bootsplash`** for bare React Native: `npx react-native generate-bootsplash assets/icon-1024.png --background-color=16181C`
- **`flutter_launcher_icons`** for Flutter (yaml config).
- **`pwa-asset-generator`** (npm) for web/PWA.

Or hand-roll with ImageMagick:

```bash
magick quadrant-app-icon.svg -resize 1024x1024 icon-1024.png
for size in 512 192 180 167 152 128 87 80 60 58 40 29 20; do
  magick icon-1024.png -resize ${size}x${size} icon-${size}.png
done
```

---

## 3. Animated splash screen

### Design spec

| Element        | Value                                          |
|----------------|------------------------------------------------|
| Background     | `#16181c` (full bleed)                         |
| Logo size      | ~25% of screen height, centered                |
| Animation      | Cells fade in clockwise from top-left          |
| Per-cell fade  | 320 ms · ease-out                              |
| Stagger        | 320 ms (cells appear back-to-back, no overlap) |
| Total build    | 1.44 s                                         |
| Hold           | Final frame holds until app dismisses splash   |

### Animation order

| Cell           | Position     | Fade starts | Fully visible |
|----------------|--------------|-------------|---------------|
| 1 (sage fill)  | top-left     | 0.16 s      | 0.48 s        |
| 2 (outline)    | top-right    | 0.48 s      | 0.80 s        |
| 3 (outline)    | bottom-right | 0.80 s      | 1.12 s        |
| 4 (outline)    | bottom-left  | 1.12 s      | 1.44 s        |

The 0.16s lead-in before the first cell appears gives the splash a "breath" so it doesn't feel abrupt.

### Web (HTML/CSS)

```css
@keyframes q-build-1 { 0%, 11% { opacity: 0; } 33%, 100% { opacity: 1; } }
@keyframes q-build-2 { 0%, 33% { opacity: 0; } 56%, 100% { opacity: 1; } }
@keyframes q-build-3 { 0%, 56% { opacity: 0; } 78%, 100% { opacity: 1; } }
@keyframes q-build-4 { 0%, 78% { opacity: 0; } 100% { opacity: 1; } }

.q-build-1 { animation: q-build-1 1.44s ease-out forwards; opacity: 0; }
.q-build-2 { animation: q-build-2 1.44s ease-out forwards; opacity: 0; }
.q-build-3 { animation: q-build-3 1.44s ease-out forwards; opacity: 0; }
.q-build-4 { animation: q-build-4 1.44s ease-out forwards; opacity: 0; }

.splash {
  position: fixed; inset: 0;
  background: #16181c;
  display: flex; align-items: center; justify-content: center;
  z-index: 9999;
  transition: opacity 300ms ease-out;
}
.splash.hidden { opacity: 0; pointer-events: none; }
```

```html
<div class="splash" id="splash">
  <svg viewBox="0 0 100 100" width="160" height="160" style="color: #e8e8e6;">
    <rect class="q-build-1" x="20" y="20" width="26" height="26" rx="4" fill="#7eb281"/>
    <rect class="q-build-2" x="54" y="20" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <rect class="q-build-3" x="54" y="54" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
    <rect class="q-build-4" x="20" y="54" width="26" height="26" rx="4" fill="none" stroke="currentColor" stroke-width="2.5"/>
  </svg>
</div>
```

When the app is ready, fade out and remove:

```js
async function bootstrap() {
  await initApp();
  const splash = document.getElementById('splash');
  splash.classList.add('hidden');
  setTimeout(() => splash.remove(), 300);
}
bootstrap();
```

`forwards` fill mode keeps the final state after the build animation completes — the logo just sits there until you trigger the fade-out.

### React Native (Expo)

Each cell goes in its own SVG so the wrapping `Animated.View` can use the native driver for the opacity transform.

```jsx
import { Animated, View, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useEffect, useRef } from 'react';

export function SplashLogo({ size = 160 }) {
  const fades = useRef(Array.from({ length: 4 }, () => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.stagger(
      320,
      fades.map(f =>
        Animated.timing(f, { toValue: 1, duration: 320, useNativeDriver: true })
      )
    ).start();
  }, []);

  const cells = [
    { x: 20, y: 20, fill: '#7eb281', stroke: 'none' },
    { x: 54, y: 20, fill: 'none', stroke: '#e8e8e6' },
    { x: 54, y: 54, fill: 'none', stroke: '#e8e8e6' },
    { x: 20, y: 54, fill: 'none', stroke: '#e8e8e6' },
  ];

  return (
    <View style={{ width: size, height: size }}>
      {cells.map((c, i) => (
        <Animated.View key={i} style={[StyleSheet.absoluteFill, { opacity: fades[i] }]}>
          <Svg viewBox="0 0 100 100" width={size} height={size}>
            <Rect x={c.x} y={c.y} width="26" height="26" rx="4"
                  fill={c.fill} stroke={c.stroke} strokeWidth="2.5" />
          </Svg>
        </Animated.View>
      ))}
    </View>
  );
}
```

Wire into Expo's splash flow:

```jsx
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { SplashLogo } from './SplashLogo';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    (async () => {
      await loadFonts();
      await loadInitialData();
      setAppReady(true);
    })();
  }, []);

  useEffect(() => {
    if (appReady) SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#16181c', alignItems: 'center', justifyContent: 'center' }}>
        <SplashLogo />
      </View>
    );
  }

  return <YourActualApp />;
}
```

The Expo native splash dismisses immediately, your `<SplashLogo />` plays its build, and the final frame holds while `loadFonts()` / `loadInitialData()` finish. Configure the native splash in `app.json` to match the bg so there's no flash:

```json
{
  "expo": {
    "splash": {
      "backgroundColor": "#16181c",
      "resizeMode": "contain"
    }
  }
}
```

### Flutter

```dart
import 'package:flutter/material.dart';

class SplashLogo extends StatefulWidget {
  final double size;
  const SplashLogo({this.size = 160, super.key});
  @override State<SplashLogo> createState() => _SplashLogoState();
}

class _SplashLogoState extends State<SplashLogo> with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late List<Animation<double>> _fades;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1440),
    );
    _fades = List.generate(4, (i) => CurvedAnimation(
      parent: _controller,
      curve: Interval(i * 0.222 + 0.111, (i + 1) * 0.222 + 0.111, curve: Curves.easeOut),
    ));
    _controller.forward();
  }

  @override
  void dispose() { _controller.dispose(); super.dispose(); }

  @override
  Widget build(BuildContext context) {
    final scale = widget.size / 100;
    return SizedBox(
      width: widget.size, height: widget.size,
      child: Stack(children: [
        FadeTransition(opacity: _fades[0], child: _box(20, 20, scale, fill: const Color(0xFF7EB281))),
        FadeTransition(opacity: _fades[1], child: _box(54, 20, scale)),
        FadeTransition(opacity: _fades[2], child: _box(54, 54, scale)),
        FadeTransition(opacity: _fades[3], child: _box(20, 54, scale)),
      ]),
    );
  }

  Widget _box(double x, double y, double scale, {Color? fill}) => Positioned(
    left: x * scale, top: y * scale,
    width: 26 * scale, height: 26 * scale,
    child: Container(
      decoration: BoxDecoration(
        color: fill,
        border: fill == null ? Border.all(color: const Color(0xFFE8E8E6), width: 2.5) : null,
        borderRadius: BorderRadius.circular(4 * scale),
      ),
    ),
  );
}
```

Pair with the `flutter_native_splash` package (configured for the static `#16181c` bg) so the app launches into a matching color before `SplashLogo` mounts.

### iOS native (SwiftUI)

```swift
struct SplashLogo: View {
    @State private var visible = [false, false, false, false]
    private let bg = Color(red: 0.086, green: 0.094, blue: 0.110)
    private let stroke = Color(red: 0.91, green: 0.91, blue: 0.90)
    private let sage = Color(red: 0.494, green: 0.698, blue: 0.506)

    var body: some View {
        ZStack {
            bg.ignoresSafeArea()
            ZStack {
                cell(x: 20, y: 20, fill: sage).opacity(visible[0] ? 1 : 0)
                cell(x: 54, y: 20).opacity(visible[1] ? 1 : 0)
                cell(x: 54, y: 54).opacity(visible[2] ? 1 : 0)
                cell(x: 20, y: 54).opacity(visible[3] ? 1 : 0)
            }
            .frame(width: 160, height: 160)
        }
        .onAppear {
            for i in 0..<4 {
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.16 + Double(i) * 0.32) {
                    withAnimation(.easeOut(duration: 0.32)) { visible[i] = true }
                }
            }
        }
    }

    private func cell(x: CGFloat, y: CGFloat, fill: Color? = nil) -> some View {
        let scale: CGFloat = 1.6
        return RoundedRectangle(cornerRadius: 4 * scale)
            .fill(fill ?? .clear)
            .overlay(
                RoundedRectangle(cornerRadius: 4 * scale)
                    .strokeBorder(fill == nil ? stroke : .clear, lineWidth: 2.5)
            )
            .frame(width: 26 * scale, height: 26 * scale)
            .position(x: (x + 13) * scale, y: (y + 13) * scale)
    }
}
```

Set `LaunchScreen.storyboard` background to `#16181C` so the OS launch frame matches.

### Android (Jetpack Compose)

```kotlin
@Composable
fun SplashLogo(size: Dp = 160.dp) {
    val visible = remember { List(4) { mutableStateOf(false) } }

    LaunchedEffect(Unit) {
        delay(160)
        repeat(4) { i ->
            visible[i].value = true
            delay(320)
        }
    }

    Box(modifier = Modifier.fillMaxSize().background(Color(0xFF16181C)),
        contentAlignment = Alignment.Center) {
        Box(modifier = Modifier.size(size)) {
            QuadrantCell(20.dp, 20.dp, size, fill = Color(0xFF7EB281), visible = visible[0].value)
            QuadrantCell(54.dp, 20.dp, size, visible = visible[1].value)
            QuadrantCell(54.dp, 54.dp, size, visible = visible[2].value)
            QuadrantCell(20.dp, 54.dp, size, visible = visible[3].value)
        }
    }
}

@Composable
fun QuadrantCell(x: Dp, y: Dp, parentSize: Dp, fill: Color? = null, visible: Boolean) {
    val alpha by animateFloatAsState(
        targetValue = if (visible) 1f else 0f,
        animationSpec = tween(durationMillis = 320, easing = FastOutSlowInEasing),
        label = "cell-fade"
    )
    val scale = parentSize.value / 100f
    Box(modifier = Modifier
        .offset(x = x * scale, y = y * scale)
        .size(26.dp * scale)
        .alpha(alpha)
        .clip(RoundedCornerShape(4.dp * scale))
        .let { if (fill != null) it.background(fill)
               else it.border(2.5.dp, Color(0xFFE8E8E6), RoundedCornerShape(4.dp * scale)) }
    )
}
```

Pair with the Android 12+ `SplashScreen` API (`themes.xml`) set to `windowSplashScreenBackground = #16181C` so the system launch frame matches before Compose mounts.

---

## 4. Asset checklist

- [ ] `quadrant-logo.svg` saved to assets folder
- [ ] `quadrant-app-icon.svg` saved as the master
- [ ] App icon raster sizes generated (per platform table in §2)
- [ ] Platform native splash bg set to `#16181c`
- [ ] Animated splash component built per §3
- [ ] App initialization triggers splash dismissal
- [ ] Verified the splash holds — not unmounting prematurely

---

## 5. Brief for Claude Code

When you start the implementation, paste this:

> Implement the Quadrant logo and animated splash screen per `quadrant-implementation.md`.
>
> Platform: **[your platform — web / Expo / bare RN / Flutter / iOS / Android]**
>
> 1. Save `quadrant-logo.svg` (§1) into the assets folder.
> 2. Generate platform-specific app icon sizes from `quadrant-app-icon.svg` (§2).
> 3. Build the animated splash component using the snippet for my platform in §3.
> 4. Wire it into the app's launch flow so the final logo frame holds until app initialization completes, then fades out over 300 ms.
>
> The Carbon design tokens (`#16181c` bg, `#7eb281` sage, `#e8e8e6` text) come from the existing design system.

---

## 6. Tuning the animation

If the build feels too slow or too fast, tune these two numbers together:

- **Per-cell fade duration** — 320 ms is the default. Drop to 240 ms for snappier, push to 400 ms for more elegance. Keep it under 500 ms or the splash starts feeling sluggish.
- **Stagger** — equal to fade duration (no overlap). If you want overlap, set stagger to ~70% of fade duration so cells start appearing while the previous is still finishing.

Total build = 0.16 s lead-in + 4 × stagger.
