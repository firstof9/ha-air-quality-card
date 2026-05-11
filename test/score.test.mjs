// Tests for the pure scoring + threshold helpers exported from
// helpers.js. Runs under `node --test test/`.
//
// The rendering, editor, and HA-card-contract bits aren't covered here -
// those need a DOM and aren't really useful unit-test targets. The score
// formula has enough math to be worth pinning down.

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import {
  computeScore,
  calcThreshold,
  AQI_BANDS,
  SCORE_BANDS,
  translate,
} from '../helpers.js';

describe('computeScore', () => {
  test('empty input returns no-data state', () => {
    const r = computeScore({});
    assert.equal(r.score, null);
    assert.equal(r.label, 'No data');
    assert.equal(r.pct, 0);
  });

  test('all-null pollutants returns no-data state', () => {
    const r = computeScore({ pm25: null, voc: null, co2: null });
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
    // 75 is the divisor (EPA Unhealthy for SG boundary), so the single
    // pollutant gets full 100% weight when renormalized, full penalty.
    const r = computeScore({ pm25: 75 });
    assert.equal(r.score, 0);
    assert.equal(r.label, 'Bad');
  });

  test('CO2 alone at 1100 ppm lands in Moderate (not Poor/Bad)', () => {
    // ASHRAE guidance: ~1100 ppm is fine. After PR #20 calibration this
    // is 68 (Moderate). Pre-PR #20 it was 56 (Poor) - regression guard.
    const r = computeScore({ co2: 1100 });
    assert.ok(r.score >= 60, `expected score >= 60 (Moderate or better), got ${r.score}`);
  });

  test('CO2 alone at 2000 ppm is below Good band', () => {
    // 2000 ppm is the Harvard COGfx cognitive-impact ceiling; the
    // single-pollutant renormalized formula penalizes heavily.
    const r = computeScore({ co2: 2000 });
    assert.ok(r.score < 80, `expected score < 80 (below Good), got ${r.score}`);
  });

  test('CO2 below 400 ppm baseline contributes no penalty', () => {
    // co2 - 400 goes negative, gets clamped to 0 inside the formula.
    const r = computeScore({ co2: 380 });
    assert.equal(r.score, 100);
    assert.equal(r.label, 'Good');
  });

  test('renormalization: PM2.5 alone hits the same ceiling as PM2.5+VOC+CO2 all-bad', () => {
    // Single pollutant maxed should still be able to reach score 0,
    // not artificially capped by its original weight share.
    const single = computeScore({ pm25: 75 });
    const all = computeScore({ pm25: 75, voc: 500, co2: 2600 });
    assert.equal(single.score, 0);
    assert.equal(all.score, 0);
  });

  test('partial sensors (only PM2.5 and CO2) renormalize correctly', () => {
    const r = computeScore({ pm25: 37.5, co2: 1500 });
    // Both at 50% of their divisor. Renormalized weights split between
    // them. Expected: not Good, not Bad - somewhere in Moderate/Poor.
    assert.ok(r.score >= 40 && r.score < 80, `expected 40..79, got ${r.score}`);
  });

  test('three moderate readings land in Moderate band, not Poor', () => {
    // Calibration regression check: before PR #20, this case scored 54
    // (Poor) due to overly aggressive divisors. Should now land in
    // Moderate (>= 60).
    const r = computeScore({ pm25: 20, voc: 150, co2: 900 });
    assert.ok(r.score >= 60, `expected score >= 60 (Moderate), got ${r.score}`);
  });

  test('score is always clamped to [0, 100]', () => {
    const overflow = computeScore({ pm25: -50 });  // negative -> clamped to 0
    assert.ok(overflow.score >= 0 && overflow.score <= 100);

    const max = computeScore({ pm25: 99999 });
    assert.ok(max.score >= 0 && max.score <= 100);
  });

  test('returns a color from SCORE_BANDS', () => {
    const r = computeScore({ pm25: 10 });
    const validColors = SCORE_BANDS.map(b => b.color);
    assert.ok(validColors.includes(r.color), `unexpected color ${r.color}`);
  });

  test('returns advice from SCORE_BANDS or matching the empty state', () => {
    const r = computeScore({ pm25: 10 });
    const validAdvice = SCORE_BANDS.map(b => b.advice);
    assert.ok(validAdvice.includes(r.advice), `unexpected advice "${r.advice}"`);
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
    // value just under high, pct = value/high * 100, clamped at 100
    const r = calcThreshold(50, 10, 25, 50);
    assert.ok(r.pct <= 100);
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
    assert.equal(found.label, 'Hazardous');
  });

  test('each band has the expected shape', () => {
    for (const band of AQI_BANDS) {
      assert.ok(typeof band.max === 'number');
      // color (bright) and text (readable) are CSS custom-property
      // strings with hex fallbacks, e.g. "var(--...-color, #86efac)".
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
