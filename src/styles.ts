import { css } from 'lit';

// All card styles in one place. The class names mirror the structure of
// the Lit template in air-quality-card.ts.
export const cardStyles = css`
  :host {
    display: block;
  }

  ha-card {
    padding: 20px;
    color: var(--primary-text-color);
    font-family: var(--paper-font-body1_-_font-family, Roboto, sans-serif);
  }

  .top {
    cursor: pointer;
  }

  .top:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .secondary { color: var(--secondary-text-color); }

  .header {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .title {
    font-size: 15px;
    font-weight: 500;
  }

  .subtitle {
    font-size: 11px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Collapsed view */
  .collapsed-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .collapsed-meta {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .collapsed-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .collapsed-value .num {
    font-size: 18px;
    font-weight: 400;
  }

  .collapsed-value .unit {
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .chip {
    background: var(--chip-bg, transparent);
    border: 1px solid var(--chip-border, transparent);
    border-radius: 999px;
    padding: 5px 12px;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .chip .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  /* Expanded view */
  .expanded-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
  }

  .expanded-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }

  .expanded-text {
    flex-grow: 1;
    overflow: hidden;
    padding-right: 14px;
  }

  .top-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-bottom: 4px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .headline {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .headline .num {
    font-size: clamp(36px, 8vw, 54px);
    font-weight: 400;
    line-height: 1;
  }

  .headline .unit {
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .advice {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .stats {
    display: flex;
    gap: 14px;
    margin-top: 14px;
  }

  .stats > .stat {
    display: flex;
    flex-direction: column;
  }

  .stats > .stat.empty {
    opacity: 0.5;
  }

  .stat-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .stat-value .num {
    font-size: 24px;
    font-weight: 400;
  }

  .stat-value .unit {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .stat-label {
    font-size: 10px;
    color: var(--secondary-text-color);
    margin-top: 2px;
  }

  .divider {
    width: 1px;
    background: var(--divider-color, #444);
  }

  /* Ring */
  .ring-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
    flex-shrink: 0;
  }

  .ring-wrapper svg {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }

  .ring-bg {
    fill: none;
    stroke: var(--divider-color, #444);
    stroke-width: 8;
  }

  .ring-fg {
    fill: none;
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s ease-out;
  }

  .ring-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .ring-top-text {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .ring-bottom-text {
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    line-height: 1.1;
    margin-top: 2px;
    max-width: 80px;
  }

  /* Graph slot */
  .graph {
    display: block;
    width: 100%;
    --ha-card-background: transparent;
    --ha-card-border-width: 0;
    --ha-card-box-shadow: none;
    margin: 0 -6px 14px -6px;
  }

  /* Bottom pollutant tile grid */
  .bottom {
    padding-top: 14px;
    border-top: 1px solid var(--divider-color, #444);
  }

  .tile-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tile-grid + .tile-grid {
    margin-top: 0;
  }

  .pm-grid {
    margin-bottom: 14px;
  }

  .tile {
    padding: 0 6px;
    min-width: 0;
    overflow: hidden;
  }

  .tile.empty {
    opacity: 0.5;
  }

  .tile-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
    gap: 4px;
  }

  .tile-name {
    font-size: 11px;
    color: var(--secondary-text-color);
    font-weight: 500;
  }

  .tile-status {
    font-size: 9px;
  }

  .tile-value {
    display: flex;
    align-items: baseline;
    gap: 4px;
  }

  .tile-value .num {
    font-size: 22px;
    font-weight: 400;
    line-height: 1;
  }

  .tile-value .unit {
    font-size: 10px;
    color: var(--secondary-text-color);
  }

  .tile-bar {
    height: 3px;
    background: var(--divider-color, #444);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
  }

  .tile-bar > .fill {
    height: 100%;
  }

  /* Mobile fallback */
  @media (max-width: 380px) {
    ha-card { padding: 14px; }
    .ring-wrapper { width: 72px; height: 72px; }
    .ring-top-text { font-size: 10px; }
    .headline .num { font-size: clamp(28px, 12vw, 44px); }
    .expanded-text { padding-right: 8px; }
    .stats { gap: 10px; }
    .stat-value .num { font-size: 20px; }
  }

  @media (max-width: 300px) {
    .tile-grid { grid-template-columns: 1fr; }
  }
`;
