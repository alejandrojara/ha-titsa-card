import { LitElement, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import {
  formatServiceError,
  localize,
  resolveLocale,
  syncCustomCardMetadata,
} from "./localize";
import { cardStyles } from "./styles";
import type {
  HomeAssistant,
  LovelaceGridOptions,
  TitsaArrival,
  TitsaCardConfig,
  TitsaSensorAttributes,
} from "./types";
import {
  buildTitsaLineUrl,
  computeLiveMinutes,
  extractArrivalsFromEntity,
  findDefaultTitsaSensor,
  findRefreshButtonEntity,
  formatClockTime,
  formatDestination,
  isArrivalExpired,
  isNightLine,
  isPausedSnapshotStale,
  normalizeLineCode,
} from "./utils";

const DEFAULT_CONFIG: Omit<TitsaCardConfig, "type" | "entity"> = {
  style: "marquesina",
  max_arrivals: 5,
  compact: false,
  show_arrival_time: false,
  show_route_name: false,
  show_footer: true,
  tap_to_refresh: true,
  open_line_url: true,
};

@customElement("ha-titsa-card")
export class HaTitsaCard extends LitElement {
  static styles = cardStyles;

  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: TitsaCardConfig;
  @state() private _nowMs = Date.now();
  @state() private _refreshing = false;
  @state() private _expanded = false;
  @state() private _notice: string | null = null;

  private _tickTimer?: number;
  private _noticeTimer?: number;
  private _refreshTimer?: number;

  private _handleVisibilityChange = (): void => {
    if (typeof document !== "undefined" && !document.hidden) {
      this._nowMs = Date.now();
    }
  };

  public static getConfigElement(): HTMLElement {
    return document.createElement("ha-titsa-card-editor");
  }

  public static getStubConfig(hass?: HomeAssistant): TitsaCardConfig {
    return {
      type: "custom:ha-titsa-card",
      entity: findDefaultTitsaSensor(hass),
      style: "marquesina",
      max_arrivals: 5,
      show_footer: true,
      tap_to_refresh: true,
      open_line_url: true,
    };
  }

  public setConfig(config: TitsaCardConfig): void {
    if (!config) {
      throw new Error("Invalid configuration for ha-titsa-card");
    }
    const maxArrivals =
      typeof config.max_arrivals === "number" && config.max_arrivals >= 1
        ? Math.min(12, Math.floor(config.max_arrivals))
        : DEFAULT_CONFIG.max_arrivals;

    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      max_arrivals: maxArrivals,
      style: config.style === "minimal" ? "minimal" : "marquesina",
      open_line_url: config.open_line_url !== false,
    };
  }

  public connectedCallback(): void {
    super.connectedCallback();
    this._nowMs = Date.now();
    this._tickTimer = window.setInterval(() => {
      this._nowMs = Date.now();
    }, 15_000);
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", this._handleVisibilityChange);
    }
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tickTimer !== undefined) {
      window.clearInterval(this._tickTimer);
      this._tickTimer = undefined;
    }
    if (this._noticeTimer !== undefined) {
      window.clearTimeout(this._noticeTimer);
      this._noticeTimer = undefined;
    }
    if (this._refreshTimer !== undefined) {
      window.clearTimeout(this._refreshTimer);
      this._refreshTimer = undefined;
    }
    if (typeof document !== "undefined") {
      document.removeEventListener("visibilitychange", this._handleVisibilityChange);
    }
  }

  public getCardSize(): number {
    const arrivals = this._getFilteredArrivals();
    const visible = this._expanded
      ? arrivals.length
      : Math.min(arrivals.length, this._config?.max_arrivals ?? 5);
    const base = this._config?.compact ? 2 : 3;
    return Math.max(base, Math.min(8, Math.ceil(1.6 + visible * 0.7)));
  }

  public getGridOptions(): LovelaceGridOptions {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: 2,
    };
  }

  private _showNotice(message: string): void {
    this._notice = message;
    if (this._noticeTimer !== undefined) {
      window.clearTimeout(this._noticeTimer);
    }
    this._noticeTimer = window.setTimeout(() => {
      this._notice = null;
      this._noticeTimer = undefined;
    }, 4000);
  }

  private _getAttributes(): TitsaSensorAttributes {
    if (!this.hass || !this._config?.entity) return {};
    const entity = this.hass.states[this._config.entity];
    if (!entity) return {};
    return entity.attributes as TitsaSensorAttributes;
  }

  private _getFilteredArrivals(): TitsaArrival[] {
    const entityObj =
      this.hass && this._config?.entity ? this.hass.states[this._config.entity] : undefined;
    const rawArrivals = extractArrivalsFromEntity(entityObj).filter(
      (a) => !isArrivalExpired(a, this._nowMs),
    );
    const cardLines = this._config?.lines;
    if (!cardLines || cardLines.length === 0) {
      return rawArrivals;
    }
    const allowed = new Set(cardLines.map((l) => normalizeLineCode(String(l))).filter(Boolean));
    if (allowed.size === 0) return rawArrivals;
    return rawArrivals.filter((a) => allowed.has(normalizeLineCode(String(a.line))));
  }

  private async _triggerRefresh(ev?: Event): Promise<void> {
    ev?.stopPropagation();
    if (!this.hass || !this._config || this._refreshing) return;

    const buttonEntity = findRefreshButtonEntity(this.hass, this._config);
    if (!buttonEntity) {
      this._showNotice(localize(this.hass, "no_refresh_button"));
      return;
    }

    this._refreshing = true;
    this._notice = null;
    try {
      await this.hass.callService("button", "press", undefined, {
        entity_id: buttonEntity,
      });
      this._nowMs = Date.now();
    } catch (err: unknown) {
      this._showNotice(formatServiceError(this.hass, err));
    } finally {
      if (this._refreshTimer !== undefined) {
        window.clearTimeout(this._refreshTimer);
      }
      this._refreshTimer = window.setTimeout(() => {
        this._refreshing = false;
        this._refreshTimer = undefined;
      }, 450);
    }
  }

  private _isInteractiveChildTarget(ev: Event): boolean {
    const current = ev.currentTarget;
    const selector = 'a, button, input, select, textarea, [role="button"]';
    const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
    if (path.length > 0) {
      for (const node of path) {
        if (node === current) return false;
        if (node instanceof Element && node.matches(selector)) {
          return true;
        }
      }
      return false;
    }
    const target = ev.target;
    if (!(target instanceof Element) || target === current) return false;
    const interactive = target.closest(selector);
    return Boolean(interactive && interactive !== current);
  }

  private _handleRefreshZoneClick(ev: Event): void {
    if (!this._config?.tap_to_refresh) return;
    if (this._isInteractiveChildTarget(ev)) return;
    ev.stopPropagation();
    const buttonEntity = findRefreshButtonEntity(this.hass, this._config);
    if (buttonEntity) {
      void this._triggerRefresh(ev);
    }
  }

  private _handleRefreshZoneKeyDown(ev: KeyboardEvent): void {
    if (!this._config?.tap_to_refresh) return;
    if (this._isInteractiveChildTarget(ev)) return;
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      ev.stopPropagation();
      const buttonEntity = findRefreshButtonEntity(this.hass, this._config);
      if (buttonEntity) {
        void this._triggerRefresh();
      }
    }
  }

  private _toggleExpanded(ev: Event): void {
    ev.stopPropagation();
    this._expanded = !this._expanded;
  }

  private _renderArrivalRow(arrival: TitsaArrival, locale: string, openLineUrl: boolean) {
    const minutes = computeLiveMinutes(arrival, this._nowMs);
    const lineCode = normalizeLineCode(String(arrival.line));
    const isNight = isNightLine(lineCode);
    const dest = formatDestination(arrival.destination || "");
    const routeName =
      this._config?.show_route_name && arrival.line_name
        ? formatDestination(arrival.line_name)
        : "";
    const clock = this._config?.show_arrival_time
      ? formatClockTime(arrival.estimated_arrival, locale)
      : "";

    let etaClass = "eta-badge";
    let etaText = `${arrival.is_approximate ? ">" : ""}${minutes} ${localize(this.hass, "min_short")}`;
    if (minutes <= 0) {
      etaClass = "eta-badge now";
      etaText = localize(this.hass, "now");
    } else if (minutes <= 5) {
      etaClass = "eta-badge imminent";
    }

    const rowContent = html`
      <span class="line-pill ${isNight ? "night" : ""}">${lineCode}</span>
      <div class="dest-col">
        <div class="destination" title=${dest || nothing}>${dest}</div>
        ${routeName
          ? html`<div class="route-sub" title=${routeName || nothing}>${routeName}</div>`
          : nothing}
      </div>
      <div class="eta-col">
        <span class=${etaClass}>${etaText}</span>
        ${clock ? html`<span class="eta-clock">${clock}</span>` : nothing}
      </div>
    `;

    if (!openLineUrl) {
      return html`<li class="arrival-row static">${rowContent}</li>`;
    }

    const lineUrl = buildTitsaLineUrl(arrival.line);
    const ariaLabel = dest
      ? localize(this.hass, "open_line_aria", {
          line: lineCode,
          destination: dest,
          eta: etaText,
        })
      : localize(this.hass, "open_line_aria_no_dest", {
          line: lineCode,
          eta: etaText,
        });
    const tooltip = localize(this.hass, "open_line_tooltip", { line: lineCode });

    return html`
      <li class="arrival-row">
        <a
          class="arrival-link"
          href=${lineUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label=${ariaLabel}
          title=${tooltip}
        >
          ${rowContent}
          <ha-icon class="row-chevron" icon="mdi:chevron-right" aria-hidden="true"></ha-icon>
        </a>
      </li>
    `;
  }

  protected render() {
    if (!this._config) return nothing;

    syncCustomCardMetadata(this.hass);
    const locale = resolveLocale(this.hass);
    const entityObj =
      this.hass && this._config.entity ? this.hass.states[this._config.entity] : undefined;
    const attrs = this._getAttributes();
    const style = this._config.style ?? "marquesina";
    const stopId = attrs.stop_id ? String(attrs.stop_id) : "";
    const title =
      this._config.title?.trim() ||
      attrs.stop_name ||
      attrs.friendly_name ||
      (stopId ? `${localize(this.hass, "stop_prefix")} ${stopId}` : "TITSA");
    const refreshButton = findRefreshButtonEntity(this.hass, this._config);
    const canTapRefresh = Boolean(this._config.tap_to_refresh && refreshButton);
    const openLineUrl = this._config.open_line_url !== false;

    const isUnavailable = entityObj?.state === "unavailable";
    const isPaused = Boolean(attrs.polling_paused);
    const isManualSnapshot = Boolean(attrs.manual_snapshot);
    const isStalePausedSnapshot =
      isPaused && isPausedSnapshotStale(attrs.last_estimation, this._nowMs);
    const effectiveManualSnapshot = isManualSnapshot && !isStalePausedSnapshot;
    const arrivals = this._getFilteredArrivals();
    const showPausedState =
      isPaused && (isStalePausedSnapshot || (!isManualSnapshot && arrivals.length === 0));
    const hasArrivals =
      Boolean(entityObj) && !isUnavailable && !showPausedState && arrivals.length > 0;
    const cardTapRefresh = canTapRefresh && !hasArrivals;
    const zoneTapRefresh = canTapRefresh && hasArrivals;
    const maxVisible = this._config.max_arrivals ?? 5;
    const visibleArrivals = this._expanded ? arrivals : arrivals.slice(0, maxVisible);
    const hiddenCount =
      !isUnavailable && !showPausedState ? Math.max(0, arrivals.length - maxVisible) : 0;

    const lastUpdateClock = formatClockTime(attrs.last_estimation, locale);

    let bodyContent;
    if (!entityObj) {
      bodyContent = html`
        <div
          class="state-box"
          role=${cardTapRefresh ? "button" : nothing}
          tabindex=${cardTapRefresh ? "0" : nothing}
          aria-label=${cardTapRefresh ? localize(this.hass, "refresh") : nothing}
          @click=${cardTapRefresh ? this._handleRefreshZoneClick : nothing}
          @keydown=${cardTapRefresh ? this._handleRefreshZoneKeyDown : nothing}
        >
          <ha-icon icon="mdi:bus-alert"></ha-icon>
          <div class="state-title">${localize(this.hass, "entity_missing_title")}</div>
          <div class="state-subtitle">${localize(this.hass, "entity_missing_subtitle")}</div>
        </div>
      `;
    } else if (isUnavailable) {
      bodyContent = html`
        <div class="state-box">
          <ha-icon icon="mdi:cloud-off-outline"></ha-icon>
          <div class="state-title">${localize(this.hass, "unavailable_title")}</div>
          <div class="state-subtitle">${localize(this.hass, "unavailable_subtitle")}</div>
          ${refreshButton
            ? html`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${localize(this.hass, "check_now")}</span>
                </button>
              `
            : nothing}
        </div>
      `;
    } else if (showPausedState) {
      bodyContent = html`
        <div class="state-box paused">
          <ha-icon icon="mdi:pause-circle-outline"></ha-icon>
          <div class="state-title">${localize(this.hass, "paused_title")}</div>
          <div class="state-subtitle">${localize(this.hass, "paused_subtitle")}</div>
          ${refreshButton
            ? html`
                <button
                  type="button"
                  class="cta-btn"
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                  <span>${localize(this.hass, "check_now")}</span>
                </button>
              `
            : nothing}
        </div>
      `;
    } else if (arrivals.length === 0) {
      bodyContent = html`
        <div
          class="state-box"
          role=${cardTapRefresh ? "button" : nothing}
          tabindex=${cardTapRefresh ? "0" : nothing}
          aria-label=${cardTapRefresh ? localize(this.hass, "refresh") : nothing}
          @click=${cardTapRefresh ? this._handleRefreshZoneClick : nothing}
          @keydown=${cardTapRefresh ? this._handleRefreshZoneKeyDown : nothing}
        >
          <ha-icon icon="mdi:bus-clock"></ha-icon>
          <div class="state-title">${localize(this.hass, "empty_title")}</div>
          <div class="state-subtitle">${localize(this.hass, "empty_subtitle")}</div>
        </div>
      `;
    } else {
      bodyContent = html`
        <ul class="arrivals ${this._config.compact ? "compact" : ""}">
          ${visibleArrivals.map((arrival) => this._renderArrivalRow(arrival, locale, openLineUrl))}
        </ul>
      `;
    }

    const showFooter =
      this._config.show_footer !== false &&
      Boolean(entityObj) &&
      !isUnavailable &&
      (Boolean(lastUpdateClock) || hiddenCount > 0 || effectiveManualSnapshot);

    const themeClass =
      this.hass?.themes?.darkMode === true
        ? "dark"
        : this.hass?.themes?.darkMode === false
          ? "light"
          : "";
    const cardClasses = [cardTapRefresh ? "card-interactive" : "", themeClass]
      .filter(Boolean)
      .join(" ");

    return html`
      <ha-card
        class=${cardClasses}
        @click=${cardTapRefresh ? this._handleRefreshZoneClick : nothing}
      >
        <div
          class="header ${style} ${canTapRefresh ? "refresh-zone" : ""}"
          @click=${zoneTapRefresh ? this._handleRefreshZoneClick : nothing}
        >
          <div class="header-left">
            <div class="bus-emblem">
              <ha-icon icon="mdi:bus"></ha-icon>
            </div>
            <div class="title-group">
              <h2 class="stop-title" title=${title}>${title}</h2>
              ${stopId
                ? html`
                    <div class="stop-meta">
                      <span class="stop-code-chip">#${stopId}</span>
                      <span>TITSA</span>
                    </div>
                  `
                : nothing}
            </div>
          </div>

          ${refreshButton
            ? html`
                <button
                  type="button"
                  class="refresh-btn ${this._refreshing ? "spinning" : ""}"
                  aria-label=${localize(this.hass, "refresh")}
                  title=${localize(this.hass, "refresh")}
                  ?disabled=${this._refreshing}
                  @click=${this._triggerRefresh}
                >
                  <ha-icon icon="mdi:refresh"></ha-icon>
                </button>
              `
            : nothing}
        </div>

        ${this._notice
          ? html`
              <div class="notice" role="status">
                <ha-icon icon="mdi:clock-alert-outline"></ha-icon>
                <span>${this._notice}</span>
              </div>
            `
          : nothing}

        ${bodyContent}

        ${showFooter
          ? html`
              <div
                class="footer ${canTapRefresh ? "refresh-zone" : ""}"
                @click=${zoneTapRefresh ? this._handleRefreshZoneClick : nothing}
              >
                <div class="footer-left">
                  ${lastUpdateClock
                    ? html`<span>${localize(this.hass, "updated_at")} ${lastUpdateClock}</span>`
                    : nothing}
                  ${effectiveManualSnapshot
                    ? html`<span class="manual-tag">${localize(this.hass, "manual_badge")}</span>`
                    : nothing}
                </div>
                ${hiddenCount > 0
                  ? html`
                      <button type="button" class="expand-btn" @click=${this._toggleExpanded}>
                        ${this._expanded
                          ? localize(this.hass, "show_less")
                          : localize(this.hass, "show_more", { count: hiddenCount })}
                      </button>
                    `
                  : nothing}
              </div>
            `
          : nothing}
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-titsa-card": HaTitsaCard;
  }
}
