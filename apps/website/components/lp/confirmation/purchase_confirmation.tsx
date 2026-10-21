// Purchase confirmation (Paper "lp/done-for-you-99/confirmation"): the conversion page after a
// paid Stripe session. Order: "You're in" hero, the onboarding ask, what happens next, the person,
// the quiet extras. Server component: DS-backed forms live in their own client modules.
import { DisplayHeading } from '@testify/style-guide/components/DisplayHeading'
import { ProcessSteps, type ProcessStep } from '@testify/style-guide/components/ProcessSteps'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { OnboardingForm } from './onboarding_form'
import { QuietExtrasForm } from './quiet_extras_form'

const NEXT_STEPS: [ProcessStep, ProcessStep, ProcessStep, ProcessStep] = [
  { title: 'Today', body: 'Send your answers above. Two minutes.', done: true },
  {
    title: 'Day 1 to 2',
    body: 'Your first questions arrive. About 5 minutes to answer, by text or voice.',
  },
  { title: 'By [DATE]', body: 'Your first week is in your portal. Tap copy, tap post.' },
  { title: 'Every [DAY]', body: 'A new week, on time, or that week is free.' },
]

export function PurchaseConfirmation({
  idPrefix,
  referenceId,
}: {
  idPrefix: string
  /** The verified Stripe session id, sent with the onboarding answers. */
  referenceId: string
}) {
  const heroId = `${idPrefix}-hero-heading`
  const onboardingId = `${idPrefix}-onboarding-heading`
  const nextId = `${idPrefix}-next-steps-heading`
  const personId = `${idPrefix}-person-heading`

  return (
    <>
      <PageSection
        id={`${idPrefix}-hero`}
        aria-labelledby={heroId}
        width="grid"
        flush
        className="pt-brand-section pb-12"
      >
        <DisplayHeading
          level={1}
          size="display"
          id={heroId}
          lead="You just bought back your evenings. From here on, a post and a story for every day lands in your portal, captions written, posting days set. All we need now is two minutes of answers."
        >
          You&apos;re In! Your Page Starts Showing Up Every Single Day From [DATE], and Your First
          Week of Posts and Stories Will Be Waiting in Your Portal
        </DisplayHeading>
        {/* OWNER ITEM: nothing sends this receipt or portal-link email yet. Paper copy is kept as written
            until the owner confirms the email flow (Stripe receipts, portal link sender). */}
        <p className="font-text text-brand-small text-brand-ink-subtle">
          Receipt sent to [EMAIL]. Your portal link is in that email too.
        </p>
      </PageSection>

      <PageSection
        id={`${idPrefix}-onboarding`}
        aria-labelledby={onboardingId}
        width="grid"
        flush
        className="pb-16"
      >
        <DisplayHeading
          level={2}
          size="h2"
          id={onboardingId}
          lead="Tell us what you do and where, and drop in a few photos from recent jobs. That's the most we'll ever ask of you in one go. After this, it's about 5 minutes a week."
        >
          Two Minutes of Answers and Your First Week Is On Its Way
        </DisplayHeading>
        <OnboardingForm idPrefix={idPrefix} referenceId={referenceId} />
      </PageSection>

      <PageSection
        id={`${idPrefix}-next-steps`}
        aria-labelledby={nextId}
        width="grid"
        flush
        className="pb-16"
      >
        <DisplayHeading level={2} size="h2" id={nextId}>
          What happens next
        </DisplayHeading>
        <ProcessSteps steps={NEXT_STEPS} headingLevel={3} />
      </PageSection>

      <PageSection
        id={`${idPrefix}-your-person`}
        aria-labelledby={personId}
        width="grid"
        flush
        className="pb-16"
      >
        <div className="grid gap-8 lg:grid-cols-[400px_minmax(0,1fr)] lg:items-start">
          <div className="flex w-full max-w-[400px] flex-col gap-5 rounded-card bg-brand-surface px-6 pb-8 pt-6 shadow-lifted">
            <div
              aria-hidden="true"
              className="h-40 w-full rounded-media bg-brand-canvas-alt lg:h-[200px]"
            />
            <h2 id={personId} className="px-2 font-display text-brand-h3 text-brand-ink">
              [NAME], [ROLE]
            </h2>
          </div>
          <div className="flex flex-col gap-8">
            <blockquote className="max-w-measure-heading font-display text-brand-h3 text-brand-ink">
              &quot;Hi [FIRST NAME], I&apos;m [NAME]. I&apos;ll personally make sure your first week
              is right. Reply to any email from us and you&apos;ll get me.&quot;
            </blockquote>
            <p className="font-text text-brand-small text-brand-ink-subtle">
              Questions? [NAME] replies within [N] hours: hello@[DOMAIN]
            </p>
          </div>
        </div>
      </PageSection>

      <PageSection
        id={`${idPrefix}-quiet-extras`}
        aria-label="Full service and feedback"
        width="grid"
        flush
        className="pb-24"
      >
        <div className="flex flex-col gap-6">
          <QuietExtrasForm idPrefix={idPrefix} referenceId={referenceId} />
          <p className="font-text text-brand-body text-brand-ink-muted">
            Want us to post and reply for you later? That&apos;s our full service. Just ask [NAME].
          </p>
          <p className="font-text text-brand-small font-medium text-brand-ink-subtle">
            Your promises: first month love it or it&apos;s free · late week is free · unlimited
            edits · cancel in 2 clicks · we never need your passwords.
          </p>
          <p className="font-text text-brand-body text-brand-ink">
            <strong className="font-semibold">P.S.</strong> Even if you ask for a refund after month
            one, you keep all 60 pieces.
          </p>
        </div>
      </PageSection>
    </>
  )
}
