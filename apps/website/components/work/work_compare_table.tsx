'use client'

// Comparison grids for the work pages (compare, proof). Wraps the DS ComparisonTable: rows are the labels, each column carries one value per row. featureColumnLabel names the row-label column in the DS header.
import { ComparisonTable, type ComparisonTableProps } from '@otesse/design-system'

export interface WorkCompareTableProps {
  rows: NonNullable<ComparisonTableProps['rows']>
  columns: NonNullable<ComparisonTableProps['columns']>
  /** Index of the column to emphasize (0-based). */
  highlightColumn?: number
  /** Header text for the row-label column, e.g. "What we can show". */
  featureColumnLabel?: string
}

export function WorkCompareTable({
  rows,
  columns,
  highlightColumn,
  featureColumnLabel,
}: WorkCompareTableProps) {
  return (
    // Below the grid's width the table scrolls sideways inside its own box, so the page never does.
    <div className="overflow-x-auto">
      <ComparisonTable
        rows={rows}
        columns={columns}
        {...(highlightColumn !== undefined ? { highlightColumn } : {})}
        {...(featureColumnLabel !== undefined ? { featureColumnLabel } : {})}
      />
    </div>
  )
}
