// Pure helpers for the Air Quality Card.
//
// Math, threshold tables, and translation strings - no DOM, no
// dependencies. Imported by both the card and the test suite.

import type {
  AqiBand,
  ScoreBand,
  ScoreResult,
  ThresholdResult,
} from './types.js';

// Pollutant tile thresholds: { good, mod, high } in the sensor's native unit.
// Sources:
//   PM1   - WHO 2021 AQG (no formal limit; values aligned with PM2.5 short-term band)
//   PM2.5 - US EPA NAAQS: 12 ug/m3 annual, 35 ug/m3 24-hour, ~75 ug/m3 unhealthy
//   PM4   - extrapolated between PM2.5 and PM10 (no formal standard)
//   PM10  - WHO 2021 AQG 24-hour 50 ug/m3, US EPA NAAQS 24-hour 150 ug/m3
//   VOC   - Sensirion VOC Index (0-500, baseline 100). NOT valid for TVOC sensors
//           reporting ppb or ug/m3 - see issue tracker for the open discussion.
//   CO2   - ASHRAE 62.1 ventilation guidance ~1000 ppm, Harvard COGfx cognitive
//           impact threshold ~2000 ppm
export const POLLUTANT_THRESHOLDS = {
  pm1:  { good: 10,  mod: 25,   high: 50   },
  pm25: { good: 12,  mod: 35,   high: 75   },
  pm4:  { good: 20,  mod: 50,   high: 100  },
  pm10: { good: 50,  mod: 150,  high: 250  },
  voc:  { good: 100, mod: 200,  high: 300  },
  co2:  { good: 800, mod: 1200, high: 2000 },
} as const;

// US EPA AirNow AQI bands (https://www.airnow.gov/aqi/aqi-basics/).
//   color: bright tint for the ring, chip background, dot, tile bars
//   text:  darker variant used wherever the band color is foreground text
// Both are exposed as CSS custom properties so users can override them
// in their theme YAML, card_mod, or :host overrides. Defaults: Tailwind
// 200/300 (color) and 600 (text). The text variants give ~4:1 contrast
// on light theme where the bright tints fail WCAG AA.
export const AQI_BANDS: AqiBand[] = [
  { max: 50,       color: 'var(--air-quality-card-good-color, #86efac)',           text: 'var(--air-quality-card-good-text, #16a34a)',           label: 'Good',           advice: 'Air quality is satisfactory.' },
  { max: 100,      color: 'var(--air-quality-card-moderate-color, #fde68a)',       text: 'var(--air-quality-card-moderate-text, #ca8a04)',       label: 'Moderate',       advice: 'Acceptable air quality.' },
  { max: 150,      color: 'var(--air-quality-card-unhealthy-sg-color, #fdba74)',   text: 'var(--air-quality-card-unhealthy-sg-text, #ea580c)',   label: 'Unhealthy (SG)', advice: 'Sensitive groups may be affected.' },
  { max: 200,      color: 'var(--air-quality-card-unhealthy-color, #fca5a5)',      text: 'var(--air-quality-card-unhealthy-text, #dc2626)',      label: 'Unhealthy',      advice: 'Everyone may experience health effects.' },
  { max: 300,      color: 'var(--air-quality-card-very-unhealthy-color, #d8b4fe)', text: 'var(--air-quality-card-very-unhealthy-text, #9333ea)', label: 'V. Unhealthy',   advice: 'Health alert: risk is increased.' },
  { max: Infinity, color: 'var(--air-quality-card-hazardous-color, #fda4af)',      text: 'var(--air-quality-card-hazardous-text, #e11d48)',      label: 'Hazardous',      advice: 'Emergency health warning.' },
];

// Internal score-mode bands (lower is worse, 0-100 scale). Colors map
// to the same custom-property family as AQI_BANDS for consistency.
export const SCORE_BANDS: ScoreBand[] = [
  { min: 80,        color: 'var(--air-quality-card-good-color, #86efac)',     text: 'var(--air-quality-card-good-text, #16a34a)',     label: 'Good',     advice: 'Air quality is good' },
  { min: 60,        color: 'var(--air-quality-card-moderate-color, #fde68a)', text: 'var(--air-quality-card-moderate-text, #ca8a04)', label: 'Moderate', advice: 'Air quality is moderate' },
  { min: 40,        color: 'var(--air-quality-card-poor-color, #fdba74)',     text: 'var(--air-quality-card-poor-text, #ea580c)',     label: 'Poor',     advice: 'Consider ventilating' },
  { min: -Infinity, color: 'var(--air-quality-card-bad-color, #fca5a5)',      text: 'var(--air-quality-card-bad-text, #dc2626)',      label: 'Bad',      advice: 'Ventilate now' },
];

// Translatable strings for the card-rendered UI. Translators can add a
// new top-level key (e.g. STRINGS.de) mirroring the 'en' shape and the
// card will pick it up automatically based on hass.locale.language.
// AQI/score band labels and advice stay on the band tables themselves
// for now; localizing those is a separate, larger pass.
export const STRINGS: Record<string, Record<string, unknown>> = {
  en: {
    topName: { aqi: 'AQI Sensor', score: 'Calculated Score' },
    subtitle: 'Climate · Air Quality',
    ring: { aqi: 'AQI', score: 'SCORE' },
    stats: { temp: 'TEMP', humidity: 'HUMIDITY' },
    advice: {
      vocHigh:     'VOCs detected',
      co2High:     'CO2 high - open a window',
      co2VeryHigh: 'CO2 very high - ventilate',
    },
  },
};

// Look up a dotted-path key from STRINGS for the given language, falling
// back to English when the path isn't present. e.g. translate('stats.temp', 'es').
export function translate(path: string, lang = 'en'): string {
  const lookup = (table: Record<string, unknown> | undefined): string | undefined => {
    const result = path.split('.').reduce<unknown>(
      (o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined),
      table,
    );
    return typeof result === 'string' ? result : undefined;
  };
  return lookup(STRINGS[lang]) ?? lookup(STRINGS.en) ?? path;
}

// Pollutant tile threshold lookup.
//   color = bright tint for bar fill, text = readable on both themes.
// Both routed through CSS custom properties (defaults match the band
// tables above).
export function calcThreshold(
  value: number | null,
  good: number,
  mod: number,
  high: number,
): ThresholdResult {
  if (value == null) return { label: '--',     color: 'var(--divider-color, #444)', text: 'var(--secondary-text-color)', pct: 0 };
  if (value <= good) return { label: 'GOOD',   color: 'var(--air-quality-card-good-color, #86efac)',         text: 'var(--air-quality-card-good-text, #16a34a)',         pct: Math.min(100, (value / high) * 100) };
  if (value <= mod)  return { label: 'MOD',    color: 'var(--air-quality-card-moderate-color, #fde68a)',     text: 'var(--air-quality-card-moderate-text, #ca8a04)',     pct: Math.min(100, (value / high) * 100) };
  if (value <= high) return { label: 'HIGH',   color: 'var(--air-quality-card-unhealthy-sg-color, #fdba74)', text: 'var(--air-quality-card-unhealthy-sg-text, #ea580c)', pct: Math.min(100, (value / high) * 100) };
  return                    { label: 'V.HIGH', color: 'var(--air-quality-card-unhealthy-color, #fca5a5)',    text: 'var(--air-quality-card-unhealthy-text, #dc2626)',    pct: 100 };
}

// Computes the calculated-score-mode headline state from the three
// contributing pollutants. Each pollutant contributes a penalty fraction
// in [0, 1] times its weight. Missing pollutants are dropped and the
// remaining weights renormalize to 100, so a partial sensor set still
// spans 0-100 instead of getting an artificial ceiling.
//
// Divisor calibration (the value at which a pollutant's penalty saturates):
//   PM2.5 75 ug/m3 -> US EPA "Unhealthy for Sensitive Groups" boundary
//   VOC   500      -> Sensirion VOC Index ceiling (full scale)
//   CO2   2200 ppm above 400 baseline -> Harvard COGfx cognitive impact threshold
//
// Returns: { score, label, color, text, advice, pct } where score is null
// when no pollutants are present (empty-state).
interface ComputeScoreInput {
  pm25?: number | null;
  voc?: number | null;
  co2?: number | null;
}

export function computeScore({ pm25, voc, co2 }: ComputeScoreInput): ScoreResult {
  const pollutants = [
    { value: pm25, divisor: 75,   weight: 40 },
    { value: voc,  divisor: 500,  weight: 25 },
    { value: co2 != null ? co2 - 400 : null, divisor: 2200, weight: 35 },
  ].filter((p): p is { value: number; divisor: number; weight: number } => p.value != null);

  if (pollutants.length === 0) {
    return {
      score: null,
      label: 'No data',
      color: 'var(--air-quality-card-no-data-color, #9ca3af)',
      text: 'var(--secondary-text-color)',
      advice: 'Configure PM2.5, VOC, or CO₂ sensors to see a calculated score.',
      pct: 0,
    };
  }

  const totalWeight = pollutants.reduce((s, p) => s + p.weight, 0);
  const totalPenalty = pollutants.reduce((s, p) => {
    const frac = Math.min(1, Math.max(0, p.value / p.divisor));
    return s + frac * (p.weight / totalWeight) * 100;
  }, 0);
  const score = Math.min(100, Math.max(0, Math.round(100 - totalPenalty)));
  const band = SCORE_BANDS.find(b => score >= b.min)!;

  return {
    score,
    label: band.label,
    color: band.color,
    text: band.text,
    advice: band.advice,
    pct: score / 100,
  };
}
