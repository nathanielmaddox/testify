/**
 * Open Sign buy copy for the cold $99 LP (`done-for-you-99`): the one button
 * label and the one caption under it. The hero, offer stack, closing CTA and
 * the sticky buy bar all read these, so the wording changes in one place.
 * Plain strings, no DS, safe in server and client modules.
 */

/*
 * UNCONFIRMED TERMS: guarantee P4 ("No contract", "Cancel in 2 clicks") is not
 * confirmed by the owner (`[CONFIRM P4]`, `docs/lp-99-conversion-page.md` section 4.5 and
 * 4.8). It gates the wording below and the lines that repeat it: the offer-stack
 * price line, the P.S. and the FAQ answer. The caption, the offer-stack price line and the P.S. carry
 * [CONFIRM P4] too: strip those markers together when P4 is confirmed.
 */

/** The buy button label (violet on the hero and closing CTA, ink elsewhere). */
export const OPEN_SIGN_BUY_LABEL = 'Yes! Turn On My Open Sign: $99/Month'

/** The sticky buy bar's button label (shorter, ink tone). */
export const OPEN_SIGN_STICKY_LABEL = 'Yes! Turn It On for $99/Month'

/** The price, terms and risk line under every buy button. */
export const OPEN_SIGN_BUY_CAPTION =
  "$99/month. No contract. Cancel in 2 clicks. First month: love it or it's free. [CONFIRM P4]"
