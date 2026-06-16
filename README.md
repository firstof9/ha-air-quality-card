# Air Quality Card

[![GitHub Release](https://img.shields.io/github/v/release/firstof9/ha-air-quality-card?style=for-the-badge)](https://github.com/firstof9/ha-air-quality-card/releases)
[![GitHub Downloads](https://img.shields.io/github/downloads/firstof9/ha-air-quality-card/total?style=for-the-badge)](https://github.com/firstof9/ha-air-quality-card/releases)
[![CI](https://img.shields.io/github/actions/workflow/status/firstof9/ha-air-quality-card/lint.yml?branch=main&label=CI&style=for-the-badge)](https://github.com/firstof9/ha-air-quality-card/actions/workflows/lint.yml)
[![HACS Badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://github.com/hacs/integration)
[![License](https://img.shields.io/github/license/firstof9/ha-air-quality-card?style=for-the-badge)](https://github.com/firstof9/ha-air-quality-card/blob/main/LICENSE)

A modern, highly customizable air quality card for Home Assistant with support for multiple pollutants, climate trends, and an interactive expand/collapse feature.

## Screenshots

### Expanded View
![Expanded State](screenshots/expanded.png)

### Collapsed View
![Collapsed State](screenshots/collapsed.png)

### Visual Configuration
![Configuration Editor](screenshots/config.png)

## Requirements

This card optionally uses [mini-graph-card](https://github.com/kalkih/mini-graph-card) to display temperature and humidity trend graphs. **The card will function normally without it**, but the trend graphs will not be displayed.

A temperature or humidity entity that has no recorder history (e.g. it's excluded from the `recorder:` integration) is skipped in the trend graph automatically, so the graph never hangs waiting on data that will never arrive. If neither temperature nor humidity has recorded history, the graph is hidden entirely.

## Installation

### HACS (Recommended)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=firstof9&repository=ha-air-quality-card&category=plugin)

1. Open HACS.
2. Click on "Frontend".
3. Click on the three dots in the top right corner and select "Custom repositories".
4. Add `https://github.com/firstof9/ha-air-quality-card` with category "Lovelace".
5. Search for "Air Quality Card" and click "Download".

### Manual

1. Download `air-quality-card.js` from the latest release (it's a single self-contained bundle).
2. Copy it to your `config/www/` directory.
3. Add the following to your `configuration.yaml` or through the UI:
   ```yaml
   resources:
     - url: /local/air-quality-card.js
       type: module
   ```

## Usage

```yaml
type: custom:air-quality-card
title: Living Room
aqi_entity: sensor.air_quality_index # Optional: If not provided, a score will be calculated from available pollutants
temp_entity: sensor.living_room_temperature
humid_entity: sensor.living_room_humidity
pm25_entity: sensor.living_room_pm2_5
pm10_entity: sensor.living_room_pm10
# Optional: pm1_entity, pm4_entity, voc_entity, co2_entity, default_expanded
```

## Advanced configuration

### Custom VOC / NOx thresholds and baselines

By default the card uses Sensirion's official VOC Index and NOx Index bands when no `unit_of_measurement` indicates ppb / µg/m³ / ppm:

| Pollutant | Band | Good | Moderate | High | Baseline (no-event floor) |
|---|---|---|---|---|---|
| VOC Index | `voc_index` | ≤ 100 | ≤ 250 | ≤ 350 | 100 |
| NOx Index | `nox_index` | ≤ 1 | ≤ 20 | ≤ 50 | 1 |

The baseline is the value the Sensirion adaptive algorithm settles on under "clean" conditions. A reading at the baseline contributes no penalty to the calculated score, so a healthy sensor parks at 100.

If you are using a non-Sensirion sensor, a custom index scale (e.g. 0-5 or 0-100), or you want to retune the bands, override them per card:

```yaml
type: custom:air-quality-card
voc_entity: sensor.my_custom_voc
voc_thresholds:
  good: 50
  mod: 100
  high: 150
voc_baseline: 10        # optional; defaults to 0 when voc_thresholds is set
nox_entity: sensor.my_custom_nox
nox_thresholds:
  good: 10
  mod: 20
  high: 30
nox_baseline: 0         # optional
```

When `voc_thresholds` / `nox_thresholds` are provided, the corresponding baseline defaults to `0` (no offset) unless you set `voc_baseline` / `nox_baseline` explicitly. When the thresholds are left at the defaults, the Sensirion-derived baselines (100 / 1) are used automatically.

References: [Sensirion VOC Index for Experts](https://sensirion.com/media/documents/02232963/6294E043/Info_Note_VOC_Index.pdf), [Sensirion NOx Index](https://sensirion.com/media/documents/9F289B95/6294DFFC/Info_Note_NOx_Index.pdf).

## Theming

The card's band colors are exposed as CSS custom properties so you can override them in your HA theme YAML, in `card_mod`, or via any other CSS injection method.

Each band has two variants:

- **`-color`** is the bright tint used for the ring stroke, chip background, dot, and pollutant-tile bar fill. Defaults match Tailwind 200/300.
- **`-text`** is a darker variant used wherever the band color appears as foreground text (headline, chip label, ring-center label, tile threshold label). Defaults are Tailwind 600 — they hit ~4:1 contrast on light theme where the bright tints fail WCAG AA.

| Property | Default `-color` / `-text` | Used for |
|---|---|---|
| `--air-quality-card-good-{color,text}` | `#86efac` / `#16a34a` | "Good" band (AQI ≤ 50, score ≥ 80) |
| `--air-quality-card-moderate-{color,text}` | `#fde68a` / `#ca8a04` | "Moderate" band |
| `--air-quality-card-unhealthy-sg-{color,text}` | `#fdba74` / `#ea580c` | "Unhealthy for Sensitive Groups" / pollutant tile "HIGH" |
| `--air-quality-card-unhealthy-{color,text}` | `#fca5a5` / `#dc2626` | "Unhealthy" / pollutant tile "V.HIGH" |
| `--air-quality-card-very-unhealthy-{color,text}` | `#d8b4fe` / `#9333ea` | "V. Unhealthy" (AQI mode) |
| `--air-quality-card-hazardous-{color,text}` | `#fda4af` / `#e11d48` | "Hazardous" (AQI mode) |
| `--air-quality-card-poor-{color,text}` | `#fdba74` / `#ea580c` | "Poor" (score mode) |
| `--air-quality-card-bad-{color,text}` | `#fca5a5` / `#dc2626` | "Bad" (score mode) |
| `--air-quality-card-no-data-color` | `#9ca3af` | Empty-state ring + chip |

Example theme override:

```yaml
my_theme:
  air-quality-card-good-color: "#10b981"
  air-quality-card-good-text:  "#047857"
  air-quality-card-hazardous-color: "#7c2d12"
```

## Development

The card is written in TypeScript with [Lit](https://lit.dev) and bundled with [Rollup](https://rollupjs.org). Source lives in `src/`; the committed `air-quality-card.js` at the repo root is the bundled output.

```bash
npm install        # install dev deps + lit
npm run typecheck  # tsc --noEmit (no JS emit, just type checking)
npm test           # run unit tests for the pure helpers
npm run build      # produce air-quality-card.js from src/
npm run build:watch  # rebuild on every save while iterating
```

CI runs `typecheck`, `build`, and `test` on every PR. The `build` job also fails CI if the committed bundle is out of sync with source.
