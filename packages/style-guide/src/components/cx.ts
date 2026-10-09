/** Joins truthy class names. Local so the brand layer needs no class utility dependency. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}
