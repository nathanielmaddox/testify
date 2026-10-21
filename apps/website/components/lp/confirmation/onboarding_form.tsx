'use client'

// Onboarding ask on the purchase confirmation (Paper "Section - Onboarding ask"): trade, town,
// mobile, where they post. Posts to /api/onboarding with the verified session id as `referenceId`.
// When the data store is not connected, the submit stays disabled with the pending reason, and no
// success is shown. Photo upload (Paper's dashed drop zone) is shown disabled until the upload
// adapter is connected.
import { useState, type FormEvent } from 'react'
import { FileUploadDropZone } from '@otesse/design-system'
import { ActionButton } from '@testify/style-guide/components/ActionButton'
import { CheckboxField } from '@testify/style-guide/components/CheckboxField'
import { SelectField } from '@testify/style-guide/components/SelectField'
import { TextField } from '@testify/style-guide/components/TextField'
import { BUSINESS_TYPE_OPTIONS } from '@/lib/get_started'
import { PENDING_REASONS, postJson } from './post_json'
import { pendingReason } from './pending_reason'

// Photo upload is shown disabled until the upload adapter is connected (Paper "Got a few job photos?").
// The size limit is Paper's [N] MB placeholder, so no maxSizeBytes is set yet.
// Trade choices are the same business types the get-started flow offers (lib/get_started.ts).
const TRADE_OPTIONS = [{ value: '', label: 'Choose your trade' }, ...BUSINESS_TYPE_OPTIONS]

type Platform = 'facebook' | 'instagram'
type Status = 'idle' | 'sending' | 'sent' | 'pending' | 'error'

export function OnboardingForm({
  idPrefix,
  referenceId,
}: {
  idPrefix: string
  /** The verified Stripe session id from the confirmation page. */
  referenceId: string
}) {
  const [trade, setTrade] = useState('')
  const [town, setTown] = useState('')
  const [mobile, setMobile] = useState('')
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [notice, setNotice] = useState<string | null>(null)
  const locked = status === 'sending' || status === 'sent' || status === 'pending'

  function togglePlatform(platform: Platform, on: boolean) {
    setPlatforms((current) =>
      on
        ? [...current.filter((item) => item !== platform), platform]
        : current.filter((item) => item !== platform)
    )
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (locked) return
    setStatus('sending')
    setNotice(null)
    const result = await postJson('/api/onboarding', {
      referenceId,
      answers: { trade, town, mobile, platforms },
    })
    if (result.ok) {
      setStatus('sent')
      setNotice('Thanks. Your answers are in.')
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
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        <SelectField
          id={`${idPrefix}-trade`}
          label="What's your trade?"
          value={trade}
          onChange={(event) => setTrade(event.target.value)}
          disabled={locked}
          options={TRADE_OPTIONS}
        />
        <TextField
          id={`${idPrefix}-town`}
          label="Which town or area do you work in?"
          placeholder="Enter your town or area"
          helperText="e.g. Mesa, AZ. We use it in your posts."
          value={town}
          onChange={(event) => setTown(event.target.value)}
          disabled={locked}
        />
        <TextField
          id={`${idPrefix}-mobile`}
          label="Your mobile number"
          type="tel"
          autoComplete="tel"
          placeholder="+1 [PHONE]"
          helperText="We text your weekly questions here. Reply by text or voice."
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          disabled={locked}
        />
        <fieldset className="flex flex-col gap-3">
          <legend className="font-text text-brand-small font-medium text-brand-ink">
            Where do you post?
          </legend>
          <CheckboxField
            id={`${idPrefix}-facebook`}
            name="platform"
            value="facebook"
            label="Facebook"
            checked={platforms.includes('facebook')}
            onChange={(event) => togglePlatform('facebook', event.target.checked)}
            disabled={locked}
          />
          <CheckboxField
            id={`${idPrefix}-instagram`}
            name="platform"
            value="instagram"
            label="Instagram"
            checked={platforms.includes('instagram')}
            onChange={(event) => togglePlatform('instagram', event.target.checked)}
            disabled={locked}
          />
        </fieldset>
      </div>
      {/* TODO(uploads): wire onFilesAdded and onUpload to /api/onboarding photo targets, then enable. */}
      <FileUploadDropZone
        id={`${idPrefix}-photos`}
        label="Got a few job photos? Add them."
        accept={['image/jpeg', 'image/png', 'image/heic', '.heic']}
        labels={{ dropzoneIdleTitle: 'Drop photos here, or', buttonText: 'Choose photos' }}
        description="JPG, PNG or HEIC. Up to [N] MB each."
        helperText="Optional. Phone photos are perfect. No photos? We start with graphics."
        disabled
        disabledReason={pendingReason('Uploads not connected yet.')}
        onFilesAdded={() => {}}
      />
      <div className="flex flex-col items-start gap-3">
        <ActionButton
          type="submit"
          tone="action"
          loading={status === 'sending'}
          disabled={locked}
          {...(status === 'pending' ? { disabledReason: pendingReason('Not connected yet.') } : {})}
        >
          Send My Answers and Start My First Week
        </ActionButton>
        <p role="status" className="font-text text-brand-small text-brand-ink-subtle">
          {notice ?? 'No passwords needed, now or ever.'}
        </p>
      </div>
    </form>
  )
}
