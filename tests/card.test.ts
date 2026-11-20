import { afterEach, describe, expect, it, vi } from "vitest";
import "../src/index";
import type { HaTitsaCardEditor } from "../src/editor";
import type { HaTitsaCard } from "../src/ha-titsa-card";
import type { HomeAssistant, TitsaCardConfig } from "../src/types";

function createHass(
  sensorOverrides: Record<string, unknown> = {},
  state: string = "2026-11-20T13:55:23+00:00",
  language = "es",
): HomeAssistant {
  const nowIso = new Date(Date.now()).toISOString();
  const in3Min = new Date(Date.now() + 3 * 60_000).toISOString();
  const in14Min = new Date(Date.now() + 14 * 60_000).toISOString();
  const in60Min = new Date(Date.now() + 60 * 60_000).toISOString();

  return {
    language,
    locale: { language },
    callService: vi.fn().mockResolvedValue(undefined),
    entities: {
      "sensor.tres_de_mayo_9386_proxima_guagua": {
        entity_id: "sensor.tres_de_mayo_9386_proxima_guagua",
        device_id: "dev_9386",
      },
      "button.tres_de_mayo_9386_actualizar": {
        entity_id: "button.tres_de_mayo_9386_actualizar",
        device_id: "dev_9386",
      },
    },
    states: {
      "sensor.tres_de_mayo_9386_proxima_guagua": {
        entity_id: "sensor.tres_de_mayo_9386_proxima_guagua",
        state,
        attributes: {
          stop_id: "9386",
          stop_name: "Tres de Mayo",
          filtered_lines: [],
          arrivals: [
            {
              line: "15",
              line_name: "SANTA CRUZ - LA LAGUNA (DIRECTA)",
              destination: "INTERCAMBIADOR LAGUNA",
              minutes: 0,
              estimated_arrival: nowIso,
              is_approximate: false,
            },
            {
              line: "233",
              line_name: "INTERCAMBIADOR SANTA CRUZ - FINCA ESPAÑA",
              destination: "FINCA ESPAÑA",
              minutes: 3,
              estimated_arrival: in3Min,
              is_approximate: false,
            },
            {
              line: "975",
              line_name: "NOCTURNA",
              destination: "LA GALLEGA",
              minutes: 14,
              estimated_arrival: in14Min,
              is_approximate: false,
            },
            {
              line: "102",
              line_name: "PUERTO DE LA CRUZ",
              destination: "PUERTO DE LA CRUZ",
              minutes: 60,
              estimated_arrival: in60Min,
              is_approximate: true,
            },
          ],
          last_estimation: nowIso,
          polling_paused: false,
          manual_snapshot: false,
          ...sensorOverrides,
        },
      },
      "button.tres_de_mayo_9386_actualizar": {
        entity_id: "button.tres_de_mayo_9386_actualizar",
        state: "unknown",
        attributes: {},
      },
    },
  };
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

describe("ha-titsa-card", () => {
  it("registers card metadata in window.customCards and exposes Sections grid options", () => {
    expect(window.customCards?.some((c) => c.type === "ha-titsa-card")).toBe(true);
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    expect(card.getGridOptions()).toEqual({
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: 2,
    });
  });

  it("renders arrivals, night line styling, approximate >60 min, and expand toggle without refreshing", async () => {
    const hass = createHass();
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      max_arrivals: 2,
      show_route_name: true,
      show_arrival_time: true,
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const root = card.shadowRoot!;
    expect(root.querySelector(".stop-title")?.textContent).toBe("Tres de Mayo");
    expect(root.querySelector(".stop-code-chip")?.textContent).toBe("#9386");

    const rows = root.querySelectorAll(".arrival-row");
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector(".line-pill")?.textContent).toBe("15");
    expect(rows[0].querySelector(".eta-badge.now")?.textContent).toBe("Ahora");
    expect(rows[1].querySelector(".eta-badge.imminent")?.textContent).toBe("3 min");

    // Expand toggle shows all 4 arrivals and MUST NOT trigger button.press
    const expandBtn = root.querySelector(".expand-btn") as HTMLButtonElement;
    expect(expandBtn.textContent?.trim()).toBe("Ver 2 más");
    expandBtn.click();
    await card.updateComplete;

    const allRows = root.querySelectorAll(".arrival-row");
    expect(allRows.length).toBe(4);
    expect(allRows[2].querySelector(".line-pill.night")?.textContent).toBe("975");
    expect(allRows[3].querySelector(".eta-badge")?.textContent).toBe(">60 min");
    expect(hass.callService).not.toHaveBeenCalled();
  });

  it("renders paused state and triggers button.press on CTA click and surfaces cooldown notice", async () => {
    const hass = createHass({
      arrivals: [],
      polling_paused: true,
      manual_snapshot: false,
    });
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const root = card.shadowRoot!;
    expect(root.querySelector(".state-title")?.textContent).toBe("Sondeo en pausa");

    const cta = root.querySelector(".cta-btn") as HTMLButtonElement;
    cta.click();
    await card.updateComplete;

    expect(hass.callService).toHaveBeenCalledWith("button", "press", undefined, {
      entity_id: "button.tres_de_mayo_9386_actualizar",
    });

    // Simulate real Home Assistant WebSocket HomeAssistantError payload
    // (HA sends English fallback in `message` + `translation_key` for frontend localization)
    hass.callService = vi.fn().mockRejectedValue({
      code: "home_assistant_error",
      message: "Please wait 25 seconds before refreshing this stop again.",
      translation_domain: "titsa",
      translation_key: "refresh_cooldown",
      translation_placeholders: { seconds: "25" },
    });
    (card as unknown as { _refreshing: boolean })._refreshing = false;
    await card.updateComplete;
    cta.click();
    await new Promise((r) => setTimeout(r, 10));
    await card.updateComplete;

    expect(root.querySelector(".notice")?.textContent).toContain(
      "Espera 25 segundos antes de volver a actualizar esta parada.",
    );
  });

  it("supports card-level line filtering, dark mode class, and English localization", async () => {
    const hass = createHass({}, "2026-11-20T13:55:23+00:00", "en");
    hass.themes = { darkMode: true };
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      lines: ["015"],
      style: "minimal",
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const root = card.shadowRoot!;
    expect(root.querySelector("ha-card")?.classList.contains("dark")).toBe(true);
    expect(root.querySelector(".header.minimal")).not.toBeNull();
    const rows = root.querySelectorAll(".arrival-row");
    expect(rows.length).toBe(1);
    expect(rows[0].querySelector(".eta-badge.now")?.textContent).toBe("Now");
  });

  it("renders individual per-line ha-titsa sensors seamlessly", async () => {
    const in6Min = new Date(Date.now() + 6 * 60_000).toISOString();
    const in18Min = new Date(Date.now() + 18 * 60_000).toISOString();
    const hass = createHass();
    hass.states["sensor.tres_de_mayo_9386_linea_15"] = {
      entity_id: "sensor.tres_de_mayo_9386_linea_15",
      state: in6Min,
      attributes: {
        stop_id: "9386",
        stop_name: "Tres de Mayo",
        line: "15",
        line_name: "SANTA CRUZ - LA LAGUNA",
        destination: "INTERCAMBIADOR LAGUNA",
        minutes: 6,
        following_arrivals: [
          {
            destination: "INTERCAMBIADOR LAGUNA",
            minutes: 18,
            estimated_arrival: in18Min,
            is_approximate: false,
          },
        ],
        last_estimation: new Date().toISOString(),
        polling_paused: false,
      },
    };
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_linea_15",
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const rows = card.shadowRoot!.querySelectorAll(".arrival-row");
    expect(rows.length).toBe(2);
    expect(rows[0].querySelector(".line-pill")?.textContent).toBe("15");
    expect(rows[0].querySelector(".eta-badge")?.textContent).toBe("6 min");
    expect(rows[1].querySelector(".eta-badge")?.textContent).toBe("18 min");
  });

  it("emits normalized config-changed events from visual editor", async () => {
    const hass = createHass();
    const editor = document.createElement("ha-titsa-card-editor") as HaTitsaCardEditor;
    editor.hass = hass;
    editor.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
    });
    document.body.appendChild(editor);
    await editor.updateComplete;

    const received: TitsaCardConfig[] = [];
    editor.addEventListener("config-changed", (ev: Event) => {
      received.push((ev as CustomEvent<{ config: TitsaCardConfig }>).detail.config);
    });

    const form = editor.shadowRoot!.querySelector("ha-form")!;
    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            entity: "sensor.tres_de_mayo_9386_proxima_guagua",
            style: "minimal",
            title: "   ",
            lines: ["015", "233", "15"],
            max_arrivals: 6,
          },
        },
      }),
    );

    expect(received).toHaveLength(1);
    expect(received[0].style).toBe("minimal");
    expect(received[0].title).toBeUndefined();
    expect(received[0].lines).toEqual(["15", "233"]);
    expect(received[0].max_arrivals).toBe(6);
  });

  it("keeps package.json, hacs.json, and CARD_VERSION in sync", async () => {
    const { CARD_VERSION } = await import("../src/index");
    const pkg = (await import("../package.json", { with: { type: "json" } })).default;
    const hacs = (await import("../hacs.json", { with: { type: "json" } })).default;

    expect(CARD_VERSION).toBe(pkg.version);
    expect(hacs.filename).toBe("ha-titsa-card.js");
    expect(hacs.render_readme).toBe(true);
  });
});
