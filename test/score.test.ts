// Tests for the pure scoring + threshold helpers exported from
// src/helpers.ts. Runs under `tsx --test test/`.
//
// The rendering, editor, and HA-card-contract bits aren't covered here -
// those need a DOM and aren't really useful unit-test targets. The
// score formula has enough math to be worth pinning down.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeScore,
  calcThreshold,
  AQI_BANDS,
  SCORE_BANDS,
  translate,
} from '../src/helpers.js';

describe('computeScore', () => {
  test('empty input returns no-data state', () => {
    const r = computeScore({});
    assert.equal(r.score, null);
    assert.equal(r.label, 'No data');
    assert.equal(r.pct, 0);
  });

  test('all-null pollutants returns no-data state', () => {
    const r = computeScore({ pm25: null, pm10: null, voc: null, co2: null });
    assert.equal(r.score, null);
    assert.equal(r.label, 'No data');
  });

  test('PM2.5 alone at 0 ug/m3 gives perfect score', () => {
    const r = computeScore({ pm25: 0 });
    assert.equal(r.score, 100);
    assert.equal(r.label, 'Good');
    assert.equal(r.pct, 1);
  });

  test('PM2.5 alone at 75 ug/m3 saturates the penalty (score 0)', () => {
    // 75 is the divisor (EPA Unhealthy boundary), so the single
    // pollutant gets full penalty in the max-sub-index model.
    const r = computeScore({ pm25: 75 });
    assert.equal(r.score, 0);
    assert.equal(r.label, 'Bad');
  });

  test('PM10 alone at 150 ug/m3 saturates the penalty (score 0)', () => {
    // 150 is the PM10 divisor.
    const r = computeScore({ pm10: 150 });
    assert.equal(r.score, 0);
    assert.equal(r.label, 'Bad');
  });

  test('CO2 alone at 1000 ppm lands in Moderate', () => {
    // (1000-400)/1600 = 0.375 penalty -> 62.5 score -> 63 Moderate
    const r = computeScore({ co2: 1000 });
    assert.equal(r.score, 63);
    assert.equal(r.label, 'Moderate');
  });

  test('Worst pollutant wins: 1 bad sensor + 2 perfect sensors = Bad score', () => {
    // PM2.5 is hazardous, others are perfect. Averaging would show "Moderate",
    // but Max Sub-Index correctly shows "Bad".
    const r = computeScore({ pm25: 75, voc: 0, co2: 400 });
    assert.equal(r.score, 0);
    assert.equal(r.label, 'Bad');
  });

  test('CO2 below 400 ppm baseline contributes no penalty', () => {
    const r = computeScore({ co2: 380 });
    assert.equal(r.score, 100);
    assert.equal(r.label, 'Good');
  });

  test('score is always clamped to [0, 100]', () => {
    const overflow = computeScore({ pm25: -50 });
    assert.ok((overflow.score ?? -1) >= 0 && (overflow.score ?? 101) <= 100);
    const max = computeScore({ pm25: 99999 });
    assert.ok((max.score ?? -1) >= 0 && (max.score ?? 101) <= 100);
  });

  test('returns a color from SCORE_BANDS', () => {
    const r = computeScore({ pm25: 10 });
    const validColors = SCORE_BANDS.map(b => b.color);
    assert.ok(validColors.includes(r.color), `unexpected color ${r.color}`);
  });

  test('returns advice from SCORE_BANDS', () => {
    const r = computeScore({ pm25: 10 });
    const validAdvice = SCORE_BANDS.map(b => b.advice);
    assert.ok(validAdvice.includes(r.advice), `unexpected advice "${r.advice}"`);
  });

  test('VOC Index (default/unknown unit) uses Index thresholds', () => {
    // 350 is the limit for Index -> Bad (score 0)
    const r = computeScore({ voc: 350 });
    assert.equal(r.score, 0);
  });

  test('VOC Index at 100 baseline yields perfect score', () => {
    const r = computeScore({ voc: 100 });
    assert.equal(r.score, 100);
  });

  test('VOC ppb uses ppb thresholds', () => {
    // 500 is Moderate for ppb (limit 1000) -> 50 penalty -> 50 Poor
    const r = computeScore({ voc: 500, voc_unit: 'ppb' });
    assert.equal(r.score, 50);
    assert.equal(r.label, 'Poor');
  });

  test('VOC µg/m³ uses µg/m³ thresholds', () => {
    // 600 is Moderate for µg/m³ (limit 1500) -> 40 penalty -> 60 Moderate
    const r = computeScore({ voc: 600, voc_unit: 'µg/m³' });
    assert.equal(r.score, 60);
    assert.equal(r.label, 'Moderate');
  });

  test('NOX Index (default) uses Index thresholds', () => {
    // 50 is High for Index -> 100 penalty -> 0 Bad
    const r = computeScore({ nox: 50 });
    assert.equal(r.score, 0);
  });

  test('NOX Index at 1 baseline yields perfect score', () => {
    const r = computeScore({ nox: 1 });
    assert.equal(r.score, 100);
  });

  test('NOX µg/m³ uses WHO thresholds', () => {
    // 100 is Moderate for µg/m³ (limit 200) -> 50 penalty -> 50 Moderate
    const r = computeScore({ nox: 100, nox_unit: 'µg/m³' });
    assert.equal(r.score, 50);
  });

  test('NOX ppm uses ppm thresholds', () => {
    // 0.2 ppm is the High limit for ppm -> 100 penalty -> 0 Bad
    const r = computeScore({ nox: 0.2, nox_unit: 'ppm' });
    assert.equal(r.score, 0);
  });

  test('VOC Index below baseline still yields a perfect score', () => {
    // voc=50 is below the Sensirion VOC Index 100 baseline; the Math.max(0, …)
    // floor in computeScore should keep it at 0 penalty.
    const r = computeScore({ voc: 50 });
    assert.equal(r.score, 100);
  });

  test('NOx Index below baseline still yields a perfect score', () => {
    // nox=0 is below the Sensirion NOx Index 1 baseline.
    const r = computeScore({ nox: 0 });
    assert.equal(r.score, 100);
  });

  test('custom thresholds without an explicit baseline default to 0', () => {
    // Sensirion's index baselines (100 / 1) only apply when the user has
    // not supplied their own thresholds; if they pass custom thresholds and
    // do not opt in to a baseline, the offset is 0.
    const r = computeScore({
      voc: 75,
      voc_thresholds: { good: 50, mod: 100, high: 150 },
    });
    // (75 / 150) * 100 = 50 penalty -> score 50
    assert.equal(r.score, 50);
  });

  test('custom VOC thresholds and baseline overrides are applied', () => {
    const r1 = computeScore({
      voc: 10,
      voc_thresholds: { good: 50, mod: 100, high: 150 },
      voc_baseline: 10
    });
    assert.equal(r1.score, 100);

    const r2 = computeScore({
      voc: 80,
      voc_thresholds: { good: 50, mod: 100, high: 150 },
      voc_baseline: 10
    });
    assert.equal(r2.score, 50);
  });

  test('custom NOx thresholds and baseline overrides are applied', () => {
    const r = computeScore({
      nox: 15,
      nox_thresholds: { good: 10, mod: 20, high: 30 },
      nox_baseline: 0
    });
    assert.equal(r.score, 50);
  });

  test('misconfigured baseline >= high does not divide by zero', () => {
    // baseline equal to high would make the denominator 0; the guard floors
    // the limit at 1 so the score still resolves to a finite number.
    const r = computeScore({
      voc: 200,
      voc_thresholds: { good: 50, mod: 100, high: 150 },
      voc_baseline: 150,
    });
    assert.ok(Number.isFinite(r.score ?? NaN));
    assert.equal(r.label, 'Bad');
  });
});

describe('calcThreshold', () => {
  test('null value returns the empty-state row', () => {
    const r = calcThreshold(null, 10, 25, 50);
    assert.equal(r.label, '--');
    assert.equal(r.pct, 0);
  });

  test('value at or below good returns GOOD', () => {
    assert.equal(calcThreshold(5, 10, 25, 50).label, 'GOOD');
    assert.equal(calcThreshold(10, 10, 25, 50).label, 'GOOD');
  });

  test('value between good and mod returns MOD', () => {
    assert.equal(calcThreshold(20, 10, 25, 50).label, 'MOD');
    assert.equal(calcThreshold(25, 10, 25, 50).label, 'MOD');
  });

  test('value between mod and high returns HIGH', () => {
    assert.equal(calcThreshold(40, 10, 25, 50).label, 'HIGH');
    assert.equal(calcThreshold(50, 10, 25, 50).label, 'HIGH');
  });

  test('value above high returns V.HIGH with pct clamped at 100', () => {
    const r = calcThreshold(999, 10, 25, 50);
    assert.equal(r.label, 'V.HIGH');
    assert.equal(r.pct, 100);
  });

  test('pct never exceeds 100 even within HIGH band', () => {
    const r = calcThreshold(50, 10, 25, 50);
    assert.ok(r.pct <= 100);
  });

  test('baseline shifts pct: value at baseline yields empty bar', () => {
    // Sensirion VOC Index thresholds with baseline 100: a reading of 100 is
    // "GOOD" and the bar should be empty (matching the perfect-score result
    // from computeScore), not ~29% full.
    const r = calcThreshold(100, 100, 250, 350, 100);
    assert.equal(r.label, 'GOOD');
    assert.equal(r.pct, 0);
  });

  test('baseline does not change band labels (still absolute)', () => {
    // Even with a baseline of 100, a value of 250 is still in the "MOD" band
    // (the labels track the absolute Sensirion bands, only the fill shifts).
    const r = calcThreshold(250, 100, 250, 350, 100);
    assert.equal(r.label, 'MOD');
  });

  test('values below baseline floor pct at 0', () => {
    const r = calcThreshold(50, 100, 250, 350, 100);
    assert.equal(r.label, 'GOOD');
    assert.equal(r.pct, 0);
  });

  test('baseline default of 0 preserves legacy pct behavior', () => {
    // Old call sites that pass no baseline keep the original (value/high)*100.
    const r = calcThreshold(25, 10, 25, 50);
    assert.equal(r.pct, 50);
  });
});

describe('AQI_BANDS sanity', () => {
  test('bands are ordered ascending by max', () => {
    let prev = -Infinity;
    for (const band of AQI_BANDS) {
      assert.ok(band.max > prev, `bands out of order at ${band.label}`);
      prev = band.max;
    }
  });

  test('final band catches arbitrarily large values', () => {
    const found = AQI_BANDS.find(b => 99999 <= b.max);
    assert.ok(found);
    assert.equal(found!.label, 'Hazardous');
  });

  test('each band has the expected shape', () => {
    for (const band of AQI_BANDS) {
      assert.ok(typeof band.max === 'number');
      assert.ok(typeof band.color === 'string' && band.color.length > 0);
      assert.ok(typeof band.text === 'string' && band.text.length > 0);
      assert.ok(typeof band.label === 'string' && band.label.length > 0);
      assert.ok(typeof band.advice === 'string' && band.advice.length > 0);
    }
  });
});

describe('translate', () => {
  test('returns the English value for a known key', () => {
    assert.equal(translate('stats.temp'), 'TEMP');
    assert.equal(translate('ring.aqi'), 'AQI');
    assert.equal(translate('advice.co2High'), 'CO2 high - open a window');
  });

  test('falls back to English when the language is missing', () => {
    assert.equal(translate('stats.humidity', 'xx'), 'HUMIDITY');
  });

  test('returns the path itself when the key does not exist', () => {
    assert.equal(translate('does.not.exist'), 'does.not.exist');
  });

  test('handles nested object paths', () => {
    assert.equal(translate('topName.aqi'), 'AQI Sensor');
    assert.equal(translate('topName.score'), 'Calculated Score');
  });
});
