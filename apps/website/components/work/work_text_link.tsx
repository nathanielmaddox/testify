'use client'

// Inline text link for the work pages. A client wrapper so the server section components can link without importing the DS-backed TextLink themselves (DS imports stay in client modules).
import { TextLink, type TextLinkProps } from '@testify/style-guide/components/TextLink'

/** Inline text link in running copy on a work page. Props pass straight through to TextLink. */
export function WorkTextLink(props: TextLinkProps) {
  return <TextLink {...props} />
}
