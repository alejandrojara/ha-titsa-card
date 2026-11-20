import { describe, expect, it, vi } from "vitest";
import {
  TRANSLATIONS,
  formatServiceError,
  localize,
  resolveLocale,
  syncCustomCardMetadata,
} from "../src/localize";
import type { HomeAssistant } from "../src/types";

function makeHass(overrides: Partial<HomeAssistant> = {}): HomeAssistant {
  return {
    states: {},
    callService: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe("localization", () => {
  it("keeps Spanish and English translation keys in exact parity", () => {
    expect(Object.keys(TRANSLATIONS.es).sort()).toEqual(Object.keys(TRANSLATIONS.en).sort());
  });

  it("prioritizes Home Assistant UI language (selectedLanguage -> language -> locale.language)", () => {
    expect(
      resolveLocale(
        makeHass({
          selectedLanguage: "es",
          language: "en",
          locale: { language: "en-US" },
        }),
      ),
    ).toBe("es");

    expect(
      resolveLocale(
        makeHass({
          selectedLanguage: null,
          language: "es-419",
          locale: { language: "en-GB" },
        }),
      ),
    ).toBe("es");

    expect(
      resolveLocale(
        makeHass({
          selectedLanguage: null,
          language: "en",
          locale: { language: "en" },
        }),
      ),
    ).toBe("en");
  });

  it("localizes Home Assistant WebSocket cooldown exceptions into Spanish even when err.message is English", () => {
    const hassEs = makeHass({ language: "es" });
    const hassEn = makeHass({ language: "en" });

    const wsCooldownErr = {
      code: "home_assistant_error",
      message: "Please wait 18 seconds before refreshing this stop again.",
      translation_domain: "titsa",
      translation_key: "refresh_cooldown",
      translation_placeholders: { seconds: "18" },
    };

    expect(formatServiceError(hassEs, wsCooldownErr)).toBe(
      "Espera 18 segundos antes de volver a actualizar esta parada.",
    );
    expect(formatServiceError(hassEn, wsCooldownErr)).toBe(
      "Please wait 18 seconds before refreshing this stop again.",
    );

    // Singular second handling
    expect(
      formatServiceError(hassEs, {
        ...wsCooldownErr,
        translation_placeholders: { seconds: "1" },
      }),
    ).toBe("Espera 1 segundo antes de volver a actualizar esta parada.");

    // Plain Error fallback without translation_key metadata
    expect(
      formatServiceError(
        hassEs,
        new Error("Please wait 12 seconds before refreshing this stop again."),
      ),
    ).toBe("Espera 12 segundos antes de volver a actualizar esta parada.");

    // Generic English HA backend error in Spanish UI falls back to Spanish message
    expect(
      formatServiceError(hassEs, new Error("Failed to perform action button/press.")),
    ).toBe(localize(hassEs, "refresh_error"));
  });

  it("syncs window.customCards picker metadata to Spanish or English", () => {
    window.customCards = [
      {
        type: "ha-titsa-card",
        name: "TITSA Bus Stop Card",
        description: "Old English description",
      },
    ];

    syncCustomCardMetadata(makeHass({ language: "es" }));
    expect(window.customCards[0].name).toBe("Tarjeta de parada TITSA");
    expect(window.customCards[0].description).toContain("Tarjeta no oficial estilo marquesina");

    syncCustomCardMetadata(makeHass({ language: "en" }));
    expect(window.customCards[0].name).toBe("TITSA Bus Stop Card");
    expect(window.customCards[0].description).toContain("Unofficial bus-shelter marquee card");
  });
});
