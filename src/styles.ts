import { css } from "lit";

export const cardStyles = css`
  :host {
    display: block;
    --titsa-green: #75ad1c;
    --titsa-green-dark: #578611;
    --titsa-green-tint: rgba(117, 173, 28, 0.14);
    --titsa-night: #2c4c7e;
    --titsa-urgent-bg: rgba(117, 173, 28, 0.18);
    --titsa-urgent-fg: #4b7809;
    --titsa-radius: var(--ha-card-border-radius, 12px);
  }

  ha-card.dark {
    --titsa-urgent-fg: #9bd63c;
    --titsa-urgent-bg: rgba(140, 198, 63, 0.22);
  }

  @media (prefers-color-scheme: dark) {
    ha-card:not(.light) {
      --titsa-urgent-fg: #9bd63c;
      --titsa-urgent-bg: rgba(140, 198, 63, 0.22);
    }
  }

  ha-card {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: box-shadow 180ms ease;
  }

  ha-card.card-interactive {
    cursor: pointer;
  }

  /* ── Header: Marquesina (TITSA shelter green banner) ── */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 13px 16px;
    transition:
      filter 140ms ease,
      background-color 140ms ease;
  }

  .header.refresh-zone {
    cursor: pointer;
  }

  .header.marquesina {
    background: linear-gradient(135deg, #7cb421 0%, var(--titsa-green-dark) 100%);
    color: #ffffff;
  }

  .header.marquesina.refresh-zone:hover {
    filter: brightness(1.03);
  }

  .header.minimal {
    background: transparent;
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.18));
    padding: 12px 16px 10px;
  }

  .header.minimal.refresh-zone:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .bus-emblem {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .header.marquesina .bus-emblem {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  .header.minimal .bus-emblem {
    background: var(--titsa-green-tint);
    color: var(--titsa-green);
  }

  .bus-emblem ha-icon {
    --mdc-icon-size: 20px;
  }

  .title-group {
    min-width: 0;
    flex: 1;
  }

  .stop-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.25;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stop-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    font-size: 0.76rem;
    opacity: 0.88;
  }

  .header.minimal .stop-meta {
    color: var(--secondary-text-color);
    opacity: 1;
  }

  .stop-code-chip {
    display: inline-flex;
    align-items: center;
    padding: 1px 6px;
    border-radius: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.02em;
  }

  .header.marquesina .stop-code-chip {
    background: rgba(0, 0, 0, 0.2);
    color: #ffffff;
  }

  .header.minimal .stop-code-chip {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
    color: var(--primary-text-color);
  }

  .refresh-btn {
    appearance: none;
    border: none;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    transition:
      background-color 150ms ease,
      transform 150ms ease;
    padding: 0;
  }

  .header.marquesina .refresh-btn {
    background: rgba(255, 255, 255, 0.18);
    color: #ffffff;
  }

  .header.marquesina .refresh-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .header.minimal .refresh-btn {
    background: transparent;
    color: var(--secondary-text-color);
  }

  .header.minimal .refresh-btn:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
    color: var(--primary-text-color);
  }

  .refresh-btn:active {
    transform: scale(0.94);
  }

  .refresh-btn:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: 2px;
  }

  .header.marquesina .refresh-btn:focus-visible {
    outline-color: #ffffff;
  }

  .refresh-btn:disabled {
    opacity: 0.55;
    cursor: default;
  }

  .refresh-btn ha-icon {
    --mdc-icon-size: 20px;
  }

  .refresh-btn.spinning ha-icon {
    animation: titsa-spin 0.8s linear infinite;
  }

  @keyframes titsa-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  /* ── Feedback banner (cooldown / error toast) ── */
  .notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    font-size: 0.8rem;
    background: rgba(245, 158, 11, 0.14);
    color: var(--primary-text-color);
    border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.15));
  }

  .notice ha-icon {
    --mdc-icon-size: 16px;
    color: #d97706;
    flex-shrink: 0;
  }

  /* ── Arrivals list ── */
  .arrivals {
    list-style: none;
    margin: 0;
    padding: 6px 0;
  }

  .arrivals.compact {
    padding: 2px 0;
  }

  .arrival-row {
    display: block;
  }

  .arrival-row + .arrival-row {
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
  }

  .arrival-link,
  .arrival-row.static {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 9px 16px;
    transition: background-color 120ms ease;
  }

  .arrival-link,
  .arrival-link:visited {
    width: 100%;
    box-sizing: border-box;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    padding-right: 10px;
  }

  .arrivals.compact .arrival-link,
  .arrivals.compact .arrival-row.static {
    padding: 6px 14px;
    gap: 10px;
  }

  .arrivals.compact .arrival-link {
    padding-right: 8px;
  }

  .arrival-link:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
  }

  .arrival-link:active {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.14));
  }

  .arrival-link:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: -2px;
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.08));
  }

  .row-chevron {
    --mdc-icon-size: 18px;
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    opacity: 0.45;
    flex-shrink: 0;
    margin-left: -4px;
    transition:
      opacity 120ms ease,
      transform 120ms ease,
      color 120ms ease;
  }

  .arrivals.compact .row-chevron {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
  }

  .arrival-link:hover .row-chevron,
  .arrival-link:focus-visible .row-chevron {
    opacity: 0.9;
    color: var(--titsa-urgent-fg);
    transform: translateX(2px);
  }

  .line-pill {
    min-width: 44px;
    height: 28px;
    padding: 0 8px;
    border-radius: 7px;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
  }

  .arrivals.compact .line-pill {
    min-width: 40px;
    height: 24px;
    font-size: 0.8rem;
  }

  .line-pill.night {
    background: var(--titsa-night);
  }

  .dest-col {
    min-width: 0;
    flex: 1;
  }

  .destination {
    font-size: 0.92rem;
    font-weight: 500;
    color: var(--primary-text-color);
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .arrivals.compact .destination {
    font-size: 0.86rem;
  }

  .route-sub {
    font-size: 0.74rem;
    color: var(--secondary-text-color);
    line-height: 1.25;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .eta-col {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
    text-align: right;
  }

  .eta-badge {
    font-size: 0.94rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--primary-text-color);
    line-height: 1.2;
  }

  .eta-badge.now {
    padding: 3px 9px;
    border-radius: 999px;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.8rem;
    letter-spacing: 0.01em;
  }

  .eta-badge.imminent {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--titsa-urgent-bg);
    color: var(--titsa-urgent-fg);
    font-size: 0.86rem;
  }

  .eta-clock {
    font-size: 0.72rem;
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  /* ── Empty / Paused / Unavailable state ── */
  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 22px 18px;
    gap: 6px;
  }

  .state-box[role="button"]:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: -2px;
  }

  .state-box > ha-icon {
    --mdc-icon-size: 28px;
    color: var(--secondary-text-color);
    opacity: 0.75;
    margin-bottom: 2px;
  }

  .state-box.paused > ha-icon {
    color: var(--titsa-green);
    opacity: 0.9;
  }

  .state-title {
    font-size: 0.94rem;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .state-subtitle {
    font-size: 0.8rem;
    color: var(--secondary-text-color);
    max-width: 300px;
    line-height: 1.35;
  }

  .cta-btn {
    margin-top: 8px;
    appearance: none;
    border: none;
    background: var(--titsa-green);
    color: #ffffff;
    font-size: 0.82rem;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 999px;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition:
      background-color 150ms ease,
      transform 120ms ease;
  }

  .cta-btn:hover {
    background: var(--titsa-green-dark);
  }

  .cta-btn:active {
    transform: scale(0.97);
  }

  .cta-btn:focus-visible {
    outline: 2px solid var(--titsa-green-dark);
    outline-offset: 2px;
  }

  .cta-btn ha-icon {
    --mdc-icon-size: 16px;
    color: #ffffff;
    margin: 0;
    opacity: 1;
  }

  /* ── Footer ── */
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 7px 16px 9px;
    border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.14));
    font-size: 0.75rem;
    color: var(--secondary-text-color);
    transition: background-color 120ms ease;
  }

  .footer.refresh-zone {
    cursor: pointer;
  }

  .footer.refresh-zone:hover {
    background: var(--secondary-background-color, rgba(127, 127, 127, 0.06));
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .manual-tag {
    padding: 1px 6px;
    border-radius: 5px;
    background: var(--titsa-green-tint);
    color: var(--titsa-urgent-fg);
    font-weight: 600;
    font-size: 0.69rem;
  }

  .expand-btn {
    appearance: none;
    border: none;
    background: transparent;
    color: var(--titsa-urgent-fg);
    font-size: 0.76rem;
    font-weight: 600;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 6px;
  }

  .expand-btn:hover {
    background: var(--titsa-green-tint);
  }

  .expand-btn:focus-visible {
    outline: 2px solid var(--titsa-green);
    outline-offset: 2px;
  }
`;
