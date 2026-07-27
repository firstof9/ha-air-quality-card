import { LitElement, html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import type { AirQualityCardConfig, HomeAssistant } from './types.js';

interface HaFormSchemaEntry {
  name: string;
  label: string;
  helper?: string;
  selector: Record<string, unknown>;
}

const SCHEMA: HaFormSchemaEntry[] = [
  { name: 'title',            label: 'Card Title',            helper: 'Shown at the top of the card.', selector: { text: {} } },
  { name: 'default_expanded', label: 'Expanded by Default',   helper: 'Whether the card opens expanded. Click the title to toggle.', selector: { boolean: {} } },
  // setConfig accepts sensor.* and air_quality.*, so the picker offers both.
  { name: 'aqi_entity',       label: 'AQI Sensor (Optional)', helper: "If set, displays this sensor's value with EPA AirNow bands. If empty or unavailable, falls back to a calculated score from PM2.5, VOC, and CO2.", selector: { entity: { filter: [{ domain: 'sensor', device_class: 'aqi' }, { domain: 'air_quality' }] } } },
  { name: 'temp_entity',      label: 'Temperature Sensor',    helper: 'Shown next to the headline. Also feeds the optional history graph.', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'humid_entity',     label: 'Humidity Sensor',       helper: 'Shown next to the headline. Also feeds the optional history graph.', selector: { entity: { domain: 'sensor', device_class: 'humidity' } } },
  { name: 'pm1_entity',       label: 'PM1.0 Sensor',          helper: 'Display only - does not contribute to the calculated score.', selector: { entity: { domain: 'sensor', device_class: 'pm1' } } },
  { name: 'pm25_entity',      label: 'PM2.5 Sensor',          helper: 'Drives the score when PM2.5 levels are the worst pollutant.', selector: { entity: { domain: 'sensor', device_class: 'pm25' } } },
  { name: 'pm4_entity',       label: 'PM4.0 Sensor',          helper: 'Display only - does not contribute to the calculated score.', selector: { entity: { domain: 'sensor' } } },
  { name: 'pm10_entity',      label: 'PM10 Sensor',           helper: 'Drives the score when PM10 levels are the worst pollutant.', selector: { entity: { domain: 'sensor', device_class: 'pm10' } } },
  { name: 'voc_entity',       label: 'VOC Index Sensor',      helper: 'Sensirion VOC Index (0-500 scale). Drives the score when VOCs are the worst pollutant.', selector: { entity: { domain: 'sensor' } } },
  { name: 'co2_entity',       label: 'CO2 Sensor (ppm)',      helper: 'Drives the score when CO2 is the worst pollutant (impacts cognitive function above 2000 ppm).', selector: { entity: { domain: 'sensor', device_class: 'carbon_dioxide' } } },
  { name: 'nox_entity',       label: 'NOX Sensor',            helper: 'Nitrogen Oxides (NO2/NOX). Drives the score when NOX levels are high.', selector: { entity: { domain: 'sensor' } } },
  { name: 'radon_entity',     label: 'Radon Sensor',          helper: 'Displays Radon gas levels (supports pCi/L and Bq/m³).', selector: { entity: { domain: 'sensor' } } },
];

@customElement('air-quality-card-editor')
export class AirQualityCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: AirQualityCardConfig;

  public setConfig(config: AirQualityCardConfig): void {
    this._config = config;
  }

  private _cachedVocEntities?: string[];
  private _cachedNoxEntities?: string[];
  private _cachedHassStates?: HomeAssistant['states'];
  private _cachedSchema?: HaFormSchemaEntry[];

  private get _schema(): HaFormSchemaEntry[] {
    if (!this.hass) return SCHEMA;

    if (this.hass.states !== this._cachedHassStates) {
      this._cachedHassStates = this.hass.states;
      this._cachedVocEntities = Object.keys(this.hass.states).filter((eid) => {
        if (!eid.startsWith('sensor.')) return false;
        const friendlyName = this.hass!.states[eid].attributes.friendly_name?.toLowerCase() || '';
        return eid.toLowerCase().includes('voc') || friendlyName.includes('voc');
      });

      this._cachedNoxEntities = Object.keys(this.hass.states).filter((eid) => {
        if (!eid.startsWith('sensor.')) return false;
        const stateObj = this.hass!.states[eid];
        const friendlyName = stateObj.attributes.friendly_name?.toLowerCase() || '';
        const dc = (stateObj.attributes.device_class as string | undefined)?.toLowerCase() || '';
        return (
          eid.toLowerCase().includes('nox') ||
          eid.toLowerCase().includes('no2') ||
          friendlyName.includes('nox') ||
          friendlyName.includes('no2') ||
          dc.includes('nitrogen')
        );
      });

      this._cachedSchema = SCHEMA.map((s) => {
        if (s.name === 'voc_entity') {
          return {
            ...s,
            selector: {
              entity: {
                ...s.selector.entity as Record<string, unknown>,
                include_entities: this._cachedVocEntities,
              },
            },
          };
        }
        if (s.name === 'nox_entity') {
          return {
            ...s,
            selector: {
              entity: {
                ...s.selector.entity as Record<string, unknown>,
                include_entities: this._cachedNoxEntities,
              },
            },
          };
        }
        return s;
      });
    }

    return this._cachedSchema || SCHEMA;
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema}
        .computeLabel=${(s: HaFormSchemaEntry) => s.label || s.name}
        .computeHelper=${(s: HaFormSchemaEntry) => s.helper || ''}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent<{ value: AirQualityCardConfig }>): void {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: ev.detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

