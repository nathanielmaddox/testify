/**
 * Typed public env vars. Declared here so code can use DOT access
 * (`process.env.NEXT_PUBLIC_X`), which is the form Next inlines into client
 * bundles. Every name here is documented in `.env.example`.
 */
declare namespace NodeJS {
  interface ProcessEnv {
    /** Admin origin (this app's own URL), no trailing slash. */
    readonly NEXT_PUBLIC_SITE_URL?: string
  }
}
