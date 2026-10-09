/**
 * Data for ProgressCalendar / CalendarTile. Server-safe (no React).
 *
 * Copy rules (BUILD-BRIEF, placeholder wording): day labels are ordinals; states
 * read "Today", "Your 30 topics arrive", "First video being made", "Video 1 ready",
 * "Video N ready". Never "posted", "Post done" or "board".
 */

export type CalendarTileState = 'past' | 'today' | 'milestone' | 'waiting' | 'first' | 'done'

export interface CalendarTileData {
  /** Day number, 1-based. Rendered as an ordinal. */
  day: number
  state: CalendarTileState
  /** Plain-words state label shown on the tile. */
  label: string
}

/** 1 -> "1st", 2 -> "2nd", 11 -> "11th", 23 -> "23rd". */
export function ordinal(n: number): string {
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

export interface CalendarPlanOptions {
  /** Days in the month shown. Default 30. */
  days?: number
  /** Which day is today. Days before it are `past`. Default 1. */
  today?: number
  /** Day the topics arrive. Default today + 1. */
  milestoneDay?: number
  /** Day the first video is ready; days between milestone and it are `waiting`. Default milestone + 3. */
  firstDay?: number
}

/** PLACEHOLDER plan: today, topics arrive, first video being made, then one video ready per day. */
export function buildCalendarPlan(options: CalendarPlanOptions = {}): CalendarTileData[] {
  const days = options.days ?? 30
  const today = options.today ?? 1
  const milestoneDay = options.milestoneDay ?? today + 1
  const firstDay = options.firstDay ?? milestoneDay + 3
  const tiles: CalendarTileData[] = []
  for (let day = 1; day <= days; day += 1) {
    if (day < today) tiles.push({ day, state: 'past', label: 'Before you started' })
    else if (day === today) tiles.push({ day, state: 'today', label: 'Today' })
    else if (day === milestoneDay)
      tiles.push({ day, state: 'milestone', label: 'Your 30 topics arrive' })
    else if (day < firstDay) tiles.push({ day, state: 'waiting', label: 'First video being made' })
    else if (day === firstDay) tiles.push({ day, state: 'first', label: 'Video 1 ready' })
    else tiles.push({ day, state: 'done', label: `Video ${day - firstDay + 1} ready` })
  }
  return tiles
}
