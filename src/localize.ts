import type { HomeAssistant } from "./types";

export type SupportedLocale = "es" | "en";

const TRANSLATIONS: Record<SupportedLocale, Record<string, string>> = {
  es: {
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
    refresh_error: "No se pudo actualizar. Espera unos segundos e inténtalo de nuevo.",
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
    editor_refresh_entity: "Botón de actualización (detección automática)",
    editor_lines: "Filtrar líneas en esta tarjeta (opcional)",
  },
  en: {
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
    refresh_error: "Unable to refresh right now. Wait a moment and try again.",
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
    editor_refresh_entity: "Refresh button override (auto-detected)",
    editor_lines: "Filter lines on this card (optional)",
  },
};

export function resolveLocale(hass?: HomeAssistant): SupportedLocale {
  const raw = (
    hass?.locale?.language ||
    hass?.language ||
    (typeof navigator !== "undefined" ? navigator.language : "es")
  ).toLowerCase();
  return raw.startsWith("es") ? "es" : "en";
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
