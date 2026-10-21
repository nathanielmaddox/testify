'use client'

// "What almost stopped you" question at the bottom of the purchase confirmation (Paper "Quiet
// extras"). Posts to /api/feedback. When the feedback store is not connected, Send stays disabled
// with the pending reason and no success is shown. Only an adapter `ok` shows the thanks line.
import { ActionButton } from '@testify/style-guide/components/ActionButton'
import { TextAreaField } from '@testify/style-guide/components/TextAreaField'
import { useState, type FormEvent } from 'react'
import { PENDING_REASONS, postJson } from './post_json'
import { pendingReason } from './pending_reason'

type Status = 'idle' | 'sending' | 'sent' | 'pending' | 'error'

export function QuietExtrasForm({
  idPrefix,
  referenceId,
}: {
  idPrefix: string
  /** The verified Stripe session id from the confirmation page. */
  referenceId: string
}) {
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState<string | null>(null)
  const locked = status === 'sending' || status === 'sent' || status === 'pending'

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (locked) return
    const text = message.trim()
    if (!text) {
      setStatus('error')
      setNotice('Write a short answer first.')
      return
    }
    setStatus('sending')
    setNotice(null)
    const result = await postJson('/api/feedback', {
      referenceId,
      page: window.location.pathname,
      message: text,
    })
    if (result.ok) {
      setStatus('sent')
      setNotice('Thanks. We got your answer.')
      return
    }
    if (PENDING_REASONS.includes(result.reason)) {
      setStatus('pending')
      return
    }
    setStatus('error')
    setNotice(result.message)
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col items-start gap-4 md:flex-row md:items-end"
    >
      <div className="w-full max-w-measure">
        <TextAreaField
          id={`${idPrefix}-stopped`}
          label="What almost stopped you from signing up?"
          rows={2}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          disabled={locked}
        />
      </div>
      <ActionButton
        type="submit"
        tone="quiet"
        loading={status === 'sending'}
        disabled={locked}
        {...(status === 'pending' ? { disabledReason: pendingReason('Not connected yet.') } : {})}
      >
        Send
      </ActionButton>
      <p role="status" className="font-text text-brand-small text-brand-ink-muted">
        {notice ?? ''}
      </p>
    </form>
  )
}
