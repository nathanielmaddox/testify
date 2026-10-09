import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLpLayout } from '@/components/lp/layouts'
import { getLandingPage, landingPages, lpPath } from '@/lib/landing_pages'
import { lpMetadata } from '@/lib/metadata'
import { jsonLdScriptProps, serviceJsonLd } from '@/lib/structured_data'

/**
 * One paid landing page per registry entry (lib/landing_pages.ts), at
 * `/lp/<slug>`. The slug names the ad it serves. Every LP is prerendered at
 * build time; any other slug is a 404 (`dynamicParams = false`, plus the
 * `notFound()` guard). The entry's `layout` picks the component that draws
 * the page (components/lp/layouts), and its `sections` say what it shows.
 */
export const dynamicParams = false

type Params = Promise<{ slug: string }>

export function generateStaticParams(): Array<{ slug: string }> {
  return landingPages.map((lp) => ({ slug: lp.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const lp = getLandingPage((await params).slug)
  return lp ? lpMetadata(lp) : {}
}

export default async function LandingPageRoute({ params }: { params: Params }) {
  const lp = getLandingPage((await params).slug)
  if (!lp) notFound()
  const { component: Layout } = getLpLayout(lp)
  return (
    <>
      <script {...jsonLdScriptProps(serviceJsonLd(lpPath(lp.slug)))} />
      <Layout lp={lp} />
    </>
  )
}
