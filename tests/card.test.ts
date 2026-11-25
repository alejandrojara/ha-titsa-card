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

  it("shows paused state instead of stale arrivals when a paused manual snapshot is older than 4 minutes", async () => {
    const sixMinAgoIso = new Date(Date.now() - 6 * 60_000).toISOString();
    const hass = createHass({
      polling_paused: true,
      manual_snapshot: true,
      last_estimation: sixMinAgoIso,
    });
    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      max_arrivals: 2,
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const root = card.shadowRoot!;
    expect(root.querySelector(".state-title")?.textContent).toBe("Sondeo en pausa");
    expect(root.querySelectorAll(".arrival-row")).toHaveLength(0);
    expect(root.querySelector(".manual-tag")).toBeNull();
    expect(root.querySelector(".expand-btn")).toBeNull();
    expect(root.querySelector(".cta-btn")?.textContent).toContain("Consultar ahora");
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

    const form = editor.shadowRoot!.querySelector("ha-form")! as HTMLElement & {
      data: TitsaCardConfig;
      schema: Array<{ name: string; selector: Record<string, unknown> }>;
      computeLabel: (item: { name: string }) => string;
    };

    expect(form.data.open_line_url).toBe(true);
    expect(form.schema.find((s) => s.name === "open_line_url")).toEqual({
      name: "open_line_url",
      selector: { boolean: {} },
    });
    expect(form.computeLabel({ name: "open_line_url" })).toBe(
      "Abrir ficha de línea en titsa.com al pulsar",
    );

    editor.hass = createHass({}, "2026-11-20T13:55:23+00:00", "en");
    await editor.updateComplete;
    expect(form.computeLabel({ name: "open_line_url" })).toBe(
      "Open line info on titsa.com on tap",
    );

    form.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            entity: "sensor.tres_de_mayo_9386_proxima_guagua",
            style: "minimal",
            title: "   ",
            lines: ["015", "233", "15"],
            max_arrivals: 6,
            open_line_url: false,
          },
        },
      }),
    );

    expect(received).toHaveLength(1);
    expect(received[0].style).toBe("minimal");
    expect(received[0].title).toBeUndefined();
    expect(received[0].lines).toEqual(["15", "233"]);
    expect(received[0].max_arrivals).toBe(6);
    expect(received[0].open_line_url).toBe(false);
  });

  it("handles contextual interaction when arrivals are shown: row links to titsa.com, header & footer refresh without double-firing", async () => {
    const nowIso = new Date(Date.now() + 5 * 60_000).toISOString();
    const hass = createHass();
    const sensorAttrs = hass.states["sensor.tres_de_mayo_9386_proxima_guagua"]!.attributes as {
      arrivals: Array<Record<string, unknown>>;
    };
    sensorAttrs.arrivals.push({
      line: "LANZADERA",
      destination: "PARQUE RURAL ANAGA",
      minutes: 25,
      estimated_arrival: nowIso,
      is_approximate: false,
    });

    const card = document.createElement("ha-titsa-card") as HaTitsaCard;
    card.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      max_arrivals: 2,
    });
    card.hass = hass;
    document.body.appendChild(card);
    await card.updateComplete;

    const root = card.shadowRoot!;
    const assertNoNestedInteractive = () => {
      const selector = 'a, button, [role="button"], [tabindex="0"]';
      const nodes = [...root.querySelectorAll(selector)];
      for (const el of nodes) {
        let parent = el.parentElement;
        while (parent) {
          expect(parent.matches(selector)).toBe(false);
          parent = parent.parentElement;
        }
      }
    };
    assertNoNestedInteractive();

    // Expand to inspect all 5 rows including non-numeric shuttle
    const expandBtn = root.querySelector(".expand-btn") as HTMLButtonElement;
    expandBtn.click();
    await card.updateComplete;
    expect(hass.callService).not.toHaveBeenCalled();

    // Keyboard activation on expand button MUST NOT trigger refresh
    expandBtn.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expandBtn.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(hass.callService).not.toHaveBeenCalled();

    const links = root.querySelectorAll("a.arrival-link") as NodeListOf<HTMLAnchorElement>;
    expect(links).toHaveLength(5);
    expect(links[0].getAttribute("href")).toBe(
      "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios/linea-015",
    );
    expect(links[1].getAttribute("href")).toBe(
      "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios/linea-233",
    );
    expect(links[2].getAttribute("href")).toBe(
      "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios/linea-975",
    );
    expect(links[4].getAttribute("href")).toBe(
      "https://titsa.com/index.php/tus-guaguas/lineas-y-horarios",
    );

    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
      const chevron = link.querySelector("ha-icon.row-chevron");
      expect(chevron?.getAttribute("icon")).toBe("mdi:chevron-right");
      expect(chevron?.getAttribute("aria-hidden")).toBe("true");
    }

    // Tapping anywhere inside an arrival row (link, pill, destination, ETA, chevron) MUST NOT refresh
    links[0].click();
    (links[0].querySelector(".line-pill") as HTMLElement).click();
    (links[0].querySelector(".destination") as HTMLElement).click();
    (links[0].querySelector(".eta-badge") as HTMLElement).click();
    (links[0].querySelector(".row-chevron") as HTMLElement).click();
    links[0].dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(hass.callService).not.toHaveBeenCalled();

    const resetRefreshing = async () => {
      (card as unknown as { _refreshing: boolean })._refreshing = false;
      await card.updateComplete;
    };

    // Clicking header parts (emblem, title, stop code) triggers refresh ONCE each
    (root.querySelector(".bus-emblem") as HTMLElement).click();
    expect(hass.callService).toHaveBeenCalledTimes(1);
    await resetRefreshing();

    (root.querySelector(".stop-title") as HTMLElement).click();
    expect(hass.callService).toHaveBeenCalledTimes(2);
    await resetRefreshing();

    (root.querySelector(".stop-code-chip") as HTMLElement).click();
    expect(hass.callService).toHaveBeenCalledTimes(3);
    await resetRefreshing();

    // Clicking refresh button triggers refresh ONCE (no double firing via header bubble)
    (root.querySelector(".refresh-btn") as HTMLButtonElement).click();
    expect(hass.callService).toHaveBeenCalledTimes(4);
    await resetRefreshing();

    // Clicking footer text triggers refresh ONCE
    (root.querySelector(".footer-left") as HTMLElement).click();
    expect(hass.callService).toHaveBeenCalledTimes(5);
  });

  it("refreshes when tapping anywhere in paused, empty, or unavailable states and prevents nested interactive elements", async () => {
    const assertNoNestedInteractive = (root: ShadowRoot) => {
      const selector = 'a, button, [role="button"], [tabindex="0"]';
      for (const el of root.querySelectorAll(selector)) {
        let parent = el.parentElement;
        while (parent) {
          expect(parent.matches(selector)).toBe(false);
          parent = parent.parentElement;
        }
      }
    };

    // 1. Paused state: tap anywhere on card refreshes once
    const pausedHass = createHass({ arrivals: [], polling_paused: true, manual_snapshot: false });
    const pausedCard = document.createElement("ha-titsa-card") as HaTitsaCard;
    pausedCard.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
    });
    pausedCard.hass = pausedHass;
    document.body.appendChild(pausedCard);
    await pausedCard.updateComplete;

    assertNoNestedInteractive(pausedCard.shadowRoot!);
    expect(pausedCard.shadowRoot!.querySelector("ha-card")?.classList.contains("card-interactive")).toBe(
      true,
    );
    (pausedCard.shadowRoot!.querySelector(".state-subtitle") as HTMLElement).click();
    expect(pausedHass.callService).toHaveBeenCalledTimes(1);

    (pausedCard as unknown as { _refreshing: boolean })._refreshing = false;
    await pausedCard.updateComplete;
    (pausedCard.shadowRoot!.querySelector("ha-card") as HTMLElement).click();
    expect(pausedHass.callService).toHaveBeenCalledTimes(2);

    // 2. Empty state: click + keyboard Enter/Space on state-box refresh once
    const emptyHass = createHass({ arrivals: [], polling_paused: false });
    const emptyCard = document.createElement("ha-titsa-card") as HaTitsaCard;
    emptyCard.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
    });
    emptyCard.hass = emptyHass;
    document.body.appendChild(emptyCard);
    await emptyCard.updateComplete;

    assertNoNestedInteractive(emptyCard.shadowRoot!);
    const stateBox = emptyCard.shadowRoot!.querySelector(".state-box") as HTMLElement;
    expect(stateBox.getAttribute("role")).toBe("button");
    expect(stateBox.getAttribute("tabindex")).toBe("0");

    stateBox.click();
    expect(emptyHass.callService).toHaveBeenCalledTimes(1);

    (emptyCard as unknown as { _refreshing: boolean })._refreshing = false;
    await emptyCard.updateComplete;
    stateBox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(emptyHass.callService).toHaveBeenCalledTimes(2);

    (emptyCard as unknown as { _refreshing: boolean })._refreshing = false;
    await emptyCard.updateComplete;
    stateBox.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(emptyHass.callService).toHaveBeenCalledTimes(3);

    // 3. Unavailable state: tap anywhere refreshes; tap_to_refresh: false disables card tap
    const unavailHass = createHass({ arrivals: [] }, "unavailable");
    const unavailCard = document.createElement("ha-titsa-card") as HaTitsaCard;
    unavailCard.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      tap_to_refresh: true,
    });
    unavailCard.hass = unavailHass;
    document.body.appendChild(unavailCard);
    await unavailCard.updateComplete;

    assertNoNestedInteractive(unavailCard.shadowRoot!);
    (unavailCard.shadowRoot!.querySelector(".state-title") as HTMLElement).click();
    expect(unavailHass.callService).toHaveBeenCalledTimes(1);

    unavailCard.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      tap_to_refresh: false,
    });
    (unavailCard as unknown as { _refreshing: boolean })._refreshing = false;
    await unavailCard.updateComplete;

    (unavailCard.shadowRoot!.querySelector(".state-title") as HTMLElement).click();
    expect(unavailHass.callService).toHaveBeenCalledTimes(1);
    (unavailCard.shadowRoot!.querySelector(".cta-btn") as HTMLButtonElement).click();
    expect(unavailHass.callService).toHaveBeenCalledTimes(2);
  });

  it("decouples open_line_url from tap_to_refresh for kiosk/wall panels", async () => {
    // Mode A: open_line_url: false, tap_to_refresh: true (kiosk/wall panel)
    const hassA = createHass();
    const cardA = document.createElement("ha-titsa-card") as HaTitsaCard;
    cardA.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      open_line_url: false,
      tap_to_refresh: true,
    });
    cardA.hass = hassA;
    document.body.appendChild(cardA);
    await cardA.updateComplete;

    const rootA = cardA.shadowRoot!;
    expect(rootA.querySelectorAll("a.arrival-link")).toHaveLength(0);
    expect(rootA.querySelectorAll(".row-chevron")).toHaveLength(0);
    const staticRows = rootA.querySelectorAll("li.arrival-row.static");
    expect(staticRows).toHaveLength(4);

    // Tapping a static row does not refresh; header & footer still refresh
    (staticRows[0] as HTMLElement).click();
    expect(hassA.callService).not.toHaveBeenCalled();

    (rootA.querySelector(".stop-title") as HTMLElement).click();
    expect(hassA.callService).toHaveBeenCalledTimes(1);

    (cardA as unknown as { _refreshing: boolean })._refreshing = false;
    await cardA.updateComplete;
    (rootA.querySelector(".footer-left") as HTMLElement).click();
    expect(hassA.callService).toHaveBeenCalledTimes(2);

    // Mode B: open_line_url: true, tap_to_refresh: false
    const hassB = createHass();
    const cardB = document.createElement("ha-titsa-card") as HaTitsaCard;
    cardB.setConfig({
      type: "custom:ha-titsa-card",
      entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      open_line_url: true,
      tap_to_refresh: false,
    });
    cardB.hass = hassB;
    document.body.appendChild(cardB);
    await cardB.updateComplete;

    const rootB = cardB.shadowRoot!;
    expect(rootB.querySelectorAll("a.arrival-link")).toHaveLength(4);
    expect(rootB.querySelectorAll(".row-chevron")).toHaveLength(4);

    // Header and footer taps do NOT refresh, but explicit refresh button still works
    (rootB.querySelector(".stop-title") as HTMLElement).click();
    (rootB.querySelector(".footer-left") as HTMLElement).click();
    expect(hassB.callService).not.toHaveBeenCalled();

    (rootB.querySelector(".refresh-btn") as HTMLButtonElement).click();
    expect(hassB.callService).toHaveBeenCalledTimes(1);
  });

  it("includes open_line_url: true in getStubConfig and keeps package.json, hacs.json, and CARD_VERSION in sync", async () => {
    const { CARD_VERSION, HaTitsaCard: CardClass } = await import("../src/index");
    const pkg = (await import("../package.json", { with: { type: "json" } })).default;
    const hacs = (await import("../hacs.json", { with: { type: "json" } })).default;

    expect(CardClass.getStubConfig().open_line_url).toBe(true);
    expect(CARD_VERSION).toBe(pkg.version);
    expect(hacs.filename).toBe("ha-titsa-card.js");
    expect(hacs.render_readme).toBe(true);
  });
});
