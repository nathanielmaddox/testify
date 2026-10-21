// About who we work for: the four trade groups on one white card, with two phone mocks beside them.
import { PageSection } from '@testify/style-guide/components/PageSection'
import { SectionHeader } from '@/components/site/section_header'
import { AboutPhoneMocks } from '@/components/about/about_phone_mocks'

const GROUPS = [
  "Plumbers, electricians, builders and cleaners. Your jobs become posts. You don't stop work to make them.",
  'Dental, physio and vet clinics, and med spas. Your front desk stays on the phones.',
  "Salons and barbers. Your chair, your work, your style, with your clients' OK.",
  'Local pros people hire on trust.',
]

export function AboutWho() {
  return (
    <PageSection flush width="grid" aria-labelledby="who-heading" className="pt-brand-section-gap">
      <div className="flex flex-col gap-10 rounded-card bg-brand-surface p-8 shadow-raised md:p-14 xl:flex-row xl:items-center xl:gap-14">
        <div className="flex flex-col gap-12 xl:w-[520px] xl:shrink-0">
          <SectionHeader
            kicker="Who we work for"
            heading="Trades, clinics, salons and local pros."
            sub="For owners who are good at the work and don't want to live on their phone."
            size="h2"
            id="who-heading"
          />
          <div className="flex max-w-measure flex-col gap-4">
            {GROUPS.map((group) => (
              <p key={group} className="font-text text-brand-lead text-brand-ink">
                {group}
              </p>
            ))}
          </div>
        </div>
        <AboutPhoneMocks />
      </div>
    </PageSection>
  )
}
