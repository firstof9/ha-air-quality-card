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
}

export interface ThresholdResult {
  label: string;
  color: string;
  text: string;
  pct: number;
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
