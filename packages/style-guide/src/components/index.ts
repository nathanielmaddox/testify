/**
 * @testify/style-guide/components: the Testify brand compositions.
 *
 * Server-safe (no DS import): PageSection, Kicker, DisplayHeading, PricingLine,
 * ProofRow, CalendarTile, EmphasisPanel, Annotation, MediaFrame, ProcessSteps,
 * HonestyBlock, GuaranteeList.
 * Client ('use client', DS barrel): CtaRow, ActionButton, SubmitButton, TextLink,
 * Notice, TextField, TextAreaField, SelectField, CheckboxField, RadioGroupField,
 * ChoiceChip, ChoiceChipGroup, TimePill, BookingDayCell, BookingDayGrid, BrandIcon
 * (DS Icon with the lucide-react registry); ProgressCalendar (IntersectionObserver).
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
export {
  ActionButton,
  SubmitButton,
  type ActionButtonProps,
  type ActionTone,
  type SubmitButtonProps,
} from './ActionButton'
export {
  BookingDayCell,
  BookingDayGrid,
  type BookingDayCellProps,
  type BookingDayGridProps,
} from './BookingDayCell'
export { CheckboxField, type CheckboxFieldProps } from './CheckboxField'
export {
  ChoiceChip,
  ChoiceChipGroup,
  type ChoiceChipGroupProps,
  type ChoiceChipProps,
} from './ChoiceChip'
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
export { Notice, type NoticeProps, type NoticeTone } from './Notice'
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
export { RadioGroupField, type RadioGroupFieldProps } from './RadioGroupField'
export { SelectField, type SelectFieldProps } from './SelectField'
export { TextAreaField, type TextAreaFieldProps } from './TextAreaField'
export { TextField, type TextFieldProps } from './TextField'
export { TextLink, type TextLinkProps } from './TextLink'
export { TimePill, type TimePillProps } from './TimePill'
export { BrandIcon, brandIcons, type BrandIconName, type BrandIconProps } from './BrandIcon'
