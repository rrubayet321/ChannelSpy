/**
 * Input validation helpers for the YouTube API proxy route.
 * Kept as pure functions in a separate module so they can be unit-tested
 * without importing Next.js server-only packages.
 */

/** YouTube @handles and legacy usernames: 2–100 URL-safe characters. */
export function isValidHandle(value: string): boolean {
  return value.length >= 2 && value.length <= 100 && /^[@]?[\w.\-]+$/.test(value)
}

/** YouTube channel IDs start with UC and are 24 characters total. */
export function isValidChannelId(value: string): boolean {
  return /^UC[\w\-]{20,22}$/.test(value)
}

/** Playlist IDs (uploads = UU…, public = PL…): 10–50 URL-safe characters. */
export function isValidPlaylistId(value: string): boolean {
  return /^[A-Za-z0-9_\-]{10,50}$/.test(value)
}

/** Standard YouTube video IDs are exactly 11 URL-safe characters. */
export function isValidVideoId(value: string): boolean {
  return /^[A-Za-z0-9_\-]{11}$/.test(value)
}

/** Page tokens from YouTube: base64url-ish strings, capped at 500 chars. */
export function isValidPageToken(value: string): boolean {
  return value.length <= 500 && /^[A-Za-z0-9_=\-+/]+$/.test(value)
}
