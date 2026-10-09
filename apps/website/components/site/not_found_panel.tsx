'use client'

import { useRouter } from 'next/navigation'
import { EmptyState, Layout } from '@otesse/design-system'

/** 404 body, drawn by the DS EmptyState. */
export function NotFoundPanel() {
  const router = useRouter()
  return (
    <Layout variant="container" maxWidth="md" className="py-24">
      <EmptyState
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={{ label: 'Back to home', onClick: () => router.push('/'), variant: 'primary' }}
      />
    </Layout>
  )
}
