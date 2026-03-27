/**
 * Recharts draws a default Tooltip "cursor" (often a large light rectangle).
 * We disable it and use each Bar's `activeBar` instead so only the bar highlights.
 */
export const tooltipHideCursor = { cursor: false as const }
