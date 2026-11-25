import type { CustomCardRegistration, HassServiceError, HomeAssistant } from "./types";

export type SupportedLocale = "es" | "en";

export const TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  es: {
    card_name: "Tarjeta de parada TITSA",
    card_description:
      "Tarjeta no oficial estilo marquesina para llegadas en tiempo real de TITSA (Tenerife).",
    now: "Ahora",
    min_short: "min",
    stop_prefix: "Parada",
    refresh: "Actualizar",
    check_now: "Consultar ahora",
    paused_title: "Sondeo en pausa",
    paused_subtitle: "Fuera de ventana horaria o en modo manual.",
    empty_title: "Sin llegadas estimadas",
    empty_subtitle: "No hay guaguas aproximándose en este momento.",
    unavailable_title: "Parada no disponible",
    unavailable_subtitle: "Comprueba la conexión con la integración TITSA.",
    entity_missing_title: "Entidad no encontrada",
    entity_missing_subtitle: "Selecciona un sensor de parada de TITSA en el editor.",
    updated_at: "Actualizado",
    manual_badge: "Manual",
    show_more: "Ver {count} más",
    show_less: "Ver menos",
    no_refresh_button: "Botón de actualización no encontrado",
    refresh_cooldown: "Espera {seconds} segundos antes de volver a actualizar esta parada.",
    refresh_cooldown_one: "Espera 1 segundo antes de volver a actualizar esta parada.",
    refresh_error: "No se pudo actualizar. Espera unos segundos e inténtalo de nuevo.",
    open_line_tooltip: "Ver ficha de la línea {line} en titsa.com",
    open_line_aria: "Línea {line}, {destination}, {eta}. Abrir ficha en titsa.com",
    open_line_aria_no_dest: "Línea {line}, {eta}. Abrir ficha en titsa.com",
    // Editor labels
    editor_entity: "Sensor de parada TITSA",
    editor_title: "Título personalizado (opcional)",
    editor_style: "Estilo visual",
    editor_style_marquesina: "Marquesina TITSA (cabecera verde)",
    editor_style_minimal: "Minimalista (nativo de Home Assistant)",
    editor_max_arrivals: "Máximo de llegadas visibles",
    editor_compact: "Modo compacto",
    editor_show_arrival_time: "Mostrar hora estimada (HH:MM)",
    editor_show_route_name: "Mostrar nombre completo de la línea",
    editor_show_footer: "Mostrar pie con última actualización",
    editor_tap_to_refresh: "Actualizar al pulsar sobre la tarjeta",
    editor_open_line_url: "Abrir ficha de línea en titsa.com al pulsar",
    editor_refresh_entity: "Botón de actualización (detección automática)",
    editor_lines: "Filtrar líneas en esta tarjeta (opcional)",
  },
  en: {
    card_name: "TITSA Bus Stop Card",
    card_description:
      "Unofficial bus-shelter marquee card for TITSA (Tenerife) real-time arrivals.",
    now: "Now",
    min_short: "min",
    stop_prefix: "Stop",
    refresh: "Refresh",
    check_now: "Check now",
    paused_title: "Polling paused",
    paused_subtitle: "Outside schedule window or manual-only mode.",
    empty_title: "No upcoming buses",
    empty_subtitle: "No buses are approaching this stop right now.",
    unavailable_title: "Stop unavailable",
    unavailable_subtitle: "Check the TITSA integration connection.",
    entity_missing_title: "Entity not found",
    entity_missing_subtitle: "Select a TITSA stop sensor in the card editor.",
    updated_at: "Updated",
    manual_badge: "Manual",
    show_more: "Show {count} more",
    show_less: "Show less",
    no_refresh_button: "Refresh button entity not found",
    refresh_cooldown: "Please wait {seconds} seconds before refreshing this stop again.",
    refresh_cooldown_one: "Please wait 1 second before refreshing this stop again.",
    refresh_error: "Unable to refresh right now. Wait a moment and try again.",
    open_line_tooltip: "View line {line} info on titsa.com",
    open_line_aria: "Line {line}, {destination}, {eta}. Open line info on titsa.com",
    open_line_aria_no_dest: "Line {line}, {eta}. Open line info on titsa.com",
    // Editor labels
    editor_entity: "TITSA stop sensor",
    editor_title: "Custom title (optional)",
    editor_style: "Visual style",
    editor_style_marquesina: "TITSA Bus Shelter (green header)",
    editor_style_minimal: "Minimal (native Home Assistant)",
    editor_max_arrivals: "Maximum visible arrivals",
    editor_compact: "Compact mode",
    editor_show_arrival_time: "Show estimated clock time (HH:MM)",
    editor_show_route_name: "Show full route description",
    editor_show_footer: "Show footer with last update",
    editor_tap_to_refresh: "Tap card to refresh",
    editor_open_line_url: "Open line info on titsa.com on tap",
    editor_refresh_entity: "Refresh button override (auto-detected)",
    editor_lines: "Filter lines on this card (optional)",
  },
};

function readStoredHaLanguage(): string | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage?.getItem("selectedLanguage");
    if (!raw) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "string" && parsed.trim() ? parsed.trim() : undefined;
  } catch {
    return undefined;
  }
}

export function resolveLocale(hass?: HomeAssistant): SupportedLocale {
  const candidates: Array<string | null | undefined> = [
    hass?.selectedLanguage,
    hass?.language,
    hass?.locale?.language,
    hass?.config?.language,
    readStoredHaLanguage(),
    typeof document !== "undefined" ? document.documentElement?.lang : undefined,
    typeof navigator !== "undefined" ? navigator.language : undefined,
  ];
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      const lower = candidate.trim().toLowerCase();
      return lower.startsWith("es") ? "es" : "en";
    }
  }
  return "es";
}

export function localize(
  hass: HomeAssistant | undefined,
  key: string,
  replacements?: Record<string, string | number>,
): string {
  const lang = resolveLocale(hass);
  let text = TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  if (replacements) {
    for (const [placeholder, value] of Object.entries(replacements)) {
      text = text.replace(`{${placeholder}}`, String(value));
    }
  }
  return text;
}

function formatCooldownMessage(hass: HomeAssistant | undefined, rawSeconds: unknown): string {
  const parsed = Number.parseInt(String(rawSeconds ?? ""), 10);
  if (!Number.isNaN(parsed) && parsed <= 1) {
    return localize(hass, "refresh_cooldown_one");
  }
  const seconds = !Number.isNaN(parsed) && parsed > 0 ? parsed : 30;
  return localize(hass, "refresh_cooldown", { seconds });
}

/**
 * Localize errors returned by Home Assistant's callService WebSocket command.
 * HA always places the English fallback in `err.message` and passes
 * `translation_domain`, `translation_key`, and `translation_placeholders`
 * so the frontend can translate into the user's active UI language.
 */
export function formatServiceError(hass: HomeAssistant | undefined, err: unknown): string {
  if (err && typeof err === "object") {
    const haErr = err as HassServiceError;

    // 1. Direct match for ha-titsa's cooldown exception
    if (haErr.translation_domain === "titsa" && haErr.translation_key === "refresh_cooldown") {
      return formatCooldownMessage(hass, haErr.translation_placeholders?.seconds);
    }

    // 2. Delegate other translated HA exceptions to hass.localize when loaded
    if (
      haErr.translation_domain &&
      haErr.translation_key &&
      typeof hass?.localize === "function"
    ) {
      const translated = hass.localize(
        `component.${haErr.translation_domain}.exceptions.${haErr.translation_key}.message`,
        haErr.translation_placeholders ?? {},
      );
      if (translated && translated.trim()) {
        return translated;
      }
    }

    // 3. Fallback parsing on English/Spanish message text
    if (typeof haErr.message === "string" && haErr.message.trim()) {
      const rawMsg = haErr.message.trim();
      const cooldownMatch = rawMsg.match(/(?:please\s+wait|espera)\s+(\d+)\s+second|espera\s+(\d+)\s+segundo/i);
      if (cooldownMatch) {
        return formatCooldownMessage(hass, cooldownMatch[1] ?? cooldownMatch[2]);
      }
      if (/not found/i.test(rawMsg)) {
        return localize(hass, "no_refresh_button");
      }
      if (
        resolveLocale(hass) === "es" &&
        /^(?:failed to|unable to|error fetching|rate limited|service .+ not found|action .+ not found)/i.test(
          rawMsg,
        )
      ) {
        return localize(hass, "refresh_error");
      }
      return rawMsg;
    }
  }

  return localize(hass, "refresh_error");
}

declare global {
  interface Window {
    customCards?: CustomCardRegistration[];
  }
}

/** Keep the Home Assistant card picker entry localized to the active UI language. */
export function syncCustomCardMetadata(hass?: HomeAssistant): void {
  if (typeof window === "undefined" || !Array.isArray(window.customCards)) return;
  const entry = window.customCards.find((card) => card.type === "ha-titsa-card");
  if (!entry) return;
  const name = localize(hass, "card_name");
  const description = localize(hass, "card_description");
  if (entry.name !== name) entry.name = name;
  if (entry.description !== description) entry.description = description;
}
