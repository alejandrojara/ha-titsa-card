import { describe, expect, it, vi } from "vitest";
import type { HomeAssistant, TitsaArrival } from "../src/types";
import {
  computeLiveMinutes,
  extractArrivalsFromEntity,
  findDefaultTitsaSensor,
  findRefreshButtonEntity,
  formatDestination,
  isNightLine,
  normalizeLineCode,
} from "../src/utils";

function mockHass(overrides: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    states: {},
    entities: {},
    language: "es",
    callService: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("utils", () => {
  it("normalizes TITSA line codes cleanly", () => {
    expect(normalizeLineCode("015")).toBe("15");
    expect(normalizeLineCode("238")).toBe("238");
    expect(normalizeLineCode("030a")).toBe("30A");
    expect(normalizeLineCode("0")).toBe("0");
    expect(normalizeLineCode("  ")).toBe("");
  });

  it("formats ALL-CAPS TITSA destinations while preserving acronyms", () => {
    expect(formatDestination("INTERCAMBIADOR STA.CRUZ")).toBe("Intercambiador Sta. Cruz");
    expect(formatDestination("EL CARDONAL - LA GALLEGA")).toBe("El Cardonal - La Gallega");
    expect(formatDestination("PUERTO DE LA CRUZ")).toBe("Puerto de la Cruz");
    expect(formatDestination("AEROPUERTO TFS")).toBe("Aeropuerto TFS");
    expect(formatDestination("CAMPUS U.L.L.")).toBe("Campus U.L.L.");
    expect(formatDestination("Intercambiador Laguna")).toBe("Intercambiador Laguna");
  });

  it("computes live ticking countdown minutes from estimated_arrival", () => {
    const baseMs = Date.parse("2026-11-20T13:55:00Z");
    const arrival: TitsaArrival = {
      line: "238",
      destination: "SAN MATIAS",
      minutes: 10,
      estimated_arrival: "2026-11-20T14:05:00Z",
    };

    expect(computeLiveMinutes(arrival, baseMs)).toBe(10);
    // 4 minutes later -> ticks down to 6 min locally
    expect(computeLiveMinutes(arrival, baseMs + 4 * 60_000)).toBe(6);
    // Within 30 seconds or past -> 0 ("Ahora")
    expect(computeLiveMinutes(arrival, baseMs + 9.6 * 60_000)).toBe(0);
    expect(computeLiveMinutes(arrival, baseMs + 12 * 60_000)).toBe(0);
  });

  it("extracts arrivals from both aggregated stop sensors and per-line sensors", () => {
    const lineEntity = {
      entity_id: "sensor.tres_de_mayo_9386_linea_15",
      state: "2026-11-20T14:02:00Z",
      attributes: {
        stop_id: "9386",
        stop_name: "Tres de Mayo",
        line: "15",
        line_name: "SANTA CRUZ - LA LAGUNA",
        destination: "INTERCAMBIADOR LAGUNA",
        minutes: 4,
        following_arrivals: [
          {
            destination: "INTERCAMBIADOR LAGUNA",
            minutes: 14,
            estimated_arrival: "2026-11-20T14:12:00Z",
            is_approximate: false,
          },
        ],
      },
    };
    const arrivals = extractArrivalsFromEntity(lineEntity);
    expect(arrivals).toHaveLength(2);
    expect(arrivals[0]).toMatchObject({
      line: "15",
      destination: "INTERCAMBIADOR LAGUNA",
      minutes: 4,
    });
    expect(arrivals[1]).toMatchObject({
      line: "15",
      minutes: 14,
    });
  });

  it("auto-discovers refresh button via device_id and slug fallback", () => {
    const hassWithDevice = mockHass({
      states: {
        "sensor.mi_parada_custom": { entity_id: "sensor.mi_parada_custom", state: "ok", attributes: {} },
        "button.mi_boton_custom": { entity_id: "button.mi_boton_custom", state: "unknown", attributes: {} },
      },
      entities: {
        "sensor.mi_parada_custom": { entity_id: "sensor.mi_parada_custom", device_id: "dev_1" },
        "button.mi_boton_custom": { entity_id: "button.mi_boton_custom", device_id: "dev_1" },
      },
    });
    expect(
      findRefreshButtonEntity(hassWithDevice, {
        type: "custom:ha-titsa-card",
        entity: "sensor.mi_parada_custom",
      }),
    ).toBe("button.mi_boton_custom");

    const hassSlugFallback = mockHass({
      states: {
        "sensor.tres_de_mayo_9386_proxima_guagua": {
          entity_id: "sensor.tres_de_mayo_9386_proxima_guagua",
          state: "ok",
          attributes: {},
        },
        "sensor.tres_de_mayo_9386_linea_15": {
          entity_id: "sensor.tres_de_mayo_9386_linea_15",
          state: "ok",
          attributes: {},
        },
        "button.tres_de_mayo_9386_actualizar": {
          entity_id: "button.tres_de_mayo_9386_actualizar",
          state: "unknown",
          attributes: {},
        },
      },
    });
    expect(
      findRefreshButtonEntity(hassSlugFallback, {
        type: "custom:ha-titsa-card",
        entity: "sensor.tres_de_mayo_9386_proxima_guagua",
      }),
    ).toBe("button.tres_de_mayo_9386_actualizar");
    expect(
      findRefreshButtonEntity(hassSlugFallback, {
        type: "custom:ha-titsa-card",
        entity: "sensor.tres_de_mayo_9386_linea_15",
      }),
    ).toBe("button.tres_de_mayo_9386_actualizar");
  });

  it("picks default ha-titsa sensor for getStubConfig and identifies night lines", () => {
    const hass = mockHass({
      states: {
        "sensor.temperature": { entity_id: "sensor.temperature", state: "22", attributes: {} },
        "sensor.tres_de_mayo_9386_proxima_guagua": {
          entity_id: "sensor.tres_de_mayo_9386_proxima_guagua",
          state: "2026-11-20T13:55:23Z",
          attributes: { stop_id: "9386", arrivals: [] },
        },
      },
    });
    expect(findDefaultTitsaSensor(hass)).toBe("sensor.tres_de_mayo_9386_proxima_guagua");
    expect(isNightLine("975")).toBe(true);
    expect(isNightLine("238")).toBe(false);
  });
});
