import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { localize, syncCustomCardMetadata } from "./localize";
import type { HomeAssistant, TitsaCardConfig } from "./types";
import { getAvailableLinesForEntity, normalizeLineCode } from "./utils";

interface HaFormSchemaItem {
  name: string;
  required?: boolean;
  selector: Record<string, unknown>;
}

@customElement("ha-titsa-card-editor")
export class HaTitsaCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: TitsaCardConfig;

  public setConfig(config: TitsaCardConfig): void {
    this._config = {
      style: "marquesina",
      max_arrivals: 5,
      compact: false,
      show_arrival_time: false,
      show_route_name: false,
      show_footer: true,
      tap_to_refresh: true,
      ...config,
      open_line_url: config.open_line_url !== false,
    };
  }

  private _buildSchema(): HaFormSchemaItem[] {
    const knownLines = new Set<string>(
      getAvailableLinesForEntity(this.hass, this._config?.entity),
    );
    for (const line of this._config?.lines ?? []) {
      const norm = normalizeLineCode(String(line));
      if (norm) knownLines.add(norm);
    }
    const lineOptions = [...knownLines]
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((line) => ({ value: line, label: line }));

    return [
      {
        name: "entity",
        required: true,
        selector: {
          entity: {
            filter: { domain: "sensor", integration: "titsa" },
          },
        },
      },
      {
        name: "style",
        selector: {
          select: {
            mode: "dropdown",
            options: [
              {
                value: "marquesina",
                label: localize(this.hass, "editor_style_marquesina"),
              },
              {
                value: "minimal",
                label: localize(this.hass, "editor_style_minimal"),
              },
            ],
          },
        },
      },
      {
        name: "title",
        selector: { text: {} },
      },
      {
        name: "max_arrivals",
        selector: {
          number: { min: 1, max: 12, step: 1, mode: "slider" },
        },
      },
      {
        name: "lines",
        selector: {
          select: {
            multiple: true,
            custom_value: true,
            mode: "dropdown",
            options: lineOptions,
          },
        },
      },
      {
        name: "compact",
        selector: { boolean: {} },
      },
      {
        name: "show_arrival_time",
        selector: { boolean: {} },
      },
      {
        name: "show_route_name",
        selector: { boolean: {} },
      },
      {
        name: "show_footer",
        selector: { boolean: {} },
      },
      {
        name: "tap_to_refresh",
        selector: { boolean: {} },
      },
      {
        name: "open_line_url",
        selector: { boolean: {} },
      },
      {
        name: "refresh_entity",
        selector: {
          entity: {
            filter: { domain: "button", integration: "titsa" },
          },
        },
      },
    ];
  }

  private _computeLabel = (schema: HaFormSchemaItem): string =>
    localize(this.hass, `editor_${schema.name}`);

  private _valueChanged(ev: CustomEvent<{ value: Record<string, unknown> }>): void {
    if (!this._config) return;
    const raw = ev.detail.value ?? {};
    const next: TitsaCardConfig = {
      ...this._config,
      ...raw,
      type: this._config.type || "custom:ha-titsa-card",
      entity: typeof raw.entity === "string" ? raw.entity : this._config.entity || "",
    };

    if (!next.title || !next.title.trim()) {
      delete next.title;
    }
    if (!next.refresh_entity) {
      delete next.refresh_entity;
    }
    if (Array.isArray(next.lines)) {
      const cleaned = [
        ...new Set(next.lines.map((item) => normalizeLineCode(String(item))).filter(Boolean)),
      ];
      if (cleaned.length > 0) {
        next.lines = cleaned;
      } else {
        delete next.lines;
      }
    } else {
      delete next.lines;
    }

    this._config = next;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    syncCustomCardMetadata(this.hass);

    return html`
      <div class="editor">
        <ha-form
          .hass=${this.hass}
          .data=${this._config}
          .schema=${this._buildSchema()}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    `;
  }

  static styles = css`
    .editor {
      padding: 4px 0;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-titsa-card-editor": HaTitsaCardEditor;
  }
}
