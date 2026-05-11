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
  { name: 'aqi_entity',       label: 'AQI Sensor (Optional)', helper: "If set, displays this sensor's value with EPA AirNow bands. If empty or unavailable, falls back to a calculated score from PM2.5, VOC, and CO2.", selector: { entity: { domain: 'sensor', device_class: 'aqi' } } },
  { name: 'temp_entity',      label: 'Temperature Sensor',    helper: 'Shown next to the headline. Also feeds the optional history graph.', selector: { entity: { domain: 'sensor', device_class: 'temperature' } } },
  { name: 'humid_entity',     label: 'Humidity Sensor',       helper: 'Shown next to the headline. Also feeds the optional history graph.', selector: { entity: { domain: 'sensor', device_class: 'humidity' } } },
  { name: 'pm1_entity',       label: 'PM1.0 Sensor',          helper: 'Display only - does not contribute to the calculated score.', selector: { entity: { domain: 'sensor', device_class: 'pm1' } } },
  { name: 'pm25_entity',      label: 'PM2.5 Sensor',          helper: 'Largest contributor to the calculated score (40% weight).', selector: { entity: { domain: 'sensor', device_class: 'pm25' } } },
  { name: 'pm4_entity',       label: 'PM4.0 Sensor',          helper: 'Display only - does not contribute to the calculated score.', selector: { entity: { domain: 'sensor' } } },
  { name: 'pm10_entity',      label: 'PM10 Sensor',           helper: 'Display only - does not contribute to the calculated score.', selector: { entity: { domain: 'sensor', device_class: 'pm10' } } },
  { name: 'voc_entity',       label: 'VOC Index Sensor',      helper: 'Sensirion VOC Index (0-500 scale). Other TVOC sensors may produce misleading bands.', selector: { entity: { domain: 'sensor', device_class: 'volatile_organic_compounds' } } },
  { name: 'co2_entity',       label: 'CO2 Sensor (ppm)',      helper: "Contributes to the calculated score (35% weight). Drives 'open a window' advice above 1000 ppm.", selector: { entity: { domain: 'sensor', device_class: 'carbon_dioxide' } } },
];

@customElement('air-quality-card-editor')
export class AirQualityCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: AirQualityCardConfig;

  public setConfig(config: AirQualityCardConfig): void {
    this._config = config;
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
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
