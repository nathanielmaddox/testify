// Reason shown on a disabled submit while the form is not connected. Development shows the exact
// reason. Production shows a neutral line, so no internal status reaches visitors.

export function pendingReason(developmentReason: string): string {
  return process.env.NODE_ENV === 'production' ? 'Coming soon.' : developmentReason
}
