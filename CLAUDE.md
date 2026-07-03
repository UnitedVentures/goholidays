# goholidays.lk — Claude Context

## Project
Static HTML/CSS/JS website for **GoHolidays** — the leisure arm of Travel7, a Sri Lankan outbound travel agency.

**Live repo:** https://github.com/UnitedVentures/goholidays.git  
**Local dev server:** `python3 -m http.server 3456` from this directory  
**Preview:** http://localhost:3456

## File Structure
```
index.html          Landing page
japan.html          Full 10-day itinerary page (the reference/complete page)
maldives.html       Placeholder (coming soon)
bali.html           Placeholder (coming soon)
thailand.html       Placeholder (coming soon)
dubai.html          Placeholder (coming soon)
css/
  style.css         Global styles + design system
  itinerary.css     Itinerary & destination page styles
js/
  main.js           Landing page JS
  itinerary.js      Japan/destination page JS
assets/
  fonts/            TAN-NIMBUS.woff + TAN-NIMBUS.ttf (local, licensed)
  images/           logo.png (2655×767 RGBA PNG)
```

## Design System

### Brand Colors
```css
--forest:    #5B6B3A   /* primary dark green */
--forest-dk: #3D4827
--forest-xdk:#252D18
--lime:      #AEC852   /* accent lime */
--lime-lt:   #C8E06B
--lime-dim:  #8FA832
--cream:     #F7F8F2
--cream-dk:  #EEF0E5
```

### Typography Rules (strict — user was explicit about this)
- **TAN-NIMBUS** (local font): `h1`, `h2`, `.display`, destination names, decorative stat numbers, `.footer__col-title`
- **DM Sans bold**: `h3`, `h4` — all card titles, step titles, feature names, prices, form labels
- **Never** put TAN-NIMBUS on card titles, prices, step numbers, or any small/functional text

### Fluid Type Scale
```css
--display-xl: clamp(2.8rem, 6.5vw, 6rem)
--display-lg: clamp(2.2rem, 4.5vw, 4.2rem)
--display-md: clamp(1.8rem, 3.2vw, 2.75rem)
--display-sm: clamp(1.3rem, 2vw, 1.75rem)
```

### Buttons
- Pill shape: `border-radius: 100px`
- `.btn-lime`: gradient `linear-gradient(145deg, #BED660, #AEC852)` with depth shadow
- Hover: `translateY(-3px)` lift + stronger shadow

## Key Implementations

### Currency Toggle (pure CSS — no JS pill)
- LKR ↔ USD toggle in itinerary section
- Rate: 1 USD = LKR 334; rounding: `Math.ceil(lkr / 334 / 50) * 50` (nearest $50)
- Active state via CSS class only — no JS-positioned pill div
- Each price element: `<span class="itin-card__price-val" data-lkr="618000">`

### Parallax Hero
- 3-layer JS parallax using `requestAnimationFrame` (NOT `background-attachment: fixed` — iOS issues)
- Speeds: bg 0.40, mid 0.22, fg 0.14
- Background image: `photo-1476514525535-07fb3b4ae5f1` (mountain lake, pale sky)

### Accordion (japan.html day-by-day)
- CSS `grid-template-rows: 0fr → 1fr` transition (no JS height measurement)
- First day open by default

### Gallery Lightbox (japan.html)
- Masonry 4-col grid
- Keyboard nav: ← → Esc

## Destination Cards → Pages
| Card | Image ID (Unsplash) | Page |
|---|---|---|
| Japan | photo-1545569341-9eb8b30979d9 | japan.html (complete) |
| Maldives | photo-1518548419970-58e3b4079ab2 | maldives.html (placeholder) |
| Bali | photo-1537996194471-e657df975ab4 | bali.html (placeholder) |
| Thailand | photo-1541919329513-35f7af297129 | thailand.html (placeholder) |
| Dubai | photo-1512453979798-5ea266f8880c | dubai.html (placeholder) |

## Logo
- `assets/images/logo.png` — white-rendered via `filter: brightness(0) invert(1)` on dark backgrounds

## YouTube Placeholders (japan.html)
Video IDs `MX0D4oZwCsA`, `H4TcHiFSBno`, `wTW8DToIPlk` are placeholders — user needs to swap these.

## Workflow
- After any edit, stage and push directly to `origin/main`
- Use `git add <specific files>` not `git add -A`
- Verify Unsplash image IDs with `curl -sI "https://images.unsplash.com/photo-<id>" | grep HTTP` before using
