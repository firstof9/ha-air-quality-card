import { LitElement, html, type TemplateResult, type PropertyValues, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';

import {
  AQI_BANDS,
  POLLUTANT_THRESHOLDS,
  calcThreshold,
  computeScore,
  getVocThresholds,
  getNoxThresholds,
  getRadonThresholds,
  getVocDefaultBaseline,
  getNoxDefaultBaseline,
  entitiesWithHistory,
  graphHoverReadout,
  hasEntity,
  sameGraphHover,
  translate,
} from './helpers.js';
import { cardStyles } from './styles.js';
import type {
  AirQualityCardConfig,
  GraphHoverReadout,
  GraphSeriesKey,
  GraphTooltip,
  HassEntityState,
  HomeAssistant,
  ThresholdResult,
} from './types.js';

import './editor.js';

const VERSION = __CARD_VERSION__;

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
  radon_entity:  ['sensor.'],
};

interface MiniGraphCardElement extends HTMLElement {
  setConfig(config: unknown): void;
  hass?: HomeAssistant;
  // Internal to mini-graph-card; read defensively, see graphHoverReadout().
  tooltip?: GraphTooltip;
}

// One graph series: which card stat it feeds, and the mini-graph-card entity
// config it is mounted with.
interface GraphSeries {
  id: string;
  key: GraphSeriesKey;
  spec: Record<string, unknown>;
}

@customElement('air-quality-card')
export class AirQualityCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: AirQualityCardConfig;
  @state() private _expanded = true;

  private _graphCard?: MiniGraphCardElement;
  private _graphConfigured = false;
  // Card stats fed by each graph series, in the order they were mounted.
  private _graphSeries: GraphSeriesKey[] = [];
  private _hitAreaWidened = false;
  // Point currently hovered on the graph, shown in place of the live stat.
  @state() private _hover: GraphHoverReadout | null = null;
  // `${temp}|${humid}` of the entity set we last probed/configured the graph
  // for. Lets us skip re-probing on every hass tick but re-probe when the
  // configured graph entities change.
  private _graphProbeKey?: string;

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
      radon_entity: '',
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
    // New entity set → reset so we re-probe and re-show.
    const key = `${config.temp_entity ?? ''}|${config.humid_entity ?? ''}`;
    if (key !== this._graphProbeKey) {
      this._graphProbeKey = undefined;
      this._graphConfigured = false;
      if (this._graphCard) this._graphCard.style.display = 'none';
    }
    this._maybeSetupGraph();
  }

  // Builds the graph once hass is available: probes recorder history for the
  // configured temp/humid entities and mounts mini-graph-card with only the
  // entities that actually have data. Called from setConfig and from updated()
  // on the first hass. Idempotent per entity set via _graphProbeKey.
  private _maybeSetupGraph(): void {
    const config = this._config;
    if (!config) return;
    const key = `${config.temp_entity ?? ''}|${config.humid_entity ?? ''}`;
    if (this._graphProbeKey === key) return;

    const candidates: GraphSeries[] = [];
    if (config.temp_entity) {
      candidates.push({ id: config.temp_entity, key: 'temp', spec: { entity: config.temp_entity, name: 'Temp', color: '#fde68a' } });
    }
    if (config.humid_entity) {
      candidates.push({ id: config.humid_entity, key: 'humid', spec: { entity: config.humid_entity, name: 'Humidity', color: '#a8c0e0', y_axis: 'secondary' } });
    }

    if (candidates.length === 0) {
      this._graphProbeKey = key;
      this._graphConfigured = false;
      if (this._graphCard) this._graphCard.style.display = 'none';
      return;
    }

    // Need hass to probe; updated() re-invokes us when it arrives.
    if (!this.hass) return;

    // Mark this entity set as handled (probe in flight) so we don't fire it
    // again on the next hass tick.
    this._graphProbeKey = key;

    // No callWS available (e.g. test/preview): can't probe, keep all.
    if (typeof this.hass.callWS !== 'function') {
      this._configureGraph(candidates);
      return;
    }

    const hours = 24;
    const end = new Date();
    const start = new Date(end.getTime() - hours * 3600_000);
    this.hass
      .callWS<Record<string, unknown[]>>({
        type: 'history/history_during_period',
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        entity_ids: candidates.map(c => c.id),
        minimal_response: true,
        no_attributes: true,
      })
      .then(resp => {
        const live = entitiesWithHistory(resp, candidates.map(c => c.id));
        this._configureGraph(candidates.filter(c => live.has(c.id)));
      })
      .catch(() => {
        // Probe failed — fall back to including all candidates (prior behavior),
        // so a transient history error never hides a working graph.
        this._configureGraph(candidates);
      });
  }

  // Mounts/refreshes mini-graph-card with the given series, preserving the
  // graceful-degradation path for when mini-graph-card isn't installed.
  private _configureGraph(series: GraphSeries[]): void {
    this._graphSeries = series.map(s => s.key);
    this._hover = null;
    if (series.length === 0) {
      this._graphConfigured = false;
      if (this._graphCard) this._graphCard.style.display = 'none';
      return;
    }
    const entities = series.map(s => s.spec);
    if (!this._graphCard) {
      this._graphCard = document.createElement('mini-graph-card') as MiniGraphCardElement;
      // Track the hover with mousemove, not mouseover: moving between two
      // points inside mini-graph-card's shadow root retargets both boundary
      // events to the host, which suppresses them, so only mousemove is seen
      // out here. Boundary events do fire before the mousemove that caused
      // them, so the tooltip is already current when this runs.
      this._graphCard.addEventListener('mousemove', this._onGraphHover);
      this._graphCard.addEventListener('mouseleave', this._onGraphLeave);
    }
    // Race whenDefined against a 2s timeout so we degrade gracefully
    // when mini-graph-card isn't installed.
    const ready = customElements.whenDefined('mini-graph-card');
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('mini-graph-card not installed')), 2000),
    );
    Promise.race([ready, timeout])
      .then(() => {
        this._graphCard!.setConfig({
          type: 'custom:mini-graph-card',
          entities,
          hours_to_show: 24,
          points_per_hour: 2,
          line_width: 2,
          animate: true,
          smoothing: true,
          hour24: true,
          height: 60,
          // The card renders the hovered value itself in the temp/humidity
          // stats, so mini-graph-card's own state row and axis labels stay off.
          show: {
            name: false,
            icon: false,
            state: false,
            legend: true,
            labels: false,
            labels_secondary: false,
            fill: 'fade',
          },
        });
        this._graphConfigured = true;
        this._graphCard!.style.display = 'block';
        if (this.hass) this._graphCard!.hass = this.hass;
        this.requestUpdate();
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
        this.requestUpdate();
      });
  }

  // Mirror mini-graph-card's hover state into our own stats. Arrow fields so
  // `this` is the card when they run as listeners.
  private _onGraphHover = (): void => {
    const next = graphHoverReadout(this._graphCard?.tooltip, this._graphSeries);
    if (!sameGraphHover(next, this._hover)) this._hover = next;
  };

  private _onGraphLeave = (): void => {
    this._hover = null;
  };

  // mini-graph-card's hover targets are circles of r = line_width, so at our
  // 2px line the readout only appears within about 1.5px of the line. A
  // transparent stroke widens the target to about 4px without moving anything
  // or changing the graph's layout. Wider than this and, where the temp and
  // humidity lines run close together, the series drawn on top starts winning
  // hovers aimed at the other one. mini-graph-card keeps its rules in an
  // adopted stylesheet, which outranks a <style> appended to its shadow tree,
  // so this has to be adopted as well.
  private _widenGraphHitArea(): void {
    if (this._hitAreaWidened) return;
    const root = this._graphCard?.shadowRoot;
    if (!root) return;
    // One attempt either way: reaching into another card's styles is best
    // effort, and the stock hit area still works if it fails.
    this._hitAreaWidened = true;
    if (!('adoptedStyleSheets' in root)) return;
    try {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync('.line--point { stroke: transparent; stroke-width: 8px; pointer-events: all; }');
      root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
    } catch {
      // Older engines without constructable stylesheets: leave it alone.
    }
  }

  public override disconnectedCallback(): void {
    super.disconnectedCallback();
    // A card removed mid-hover must not come back showing a stale reading.
    this._hover = null;
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has('hass') && this.hass) {
      this._maybeSetupGraph();
      if (this._graphCard && this._graphConfigured) {
        this._graphCard.hass = this.hass;
      }
    }
    // The graph card only grows a shadow root once it has rendered, which is
    // after _configureGraph runs, so this waits for an update to land.
    if (this._graphConfigured) this._widenGraphHitArea();
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
    const nox   = this._safeNum(config.nox_entity);
    const radon = this._safeNum(config.radon_entity);

    const tempUnit  = this._getUnit(config.temp_entity, '°C');
    const humidUnit = this._getUnit(config.humid_entity, '%');
    const pm1Unit   = this._getUnit(config.pm1_entity, 'µg/m³');
    const pm25Unit  = this._getUnit(config.pm25_entity, 'µg/m³');
    const pm4Unit   = this._getUnit(config.pm4_entity, 'µg/m³');
    const pm10Unit  = this._getUnit(config.pm10_entity, 'µg/m³');
    const vocUnit   = this._getUnit(config.voc_entity, 'index');
    const co2Unit   = this._getUnit(config.co2_entity, 'ppm');
    const noxUnit   = this._getUnit(config.nox_entity, 'index');
    const radonUnit = this._getUnit(config.radon_entity, 'pCi/L');

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
      const result = computeScore({
        pm25,
        pm10,
        voc,
        voc_unit: vocUnit,
        voc_thresholds: config.voc_thresholds,
        voc_baseline: config.voc_baseline,
        co2,
        nox,
        nox_unit: noxUnit,
        nox_thresholds: config.nox_thresholds,
        nox_baseline: config.nox_baseline,
      });
      displayValue = result.score == null ? '--' : result.score;
      ringTopText = this.t('ring.score');
      ringColor = result.color;
      textColor = result.text;
      displayLabel = result.label;
      advice = result.advice;
      dashOffset = circ - result.pct * circ;
    }

    // --- Pollutant tile thresholds ---
    const T = POLLUTANT_THRESHOLDS;
    const pm1S  = calcThreshold(pm1,  T.pm1.good,  T.pm1.mod,  T.pm1.high);
    const pm25S = calcThreshold(pm25, T.pm25.good, T.pm25.mod, T.pm25.high);
    const pm4S  = calcThreshold(pm4,  T.pm4.good,  T.pm4.mod,  T.pm4.high);
    const pm10S = calcThreshold(pm10, T.pm10.good, T.pm10.mod, T.pm10.high);
    const vocT = config.voc_thresholds ?? getVocThresholds(vocUnit);
    const vocB = config.voc_baseline ?? (config.voc_thresholds ? 0 : getVocDefaultBaseline(vocUnit));
    const vocS  = calcThreshold(voc,  vocT.good,  vocT.mod,  vocT.high, vocB);
    const co2S  = calcThreshold(co2,  T.co2.good,  T.co2.mod,  T.co2.high);
    const noxT  = config.nox_thresholds ?? getNoxThresholds(noxUnit);
    const noxB  = config.nox_baseline ?? (config.nox_thresholds ? 0 : getNoxDefaultBaseline(noxUnit));
    const noxS  = calcThreshold(nox,  noxT.good,  noxT.mod,  noxT.high, noxB);
    const radonT = getRadonThresholds(radonUnit);
    const radonS = calcThreshold(radon, radonT.good, radonT.mod, radonT.high);

    // Pollutant override advice, only when headline is benign so we
    // don't downgrade an Unhealthy/Hazardous warning.
    const benign = displayLabel === 'Good' || displayLabel === 'Moderate';
    if (benign) {
      if (voc != null && voc > vocT.mod) advice = this.t('advice.vocHigh');
      if (co2 != null && co2 > 1000) advice = this.t('advice.co2High');
      if (co2 != null && co2 > 1500) advice = this.t('advice.co2VeryHigh');
      if (nox != null && nox > noxT.mod) advice = this.t('advice.noxHigh');
      if (radon != null && radon > radonT.mod) advice = this.t('advice.radonHigh');
    }

    const headlineUnit = hasAqi
      ? aqiStateObj!.attributes.unit_of_measurement || 'AQI'
      : '/ 100';
    const headlineAriaLabel =
      `${config.title || 'Air quality'}: ${displayLabel}, ${displayValue} ${headlineUnit}`.trim();

    // Chip background uses color-mix so user theme overrides on the
    // badge custom property automatically tint the badge too.
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
              config,
              pm1, pm25, pm4, pm10, voc, co2, nox, radon,
              pm1Unit, pm25Unit, pm4Unit, pm10Unit, vocUnit, co2Unit, noxUnit, radonUnit,
              pm1S, pm25S, pm4S, pm10S, vocS, co2S, noxS, radonS,
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

    // While a graph point is hovered, the stat it belongs to shows that point's
    // value and its time range in place of the live value and the stat name.
    const hoverTemp = this._hover?.key === 'temp' ? this._hover : null;
    const hoverHumid = this._hover?.key === 'humid' ? this._hover : null;
    const tempShown = hoverTemp ? hoverTemp.value : temp;
    const humidShown = hoverHumid ? hoverHumid.value : humid;
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

          ${hasEntity(config.temp_entity) || hasEntity(config.humid_entity)
            ? html`
          <div class="stats">
            ${hasEntity(config.temp_entity)
              ? html`
            <div
              class=${classMap({ stat: true, empty: tempShown == null })}
              aria-label="Temperature: ${this._formatNum(tempShown, 1)} ${tempUnit}${
                hoverTemp ? `, ${hoverTemp.time}` : ''}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(tempShown, 1)}</span>
                <span class="unit">${tempShown == null ? '' : tempUnit}</span>
              </div>
              <div
                class=${classMap({ 'stat-label': true, 'stat-time': !!hoverTemp })}
                aria-hidden="true"
              >${hoverTemp ? hoverTemp.time : this.t('stats.temp')}</div>
            </div>`
              : nothing}
            ${hasEntity(config.temp_entity) && hasEntity(config.humid_entity)
              ? html`<div class="divider" aria-hidden="true"></div>`
              : nothing}
            ${hasEntity(config.humid_entity)
              ? html`
            <div
              class=${classMap({ stat: true, empty: humidShown == null })}
              aria-label="Humidity: ${this._formatNum(humidShown, 0)} ${humidUnit}${
                hoverHumid ? `, ${hoverHumid.time}` : ''}"
            >
              <div class="stat-value">
                <span class="num">${this._formatNum(humidShown, 0)}</span>
                <span class="unit">${humidShown == null ? '' : humidUnit}</span>
              </div>
              <div
                class=${classMap({ 'stat-label': true, 'stat-time': !!hoverHumid })}
                aria-hidden="true"
              >${hoverHumid ? hoverHumid.time : this.t('stats.humidity')}</div>
            </div>`
              : nothing}
          </div>`
            : nothing}
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
    config: AirQualityCardConfig;
    pm1: number | null; pm25: number | null; pm4: number | null; pm10: number | null;
    voc: number | null; co2: number | null; nox: number | null; radon: number | null;
    pm1Unit: string; pm25Unit: string; pm4Unit: string; pm10Unit: string;
    vocUnit: string; co2Unit: string; noxUnit: string; radonUnit: string;
    pm1S: ThresholdResult; pm25S: ThresholdResult; pm4S: ThresholdResult;
    pm10S: ThresholdResult; vocS: ThresholdResult; co2S: ThresholdResult; noxS: ThresholdResult; radonS: ThresholdResult;
  }): TemplateResult | typeof nothing {
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
          <div class="fill" style=${styleMap({ left: `${st.left ?? 0}%`, width: `${st.pct}%`, background: st.color })}></div>
        </div>
      </div>
    `;
    const pmTiles: TemplateResult[] = [];
    if (hasEntity(d.config.pm1_entity))  pmTiles.push(tile('PM1.0', d.pm1, d.pm1Unit, d.pm1S));
    if (hasEntity(d.config.pm25_entity)) pmTiles.push(tile('PM2.5', d.pm25, d.pm25Unit, d.pm25S));
    if (hasEntity(d.config.pm4_entity))  pmTiles.push(tile('PM4.0', d.pm4, d.pm4Unit, d.pm4S));
    if (hasEntity(d.config.pm10_entity)) pmTiles.push(tile('PM10', d.pm10, d.pm10Unit, d.pm10S));

    const gasTiles: TemplateResult[] = [];
    if (hasEntity(d.config.voc_entity)) gasTiles.push(tile('VOC', d.voc, d.vocUnit, d.vocS));
    if (hasEntity(d.config.nox_entity)) gasTiles.push(tile('NOₓ', d.nox, d.noxUnit, d.noxS));
    if (hasEntity(d.config.co2_entity)) gasTiles.push(tile('CO₂', d.co2, d.co2Unit, d.co2S));
    if (hasEntity(d.config.radon_entity)) gasTiles.push(tile('Radon', d.radon, d.radonUnit, d.radonS));

    if (pmTiles.length === 0 && gasTiles.length === 0) return nothing;

    return html`
      <div class="bottom">
        ${pmTiles.length ? html`<div class="tile-grid pm-grid">${pmTiles}</div>` : nothing}
        ${gasTiles.length ? html`<div class="tile-grid">${gasTiles}</div>` : nothing}
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
