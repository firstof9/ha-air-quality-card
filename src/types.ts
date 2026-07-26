// Minimal HA types we need. The full @types/home-assistant-js-websocket
// is overkill for a card this size; these are the shapes we actually
// touch.

export interface HassEntityState {
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
}

export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  locale?: { language?: string };
  language?: string;
  callWS?<T>(msg: Record<string, unknown>): Promise<T>;
}

export interface AirQualityCardConfig {
  type?: string;
  title?: string;
  default_expanded?: boolean;
  aqi_entity?: string;
  temp_entity?: string;
  humid_entity?: string;
  pm1_entity?: string;
  pm25_entity?: string;
  pm4_entity?: string;
  pm10_entity?: string;
  voc_entity?: string;
  co2_entity?: string;
  nox_entity?: string;
  radon_entity?: string;
  voc_thresholds?: { good: number; mod: number; high: number };
  voc_baseline?: number;
  nox_thresholds?: { good: number; mod: number; high: number };
  nox_baseline?: number;
}

// The card's own stats that a graph series can feed.
export type GraphSeriesKey = 'temp' | 'humid';

// mini-graph-card's hover state. Not part of its documented API, so every
// field is optional and the shape is validated before use.
export interface GraphTooltip {
  entity?: number;
  value?: number | string;
  time?: [string, string];
  label?: string | null;
}

// A hovered graph point mapped onto one of the card's stats.
export interface GraphHoverReadout {
  key: GraphSeriesKey;
  value: number;
  // Either the point's time range ("20:14 - 20:44") or mini-graph-card's own
  // tooltip label ("Current" when hovering a legend entry). Empty when neither.
  time: string;
}

export interface ThresholdResult {
  label: string;
  color: string;
  text: string;
  pct: number;
  left?: number;
}

export interface ScoreResult {
  score: number | null;
  label: string;
  color: string;
  text: string;
  advice: string;
  pct: number;
}

export interface AqiBand {
  max: number;
  color: string;
  text: string;
  label: string;
  advice: string;
}

export interface ScoreBand {
  min: number;
  color: string;
  text: string;
  label: string;
  advice: string;
}
