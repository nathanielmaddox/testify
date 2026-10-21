'use client'

/**
 * Action controls for the get-started flow: the Back button used on steps 2 to 4.
 * Built from the DS Button; the primary action is a style-guide SubmitButton.
 *
 * Style-guide gap (for the style-guide owner): an outline pill action, ink
 * border on a transparent fill. ActionButton has only the filled tones, so the
 * look stays as classes on the DS Button until a composition exists.
 */

import { Button } from '@otesse/design-system'

/**
 * The Back action of a flow step: an outline pill (Paper "Back"), on the left
 * of the primary action. The primary action itself is a style-guide SubmitButton.
 */
export function FlowBackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="xl"
      radius="full"
      motion="none"
      onClick={onClick}
      className="h-12 border-[1.5px] border-brand-ink bg-transparent px-6 text-base font-semibold text-brand-ink hover:bg-brand-surface"
      styleOverrides={{ focusRingWidth: '2px', focusRingOffset: '3px' }}
    >
      Back
    </Button>
  )
}
