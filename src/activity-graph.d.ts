export type ActivityGraphData = Record<string, ActivityGraphDataEntry>;

export interface ActivityGraphDataEntry {
  text?: string;
  title?: string;
  style?: Record<string, string>;
}

export type MonthHeaderFormat = 'long' | 'short' | 'narrow' | 'numeric' | '2-digit';

export type WeekdayHeaderFormat = 'long' | 'short' | 'narrow';
