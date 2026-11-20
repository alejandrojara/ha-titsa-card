import type {
  HassEntity,
  HomeAssistant,
  TitsaArrival,
  TitsaCardConfig,
  TitsaSensorAttributes,
} from "./types";

const SPANISH_PARTICLES = new Set([
  "de",
  "del",
  "la",
  "las",
  "los",
  "el",
  "y",
  "e",
  "a",
  "al",
  "en",
  "con",
  "por",
  "lo",
]);

const PRESERVE_UPPER = new Set(["TFS", "TFN", "ULL", "IES", "CEIP", "S/C", "SC", "TITSA", "(T)"]);

/** Normalize a TITSA line code ('015' -> '15', '238' -> '238', '030a' -> '30A'). */
export function normalizeLineCode(raw: string): string {
  const cleaned = raw.trim().toUpperCase();
  if (!cleaned) return "";
  const match = cleaned.match(/^0*(\d+)([A-Z]*)$/);
  if (match) {
    const num = match[1].replace(/^0+/, "") || "0";
    return `${num}${match[2]}`;
  }
  return cleaned;
}

/** Format ALL-CAPS TITSA destinations cleanly into readable Title Case. */
export function formatDestination(raw: string): string {
  const collapsed = raw
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.(?=[A-ZÁÉÍÓÚÜÑ]{2})/g, ". ");
  if (!collapsed) return "";
  if (collapsed !== collapsed.toUpperCase()) return collapsed;

  const tokens = collapsed.split(" ");
  return tokens
    .map((token, idx) => {
      if (PRESERVE_UPPER.has(token) || /^(?:[A-ZÁÉÍÓÚÜÑ]\.){2,}$/.test(token)) {
        return token;
      }
      const lower = token.toLowerCase();
      const match = lower.match(/^([("'\-/]*)([^\W\d_])(.*)$/u);
      if (!match) return token;
      const [, prefix, first, rest] = match;
      const core = first + rest;
      const prevToken = idx > 0 ? tokens[idx - 1] : "";
      const isSegmentStart =
        idx === 0 || /^[-–—/:|]$/.test(prevToken) || /[-–—/:|]$/.test(prevToken);
      if (!isSegmentStart && !prefix && SPANISH_PARTICLES.has(core)) {
        return core;
      }
      return `${prefix}${first.toUpperCase()}${rest}`;
    })
    .join(" ");
}

/**
 * Extract a normalized arrivals list from either an aggregated ha-titsa stop
 * sensor (`arrivals`) or an individual per-line sensor (`line` + `following_arrivals`).
 */
export function extractArrivalsFromEntity(entityObj: HassEntity | undefined): TitsaArrival[] {
  if (!entityObj) return [];
  const attrs = entityObj.attributes as TitsaSensorAttributes;
  if (Array.isArray(attrs.arrivals)) {
    return attrs.arrivals;
  }

  if (typeof attrs.line === "string" && attrs.line.trim()) {
    const results: TitsaArrival[] = [];
    const hasPrimary =
      (typeof attrs.minutes === "number" && !Number.isNaN(attrs.minutes)) ||
      (entityObj.state &&
        entityObj.state !== "unknown" &&
        entityObj.state !== "unavailable" &&
        !Number.isNaN(Date.parse(entityObj.state)));

    if (hasPrimary) {
      results.push({
        line: attrs.line,
        line_name: attrs.line_name ?? undefined,
        destination: attrs.destination ?? "",
        minutes: typeof attrs.minutes === "number" ? attrs.minutes : 0,
        estimated_arrival: entityObj.state,
        is_approximate: false,
      });
    }

    for (const next of attrs.following_arrivals ?? []) {
      results.push({
        line: attrs.line,
        line_name: attrs.line_name ?? undefined,
        destination: next.destination,
        minutes: next.minutes,
        estimated_arrival: next.estimated_arrival,
        is_approximate: next.is_approximate,
      });
    }
    return results;
  }

  return [];
}

/**
 * Compute live countdown minutes from the ISO estimated_arrival timestamp.
 * Falls back to arrival.minutes if estimated_arrival is unavailable/invalid.
 */
export function computeLiveMinutes(arrival: TitsaArrival, nowMs: number = Date.now()): number {
  if (arrival.estimated_arrival) {
    const targetMs = Date.parse(arrival.estimated_arrival);
    if (!Number.isNaN(targetMs)) {
      const diffSec = (targetMs - nowMs) / 1000;
      if (diffSec <= 30) return 0;
      return Math.round(diffSec / 60);
    }
  }
  return Math.max(0, Math.round(arrival.minutes ?? 0));
}

/** Format an ISO8601 timestamp as local HH:MM clock time. */
export function formatClockTime(iso: string | null | undefined, locale: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale === "es" ? "es-ES" : "en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
}

/** Auto-discover the matching TITSA refresh button entity for the configured sensor. */
export function findRefreshButtonEntity(
  hass: HomeAssistant | undefined,
  config: TitsaCardConfig,
): string | undefined {
  if (config.refresh_entity) {
    return config.refresh_entity;
  }
  if (!hass || !config.entity) {
    return undefined;
  }

  // 1. Device-registry match via hass.entities (works regardless of entity_id language/renames)
  const sensorReg = hass.entities?.[config.entity];
  if (sensorReg?.device_id && hass.entities) {
    for (const [entityId, entry] of Object.entries(hass.entities)) {
      if (
        entry?.device_id === sensorReg.device_id &&
        entityId.startsWith("button.") &&
        hass.states[entityId]
      ) {
        return entityId;
      }
    }
  }

  // 2. Smart slug fallback (Spanish _proxima_guagua/_linea_X -> _actualizar, English _next_bus/_line_X -> _refresh)
  const slug = config.entity.replace(/^sensor\./, "");
  const bases = new Set<string>();
  for (const suffix of ["_proxima_guagua", "_next_bus"]) {
    if (slug.endsWith(suffix)) {
      bases.add(slug.slice(0, -suffix.length));
    }
  }
  const lineMatch = slug.match(/^(.+)_(?:linea|line)_[a-z0-9]+$/i);
  if (lineMatch) {
    bases.add(lineMatch[1]);
  }
  for (const base of bases) {
    for (const btnSuffix of ["_actualizar", "_refresh"]) {
      const candidate = `button.${base}${btnSuffix}`;
      if (hass.states[candidate]) {
        return candidate;
      }
    }
  }

  return undefined;
}

/** Pick a sensible default ha-titsa sensor for the Home Assistant card picker stub. */
export function findDefaultTitsaSensor(hass?: HomeAssistant): string {
  if (!hass?.states) return "";
  for (const [entityId, stateObj] of Object.entries(hass.states)) {
    if (!entityId.startsWith("sensor.") || !stateObj) continue;
    const attrs = stateObj.attributes as TitsaSensorAttributes;
    if (attrs && typeof attrs.stop_id === "string" && Array.isArray(attrs.arrivals)) {
      return entityId;
    }
  }
  return "";
}

/** Return sorted list of known lines for an entity (from filtered_lines, line, and live arrivals). */
export function getAvailableLinesForEntity(
  hass: HomeAssistant | undefined,
  entityId: string | undefined,
): string[] {
  if (!hass || !entityId) return [];
  const stateObj = hass.states[entityId];
  if (!stateObj) return [];
  const attrs = stateObj.attributes as TitsaSensorAttributes;
  const set = new Set<string>();
  if (typeof attrs.line === "string") {
    const norm = normalizeLineCode(attrs.line);
    if (norm) set.add(norm);
  }
  for (const line of attrs.filtered_lines ?? []) {
    const norm = normalizeLineCode(String(line));
    if (norm) set.add(norm);
  }
  for (const arrival of attrs.arrivals ?? []) {
    const norm = normalizeLineCode(String(arrival.line));
    if (norm) set.add(norm);
  }
  return [...set].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

/** Check if a TITSA line code is nocturnal (97x series on Tenerife). */
export function isNightLine(lineCode: string): boolean {
  const num = Number.parseInt(lineCode, 10);
  return !Number.isNaN(num) && num >= 970 && num <= 979;
}
