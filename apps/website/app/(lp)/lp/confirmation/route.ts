import { NextResponse, type NextRequest } from 'next/server'
import { DEFAULT_LP_SLUG, lpConfirmationPath } from '@/lib/landing_pages'

/**
 * Old `/lp/confirmation` (Stripe success URLs or lead links issued before
 * per-LP confirmation pages): 307 to the default LP's confirmation page,
 * keeping the query (`session_id` / `lead`), which then verifies as usual.
 * `confirmation` is a reserved slug in the registry, so this never shadows an LP.
 */
export const dynamic = 'force-dynamic'

export function GET(request: NextRequest) {
  const target = new URL(
    `${lpConfirmationPath(DEFAULT_LP_SLUG)}${request.nextUrl.search}`,
    request.nextUrl
  )
  return NextResponse.redirect(target, 307)
}
