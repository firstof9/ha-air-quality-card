import { LitElement, html, type TemplateResult, type PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import {
  AQI_BANDS,
  POLLUTANT_THRESHOLDS,
  calcThreshold,
  computeScore,
  translate,
} from './helpers.js';
import { cardStyles } from './styles.js';
import type {
  AirQualityCardConfig,
  HassEntityState,
  HomeAssistant,
  ThresholdResult,
} from './types.js';

import './editor.js';

const VERSION = '0.1.0';

console.info(
  `%c  AIR-QUALITY-CARD  %c  Version ${VERSION}  `,
  'color: white; font-weight: bold; background: #03a9f4',
  'color: #03a9f4; font-weight: bold; background: white',
);

const ALLOWED_DOMAINS: Record<string, string[]> = {
  aqi_entity:    ['sensor.', 'air_quality.'],
  temp_entity:   ['sensor.'],
  humid_entity:  ['sensor.'],
  pm1_entity:    ['sensor.'],
  pm25_entity:   ['sensor.'],
  pm4_entity:    ['sensor.'],
  pm10_entity:   ['sensor.'],
  voc_entity:    ['sensor.'],
  co2_entity:    ['sensor.'],
};

interface MiniGraphCardElement extends HTMLElement {
  setConfig(config: unknown): void;
  hass?: HomeAssistant;
}

@customElement('air-quality-card')
export class AirQualityCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: AirQualityCardConfig;
  @state() private _expanded = true;

  private _graphCard?: MiniGraphCardElement;
  private _graphConfigured = false;

  public static getConfigElement(): HTMLElement {
    return document.createElement('air-quality-card-editor');
  }

  public static getStubConfig(): AirQualityCardConfig {
    return {
      title: 'Living Room',
      default_expanded: true,
      aqi_entity: '',
      temp_entity: '',
      humid_entity: '',
      pm1_entity: '',
      pm25_entity: '',
      pm4_entity: '',
      pm10_entity: '',
      voc_entity: '',
      co2_entity: '',
    };
  }

  // First-load only flag: after the user clicks the toggle, _expanded
  // is user-driven and shouldn't snap back to the config default on
  // subsequent setConfig calls.
  private _expandedUserDriven = false;

  public setConfig(config: AirQualityCardConfig): void {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid configuration: expected an object');
    }
    for (const [key, prefixes] of Object.entries(ALLOWED_DOMAINS)) {
      const value = (config as Record<string, unknown>)[key];
      if (value == null || value === '') continue;
      if (typeof value !== 'string' || !prefixes.some(p => value.startsWith(p))) {
        throw new Error(
          `${key} must be one of (${prefixes.map(p => p + '*').join(', ')}), got: ${String(value)}`,
        );
      }
    }
    this._config = config;
    if (!this._expandedUserDriven) {
      this._expanded = config.default_expanded !== false;
    }
    this._setupGraphCard(config);
  }

  public getCardSize(): number {
    return 5;
  }

  // Translate a dotted-path string key for the active HA locale,
  // falling back to English. e.g. this.t('stats.temp') -> 'TEMP'.
  private t(path: string): string {
    const lang = this.hass?.locale?.language || this.hass?.language || 'en';
    return translate(path, lang);
  }

  private _safeNum(entityId: string | undefined): number | null {
    if (!entityId || !this.hass?.states[entityId]) return null;
    const state = this.hass.states[entityId].state;
    if (state === 'unavailable' || state === 'unknown') return null;
    const num = parseFloat(state);
    return isNaN(num) ? null : num;
  }

  private _formatNum(num: number | null, decimals = 1): string {
    return num == null ? '--' : num.toFixed(decimals);
  }

  private _getUnit(entityId: string | undefined, defaultUnit: string): string {
    if (!entityId || !this.hass?.states[entityId]) return defaultUnit;
    return this.hass.states[entityId].attributes.unit_of_measurement || defaultUnit;
  }

  private _setupGraphCard(config: AirQualityCardConfig): void {
    if (!this._graphCard) {
      this._graphCard = document.createElement('mini-graph-card') as MiniGraphCardElement;
    }
    const graphEntities: Array<Record<string, unknown>> = [];
    if (config.temp_entity) {
      graphEntities.push({ entity: config.temp_entity, name: 'Temp', color: '#fde68a' });
    }
    if (config.humid_entity) {
      graphEntities.push({
        entity: config.humid_entity,
        name: 'Humidity',
        color: '#a8c0e0',
        y_axis: 'secondary',
      });
    }
    if (graphEntities.length === 0) {
      this._graphCard.style.display = 'none';
      return;
    }
    // Race whenDefined against a 2s timeout so we degrade gracefully
    // when mini-graph-card isn't installed.
    const ready = customElements.whenDefined('mini-graph-card');
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('mini-graph-card not installed')), 2000),
    );
    Promise.race([ready, timeout])
      .then(() => {
        try {
          this._graphCard!.setConfig({
            type: 'custom:mini-graph-card',
            entities: graphEntities,
            hours_to_show: 24,
            points_per_hour: 2,
            line_width: 2,
            animate: true,
            smoothing: true,
            hour24: true,
            height: 60,
            show: { name: false, icon: false, state: false, legend: true, labels: false, fill: 'fade' },
          });
        } catch (err) {
          throw err;
        }
        this._graphConfigured = true;
        this._graphCard!.style.display = 'block';
        if (this.hass) this._graphCard!.hass = this.hass;
      })
      .catch((err: unknown) => {
        this._graphConfigured = false;
        if (this._graphCard) this._graphCard.style.display = 'none';
        const msg = err instanceof Error ? err.message : String(err);
        if (!msg.includes('not installed')) {
          console.warn('[air-quality-card] mini-graph-card setConfig failed:', err);
        } else {
          console.info(
            '[air-quality-card] mini-graph-card not found, temp/humidity history graph disabled. Install via HACS to enable it.',
          );
        }
      });
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('hass') && this._graphCard && this._graphConfigured && this.hass) {
      this._graphCard.hass = this.hass;
    }
  }

  private _toggle(): void {
    this._expanded = !this._expanded;
    this._expandedUserDriven = true;
  }

  private _onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this._toggle();
    }
  }

  protected override render(): TemplateResult {
    if (!this._config || !this.hass) return html``;

    // --- Read raw data ---
    const config = this._config;
    const aqiStateObj = config.aqi_entity ? this.hass.states[config.aqi_entity] : null;
    const aqi = aqiStateObj ? parseFloat(aqiStateObj.state) : NaN;
    const hasAqi = !!aqiStateObj && !isNaN(aqi);

    const topName = hasAqi
      ? aqiStateObj!.attributes.friendly_name || this.t('topName.aqi')
      : this.t('topName.score');

    const pm1   = this._safeNum(config.pm1_entity);
    const pm25  = this._safeNum(config.pm25_entity);
    const pm4   = this._safeNum(config.pm4_entity);
    const pm10  = this._safeNum(config.pm10_entity);
    const voc   = this._safeNum(config.voc_entity);
    const co2   = this._safeNum(config.co2_entity);
    const temp  = this._safeNum(config.temp_entity);
    const humid = this._safeNum(config.humid_entity);

    const tempUnit  = this._getUnit(config.temp_entity, '°C');
    const humidUnit = this._getUnit(config.humid_entity, '%');
    const pm1Unit   = this._getUnit(config.pm1_entity, 'µg/m³');
    const pm25Unit  = this._getUnit(config.pm25_entity, 'µg/m³');
    const pm4Unit   = this._getUnit(config.pm4_entity, 'µg/m³');
    const pm10Unit  = this._getUnit(config.pm10_entity, 'µg/m³');
    const vocUnit   = this._getUnit(config.voc_entity, 'index');
    const co2Unit   = this._getUnit(config.co2_entity, 'ppm');

    // --- Headline state ---
    const radius = 42;
    const circ = 2 * Math.PI * radius;
    let displayValue: string | number;
    let displayLabel: string;
    let advice: string;
    let ringColor: string;
    let textColor: string;
    let dashOffset: number;
    let ringTopText: string;

    if (hasAqi) {
      displayValue = Math.round(aqi);
      ringTopText = this.t('ring.aqi');
      const band = AQI_BANDS.find(b => aqi <= b.max)!;
      ringColor = band.color; textColor = band.text; displayLabel = band.label; advice = band.advice;
      const aqiPct = Math.min(Math.max(aqi, 0) / 500, 1);
      dashOffset = circ - aqiPct * circ;
    } else {
      const result = computeScore({ pm25, voc, co2 });
      displayValue = result.score == null ? '--' : result.score;
      ringTopText = this.t('ring.score');
      ringColor = result.color;
      textColor = result.text;
      displayLabel = result.label;
      advice = result.advice;
      dashOffset = circ - result.pct * circ;
    }

    // Pollutant override advice, only when headline is benign so we
    // don't downgrade an Unhealthy/Hazardous warning.
    const benign = displayLabel === 'Good' || displayLabel === 'Moderate';
    if (benign) {
      if (voc != null && voc > 200) advice = this.t('advice.vocHigh');
      if (co2 != null && co2 > 1000) advice = this.t('advice.co2High');
      if (co2 != null && co2 > 1500) advice = this.t('advice.co2VeryHigh');
    }

    // --- Pollutant tile thresholds ---
    const T = POLLUTANT_THRESHOLDS;
    const pm1S  = calcThreshold(pm1,  T.pm1.good,  T.pm1.mod,  T.pm1.high);
    const pm25S = calcThreshold(pm25, T.pm25.good, T.pm25.mod, T.pm25.high);
    const pm4S  = calcThreshold(pm4,  T.pm4.good,  T.pm4.mod,  T.pm4.high);
    const pm10S = calcThreshold(pm10, T.pm10.good, T.pm10.mod, T.pm10.high);
    const vocS  = calcThreshold(voc,  T.voc.good,  T.voc.mod,  T.voc.high);
    const co2S  = calcThreshold(co2,  T.co2.good,  T.co2.mod,  T.co2.high);

    const headlineUnit = hasAqi
      ? aqiStateObj!.attributes.unit_of_measurement || 'AQI'
      : '/ 100';
    const headlineAriaLabel =
      `${config.title || 'Air quality'}: ${displayLabel}, ${displayValue} ${headlineUnit}`.trim();

    // Chip background uses color-mix so user theme overrides on the
    // band custom property automatically tint the badge too.
    const chipBg = `color-mix(in srgb, ${ringColor} 12%, transparent)`;
    const chipBorder = `color-mix(in srgb, ${ringColor} 35%, transparent)`;

    return html`
      <ha-card>
        <div
          class="top"
          role="button"
          tabindex="0"
          aria-expanded=${this._expanded ? 'true' : 'false'}
          aria-label=${headlineAriaLabel +
            (this._expanded ? '. Activate to collapse.' : '. Activate to expand.')}
          @click=${this._toggle}
          @keydown=${this._onKey}
        >
          ${this._expanded
            ? this._renderExpandedHeader(
                config,
                topName,
                displayValue,
                hasAqi,
                ringColor,
                textColor,
                advice,
                temp,
                humid,
                tempUnit,
                humidUnit,
                ringTopText,
                displayLabel,
                radius,
                circ,
                dashOffset,
                headlineAriaLabel,
              )
            : this._renderCollapsed(
                config,
                displayValue,
                hasAqi,
                aqiStateObj,
                ringColor,
                textColor,
                displayLabel,
                chipBg,
                chipBorder,
                headlineAriaLabel,
              )}
        </div>

        <div
          class="graph"
          style=${this._expanded && this._graphConfigured ? '' : 'display:none'}
        >
          ${this._graphCard ?? nothing}
        </div>

        ${this._expanded
          ? this._renderBottom({
              pm1, pm25, pm4, pm10, voc, co2,
              pm1Unit, pm25Unit, pm4Unit, pm10Unit, vocUnit, co2Unit,
              pm1S, pm25S, pm4S, pm10S, vocS, co2S,
            })
          : nothing}
      </ha-card>
    `;
  }

  private _renderCollapsed(
    config: AirQualityCardConfig,
    displayValue: string | number,
    hasAqi: boolean,
    aqiStateObj: HassEntityState | null,
    ringColor: string,
    textColor: string,
    displayLabel: string,
    chipBg: string,
    chipBorder: string,
    headlineAriaLabel: string,
  ): TemplateResult {
    const unitText =
      displayValue === '--'
        ? ''
        : hasAqi
          ? aqiStateObj?.attributes.unit_of_measurement || ''
          : '/ 100';
    return html`
      <div class="collapsed-row">
        <div class="header">
          <ha-icon icon="mdi:chevron-down" class="secondary" aria-hidden="true"></ha-icon>
          <div>
            <div class="title">${config.title || 'Living Room'}</div>
            <div class="subtitle">${this.t('subtitle')}</div>
          </div>
        </div>
        <div class="collapsed-meta" role="group" aria-label=${headlineAriaLabel}>
          <div class="collapsed-value">
            <span class="num" style=${styleMap({ color: textColor })}>${displayValue}</span>
            <span class="unit">${unitText}</span>
          </div>
          <div
            class="chip"
            style=${styleMap({ '--chip-bg': chipBg, '--chip-border': chipBorder, color: textColor })}
          >
            <span class="dot" style=${styleMap({ background: ringColor })} aria-hidden="true"></span>
            ${displayLabel}
          </div>
        </div>
      </div>
    `;
  }

  private _renderExpandedHeader(
    config: AirQualityCardConfig,
    topName: string,
    displayValue: string | number,
    hasAqi: boolean,
    ringColor: string,
    textColor: string,
    advice: string,
    temp: number | null,
    humid: number | null,
    tempUnit: string,
    humidUnit: string,
    ringTopText: string,
    displayLabel: string,
    radius: number,
    circ: number,
    dashOffset: number,
    headlineAriaLabel: string,
  ): TemplateResult {
    const showSlash = !hasAqi && displayValue !== '--';
    return html`
      <div class="expanded-header">
        <div class="header">
          <ha-icon icon="mdi:chevron-up" class="secondary" aria-hidden="true"></ha-icon>
          <div>
            <div class="title">${config.title || 'Living Room'}</div>
            <div class="subtitle">${this.t('subtitle')}</div>
          </div>
        </div>
      </div>

      <div class="expanded-row">
        <div class="expanded-text">
          <div class="top-name" title=${topName}>${topName}</div>
          <div class="headline" role="group" aria-label=${headlineAriaLabel}>
            <span class="num" style=${styleMap({ color: textColor })}>${displayValue}</span>
            <span class="unit">${showSlash ? '/ 100' : ''}</span>
          </div>
          <div class="advice">${advice}</div>

          <div class="stats">
            <div
              class=${classMap({ stat: true, empty: temp == null })}
              aria-label="Temperature: ${this._formatNum(temp, 1)} ${tempUnit}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(temp, 1)}</span>
                <span class="unit">${temp == null ? '' : tempUnit}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t('stats.temp')}</div>
            </div>
            <div class="divider" aria-hidden="true"></div>
            <div
              class=${classMap({ stat: true, empty: humid == null })}
              aria-label="Humidity: ${this._formatNum(humid, 0)} ${humidUnit}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(humid, 0)}</span>
                <span class="unit">${humid == null ? '' : humidUnit}</span>
              </div>
              <div class="stat-label" aria-hidden="true">${this.t('stats.humidity')}</div>
            </div>
          </div>
        </div>

        <div
          class="ring-wrapper"
          role="meter"
          aria-valuenow=${typeof displayValue === 'number' ? displayValue : 0}
          aria-valuemin="0"
          aria-valuemax=${hasAqi ? 500 : 100}
          aria-label="${ringTopText}: ${displayValue}, ${displayLabel}"
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <title>${ringTopText} ${displayValue}</title>
            <circle class="ring-bg" cx="50" cy="50" r=${radius}></circle>
            <circle
              class="ring-fg"
              cx="50"
              cy="50"
              r=${radius}
              style=${styleMap({ stroke: ringColor })}
              stroke-dasharray=${circ}
              stroke-dashoffset=${dashOffset}
            ></circle>
          </svg>
          <div class="ring-center" aria-hidden="true">
            <div class="ring-top-text">${ringTopText}</div>
            <div class="ring-bottom-text" style=${styleMap({ color: textColor })}>
              ${hasAqi || displayValue === '--' ? displayLabel : `${displayValue}%`}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private _renderBottom(d: {
    pm1: number | null; pm25: number | null; pm4: number | null; pm10: number | null;
    voc: number | null; co2: number | null;
    pm1Unit: string; pm25Unit: string; pm4Unit: string; pm10Unit: string;
    vocUnit: string; co2Unit: string;
    pm1S: ThresholdResult; pm25S: ThresholdResult; pm4S: ThresholdResult;
    pm10S: ThresholdResult; vocS: ThresholdResult; co2S: ThresholdResult;
  }): TemplateResult {
    const tile = (name: string, value: number | null, unit: string, st: ThresholdResult) => html`
      <div
        class=${classMap({ tile: true, empty: value == null })}
        role="group"
        aria-label="${name}: ${value == null ? 'no data' : `${value.toLocaleString()} ${unit}`}, ${st.label}"
      >
        <div class="tile-head" aria-hidden="true">
          <span class="tile-name">${name}</span>
          <span class="tile-status" style=${styleMap({ color: st.text })}>${st.label}</span>
        </div>
        <div class="tile-value" aria-hidden="true">
          <span class="num">${value == null ? '--' : value.toLocaleString()}</span>
          <span class="unit">${value == null ? '' : unit}</span>
        </div>
        <div
          class="tile-bar"
          role="progressbar"
          aria-valuenow=${Math.round(st.pct)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="${name} level"
        >
          <div class="fill" style=${styleMap({ width: `${st.pct}%`, background: st.color })}></div>
        </div>
      </div>
    `;
    return html`
      <div class="bottom">
        <div class="tile-grid pm-grid">
          ${tile('PM1.0', d.pm1, d.pm1Unit, d.pm1S)}
          ${tile('PM2.5', d.pm25, d.pm25Unit, d.pm25S)}
          ${tile('PM4.0', d.pm4, d.pm4Unit, d.pm4S)}
          ${tile('PM10', d.pm10, d.pm10Unit, d.pm10S)}
        </div>
        <div class="tile-grid">
          ${tile('VOC', d.voc, d.vocUnit, d.vocS)}
          ${tile('CO₂', d.co2, d.co2Unit, d.co2S)}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'air-quality-card': AirQualityCard;
  }
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      preview?: boolean;
      description?: string;
    }>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'air-quality-card',
  name: 'Air Quality Card',
  preview: true,
  description: 'A custom card displaying air quality metrics and an overall score.',
});
