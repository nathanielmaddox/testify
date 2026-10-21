/**
 * SERVER ONLY: the source-of-truth check for a conversion request. A `purchase` is verified only when
 * the payments adapter reports the Checkout Session as paid. With no payments provider connected the
 * answer is not paid, so the purchase stays unverified. A `lead` stays shape-only (`verified: false`)
 * until the lead store exists. Import from server components and route handlers only.
 */
import { getIntegrations } from './integrations'
import { checkConversionShape, type ConversionResult } from './conversion'

type ParamsLike = Record<string, string | string[] | undefined>

export async function verifyConversion(params: ParamsLike): Promise<ConversionResult> {
  const shape = checkConversionShape(params)
  if (!shape.ok || shape.kind !== 'purchase') return shape
  const paid = await getIntegrations().payments.verifyPaidSession(shape.id)
  return { ...shape, verified: paid }
}
