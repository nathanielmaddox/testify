import type { Metadata } from 'next'
import { NotFoundPanel } from '@/components/site/not_found_panel'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return <NotFoundPanel />
}
