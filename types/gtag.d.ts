/**
 * Minimal global declarations for Google Analytics gtag.js so TypeScript
 * understands `window.gtag` and `window.dataLayer`.
 */

export {}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var dataLayer: any[]
  // eslint-disable-next-line @typescript-eslint/ban-types
  function gtag(...args: unknown[]): void
}
