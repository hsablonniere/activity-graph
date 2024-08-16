export interface PlainDate extends PlainDatePartial {
  id: string;
  year: number;
  month: number;
  date: number;
  weekday: number;
  weekIndex: number;
  isInFirstWeekOfTheMonth: boolean;
}

export type ActivityGraphData = Record<string, ActivityGraphDataEntry>;

export interface ActivityGraphDataEntry {
  text?: string;
  title?: string;
  style?: Record<string, string>;
}

export type MonthHeaderFormat = 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';

export type MonthLimits = 'early' | 'middle' | 'late';

export type MonthPosition = 'top' | 'bottom';

export type WeekdayHeaderFormat = 'long' | 'short' | 'narrow';
