/**
 * @testify/style-guide/components: the Testify brand compositions.
 *
 * Server-safe (no DS import): PageSection, Kicker, DisplayHeading, PricingLine,
 * ProofRow, CalendarTile, EmphasisPanel, Annotation, MediaFrame, ProcessSteps.
 * Client ('use client'): CtaRow, HonestyBlock, GuaranteeList (DS barrel) and
 * ProgressCalendar (IntersectionObserver).
 *
 * Each is also importable on its own: '@testify/style-guide/components/<Name>'.
 */
export { Annotation, type AnnotationKind, type AnnotationProps } from './Annotation'
export { CalendarTile, type CalendarTileProps, type CalendarTileState } from './CalendarTile'
export {
  buildCalendarPlan,
  ordinal,
  type CalendarPlanOptions,
  type CalendarTileData,
} from './calendar-plan'
export { CtaRow, type CtaRowProps, type CtaTone } from './CtaRow'
export {
  DisplayHeading,
  type DisplayHeadingLevel,
  type DisplayHeadingProps,
  type DisplayHeadingSize,
} from './DisplayHeading'
export { EmphasisPanel, type EmphasisPanelProps } from './EmphasisPanel'
export { GuaranteeList, type Guarantee, type GuaranteeListProps } from './GuaranteeList'
export { HonestyBlock, type HonestyBlockProps } from './HonestyBlock'
export { Kicker, type KickerProps } from './Kicker'
export { MediaFrame, type MediaFrameKind, type MediaFrameProps } from './MediaFrame'
export {
  PageSection,
  type PageSectionProps,
  type PageSectionTone,
  type PageSectionWidth,
} from './PageSection'
export { PricingLine, type PricingLineProps } from './PricingLine'
export { ProcessSteps, type ProcessStep, type ProcessStepsProps } from './ProcessSteps'
export { ProgressCalendar, type ProgressCalendarProps } from './ProgressCalendar'
export { ProofRow, type ProofFigure, type ProofRowProps } from './ProofRow'
