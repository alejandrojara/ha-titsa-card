import "./editor";
import "./ha-titsa-card";
import { localize } from "./localize";

export { HaTitsaCardEditor } from "./editor";
export { HaTitsaCard } from "./ha-titsa-card";
export * from "./types";

export const CARD_VERSION = "20261125.0";

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "ha-titsa-card")) {
  window.customCards.push({
    type: "ha-titsa-card",
    name: localize(undefined, "card_name"),
    description: localize(undefined, "card_description"),
    preview: true,
    documentationURL: "https://github.com/alejandrojara/ha-titsa-card",
  });
}

console.info(
  `%c HA-TITSA-CARD %c v${CARD_VERSION} `,
  "color: #ffffff; background: #75ad1c; font-weight: 700; padding: 2px 6px; border-radius: 4px 0 0 4px;",
  "color: #1f2933; background: #e8f5d6; font-weight: 600; padding: 2px 6px; border-radius: 0 4px 4px 0;",
);
