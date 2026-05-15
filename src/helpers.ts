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
export const POLLUTANT_THRESHOLDS = {
  pm1:  { good: 10,  mod: 25,   high: 50   },
  pm25: { good: 12,  mod: 35,   high: 75   },
  pm4:  { good: 20,  mod: 50,   high: 100  },
  pm10: { good: 50,  mod: 150,  high: 250  },
  voc_index: { good: 100, mod: 200,  high: 300 }, // Sensirion Index
  voc_ppb:   { good: 250, mod: 500,  high: 1000 }, // ppb
  voc_ugm3:  { good: 300, mod: 600,  high: 1500 }, // ug/m3
  co2:  { good: 800, mod: 1200, high: 2000 },
  nox_index: { good: 100, mod: 200,  high: 300 },
  nox_ugm3:  { good: 50,  mod: 100,  high: 200 },
  nox_ppm:   { good: 0.05, mod: 0.1,  high: 0.2 },
} as const;

export function getVocThresholds(unit?: string) {
  const u = (unit ?? '').toLowerCase();
  if (u.includes('ppb')) return POLLUTANT_THRESHOLDS.voc_ppb;
  if (u.includes('m³') || u.includes('m3')) return POLLUTANT_THRESHOLDS.voc_ugm3;
  return POLLUTANT_THRESHOLDS.voc_index;
}

export function getNoxThresholds(unit?: string) {
  const u = (unit ?? '').toLowerCase();
  if (u.includes('m³') || u.includes('m3')) return POLLUTANT_THRESHOLDS.nox_ugm3;
  if (u.includes('ppm')) return POLLUTANT_THRESHOLDS.nox_ppm;
  return POLLUTANT_THRESHOLDS.nox_index;
}

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
      noxHigh:     'High Nitrogen Oxides detected',
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

// Computes the calculated-score-mode headline state from the available
// pollutants. Instead of averaging, we use the "Max Sub-Index" model (like
// US EPA AQI or Plume Labs): the pollutant with the highest health risk
// defines the entire score.
//
// Divisor calibration (the value at which a pollutant's penalty saturates):
//   PM2.5 75 ug/m3  -> US EPA "Unhealthy" boundary
//   PM10  150 ug/m3 -> US EPA "Unhealthy" boundary
//   VOC   300 Index -> Sensirion Index "Elevated" mark
//   CO2   1600 ppm above 400 baseline -> Harvard COGfx cognitive impact threshold
//
// Returns: { score, label, color, text, advice, pct } where score is null
// when no pollutants are present (empty-state).
interface ComputeScoreInput {
  pm25?: number | null;
  pm10?: number | null;
  voc?: number | null;
  voc_unit?: string;
  co2?: number | null;
  nox?: number | null;
  nox_unit?: string;
}

export function computeScore({ pm25, pm10, voc, voc_unit, co2, nox, nox_unit }: ComputeScoreInput): ScoreResult {
  const vocThresholds = getVocThresholds(voc_unit);
  const noxThresholds = getNoxThresholds(nox_unit);
  const pollutants = [
    { value: pm25, limit: 75 },
    { value: pm10, limit: 150 },
    { value: voc,  limit: vocThresholds.high },
    { value: co2 != null ? co2 - 400 : null, limit: 1600 },
    { value: nox,  limit: noxThresholds.high },
  ].filter((p): p is { value: number; limit: number } => p.value != null);

  if (pollutants.length === 0) {
    return {
      score: null,
      label: 'No data',
      color: 'var(--air-quality-card-no-data-color, #9ca3af)',
      text: 'var(--secondary-text-color)',
      advice: 'Configure PM2.5, PM10, VOC, or CO₂ sensors to see a calculated score.',
      pct: 0,
    };
  }

  // Calculate sub-indices (0-100%) for each pollutant.
  // The worst (max) sub-index defines the overall score.
  const subIndices = pollutants.map(p => {
    return Math.min(100, Math.max(0, (p.value / p.limit) * 100));
  });

  const maxSubIndex = Math.max(...subIndices);
  const score = Math.round(100 - maxSubIndex);
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
