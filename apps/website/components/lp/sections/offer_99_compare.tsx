'use client'

/**
 * Two-column comparison for the offer LP time section: the DS ComparisonTable
 * with each row as a feature (left column: doing it yourself), and one column
 * for the service. Client module because the DS table is interactive.
 */
import { ComparisonTable, type ComparisonTableProps } from '@otesse/design-system'

/** One comparison row (the DS `ComparisonRow`, read from the table's props). */
type ComparisonRow = NonNullable<ComparisonTableProps['rows']>[number]
/** One comparison column (the DS `ComparisonColumnDefinition`, read from the table's props). */
type ComparisonColumn = NonNullable<ComparisonTableProps['columns']>[number]

export interface OfferCompareRow {
  yourself: string
  withService: string
}

export function OfferCompare({
  rows,
  yourselfLabel,
  serviceLabel,
}: {
  rows: readonly OfferCompareRow[]
  yourselfLabel: string
  serviceLabel: string
}) {
  const tableRows: ComparisonRow[] = rows.map((row, index) => ({
    id: `row-${index}`,
    name: row.yourself,
  }))
  const products: ComparisonColumn[] = [
    {
      id: 'service',
      name: serviceLabel,
      values: rows.map((row) => row.withService),
    },
  ]
  return (
    <ComparisonTable
      rows={tableRows}
      columns={products}
      featureColumnLabel={yourselfLabel}
      showCategories={false}
    />
  )
}
