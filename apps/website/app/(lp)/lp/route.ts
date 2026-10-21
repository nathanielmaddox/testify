import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LP_SLUG, lpPath } from '@/lib/landing_pages'

/**
 * Bare `/lp` (old links, the pre-registry URL): 307 to the default LP from
 * lib/landing_pages.ts, keeping the query string so UTM and click ids on old
 * ad links still reach the page. Temporary on purpose: the default can change.
 */
export const dynamic = 'force-dynamic'

export function GET(request: NextRequest) {
  const target = new URL(`${lpPath(DEFAULT_LP_SLUG)}${request.nextUrl.search}`, request.nextUrl)
  return NextResponse.redirect(target, 307)
}
