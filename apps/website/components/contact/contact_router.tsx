'use client'

// Contact router: the Sales card (new prospects, to /get-started) and the Support card (existing clients).
import { ActionButton } from '@testify/style-guide/components/ActionButton'
import { CtaRow } from '@testify/style-guide/components/CtaRow'
import { Kicker } from '@testify/style-guide/components/Kicker'
import { PageSection } from '@testify/style-guide/components/PageSection'
import { PricingLine } from '@testify/style-guide/components/PricingLine'
import { useAttributedHref } from '@/components/lp/use_attributed_href'
import { routes } from '@/lib/site.config'

// Paper text for the support address. The visible line, the mailto link and the Copy button all use it.
const SUPPORT_EMAIL = 'support@[DOMAIN]'

const SALES_STEPS = [
  'Three quick questions. About two minutes.',
  'Pick a time that suits you.',
  'A 15-minute call. You keep the post ideas, hire us or not.',
]

const CARD = 'flex flex-col gap-8 rounded-card bg-brand-surface p-brand-card shadow-raised'

async function copySupportEmail() {
  try {
    await navigator.clipboard.writeText(SUPPORT_EMAIL)
  } catch {
    // Clipboard blocked: the address stays visible on the page.
  }
}

export function ContactRouter() {
  // Carries stored UTM and click ids to the get-started flow, as the site CTA does.
  const getStartedHref = useAttributedHref(routes.getStarted.path)
  return (
    <PageSection as="div" flush width="grid" className="pt-brand-section-gap">
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
        <section aria-labelledby="contact-sales-heading" className={CARD}>
          <Kicker>New to Testify</Kicker>
          <div className="flex flex-col gap-3">
            <h2 id="contact-sales-heading" className="font-display text-brand-h3 text-brand-ink">
              Want us to run your social media?
            </h2>
            <p className="font-text text-brand-lead text-brand-ink-muted">
              Answer a few questions about your business, then pick a time to talk with the person
              who&apos;d run your account. We&apos;ll show you what we&apos;d post and tell you
              straight if we&apos;re a fit.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-text text-brand-body-strong text-brand-ink">What happens next</h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5 marker:font-semibold marker:text-brand-ink">
              {SALES_STEPS.map((step) => (
                <li key={step} className="font-text text-brand-body text-brand-ink-muted">
                  {step}
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-auto">
            <CtaRow
              href={getStartedHref}
              label="Get started"
              tone="quiet"
              caption={
                <PricingLine>
                  You choose the time. If we&apos;re a fit, you get one fixed monthly price in
                  writing within [1 business day]. Month to month, nothing to sign on the call.
                </PricingLine>
              }
            />
          </div>
        </section>

        <section aria-labelledby="contact-support-heading" className={CARD}>
          <Kicker>Clients</Kicker>
          <div className="flex flex-col gap-3">
            <h2 id="contact-support-heading" className="font-display text-brand-h3 text-brand-ink">
              Already working with us?
            </h2>
            <p className="font-text text-brand-lead text-brand-ink-muted">
              Message your account lead in your client portal, or email support. Adding a platform
              or changing your plan? Same place, no new call.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-text text-brand-body-strong text-brand-ink">Ways to reach us</h3>
            <ul className="flex flex-col gap-3">
              <li className="font-text text-brand-body text-brand-ink-muted">
                Client portal: message your account lead
              </li>
              <li className="flex flex-wrap items-center gap-3 font-text text-brand-body text-brand-ink-muted">
                <span>Email: {SUPPORT_EMAIL}</span>
                <ActionButton onClick={copySupportEmail}>Copy</ActionButton>
              </li>
              <li className="font-text text-brand-body text-brand-ink-muted">
                Include your business name so we find you fast.
              </li>
            </ul>
          </div>
          <div className="mt-auto">
            <CtaRow
              href={`mailto:${SUPPORT_EMAIL}`}
              label="Email support"
              tone="quiet"
              linkComponent="a"
              caption={
                <PricingLine>
                  Support hours: [SUPPORT HOURS]. We reply within one business day. Want to cancel?
                  Email us, no call needed.
                </PricingLine>
              }
            />
          </div>
        </section>
      </div>
    </PageSection>
  )
}
