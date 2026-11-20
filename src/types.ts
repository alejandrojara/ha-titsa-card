export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed?: string;
  last_updated?: string;
}

export interface HassEntityRegistryDisplayEntry {
  entity_id: string;
  device_id?: string | null;
  platform?: string;
  name?: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  entities?: Record<string, HassEntityRegistryDisplayEntry | undefined>;
  language?: string;
  locale?: {
    language?: string;
    time_format?: string;
  };
  themes?: {
    darkMode?: boolean;
  };
  callService: (
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: { entity_id?: string | string[] },
  ) => Promise<unknown>;
}

export interface TitsaArrival {
  line: string;
  line_name?: string;
  destination: string;
  minutes: number;
  estimated_arrival: string;
  is_approximate?: boolean;
}

export interface TitsaFollowingArrival {
  destination: string;
  minutes: number;
  estimated_arrival: string;
  is_approximate?: boolean;
}

export interface TitsaSensorAttributes {
  stop_id?: string;
  stop_name?: string;
  filtered_lines?: string[];
  next_line?: string | null;
  next_line_name?: string | null;
  next_destination?: string | null;
  next_minutes?: number | null;
  arrivals_count?: number;
  arrivals?: TitsaArrival[];
  line?: string;
  line_name?: string | null;
  destination?: string | null;
  minutes?: number | null;
  following_arrivals?: TitsaFollowingArrival[];
  last_estimation?: string | null;
  polling_paused?: boolean;
  manual_snapshot?: boolean;
  schedule_entity?: string | null;
  friendly_name?: string;
}

export type TitsaCardStyle = "marquesina" | "minimal";

export interface TitsaCardConfig {
  type: string;
  entity: string;
  refresh_entity?: string;
  title?: string;
  style?: TitsaCardStyle;
  max_arrivals?: number;
  compact?: boolean;
  show_arrival_time?: boolean;
  show_route_name?: boolean;
  show_footer?: boolean;
  tap_to_refresh?: boolean;
  lines?: string[];
}

export interface LovelaceGridOptions {
  columns?: number;
  min_columns?: number;
  max_columns?: number;
  rows?: number | "auto";
  min_rows?: number;
  max_rows?: number;
}
