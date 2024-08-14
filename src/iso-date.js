/**
 * @typedef {import('./activity-graph.d.ts').MonthHeaderFormat} MonthHeaderFormat
 * @typedef {import('./activity-graph.d.ts').WeekdayHeaderFormat} WeekdayHeaderFormat
 */

const ONE_DAY = 1000 * 60 * 60 * 24;

export class IsoDate extends Date {
  /**
   * Same as Date.getDay(), but you can override the week start day
   * @param {number} [weekStartDay]
   * @return {number}
   */
  getDay(weekStartDay = 0) {
    return (super.getDay() + 7 - weekStartDay) % 7;
  }

  /**
   * @param {number} days
   * @return {IsoDate}
   */
  addDays(days) {
    return new IsoDate(this.getTime() + days * ONE_DAY);
  }

  /**
   * @param {number} years
   * @return {IsoDate}
   */
  addYears(years) {
    const newDate = new IsoDate(this.getTime());
    newDate.setFullYear(this.getFullYear() + years);
    return newDate;
  }

  /**
   * @param {IsoDate} date
   * @return {number}
   */
  countDaysUntil(date) {
    return (date.getTime() - this.getTime()) / ONE_DAY + 1;
  }

  /**
   * @param {IsoDate} date
   */
  isSameDate(date) {
    return this.getTime() === date.getTime();
  }

  /**
   * @param {IsoDate} date
   * @return {boolean}
   */
  isSameMonth(date) {
    const monthA = this.toISOString().substring(0, 7);
    const monthB = date.toISOString().substring(0, 7);
    return monthA === monthB;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.toISOString().substring(0, 10);
  }
}

export const isoDateAttributePropertyConverter = {
  /**
   * @param {string} dateString
   * @return {IsoDate}
   */
  fromAttribute(dateString) {
    return new IsoDate(dateString);
  },

  /**
   * @param {IsoDate} date
   * @return {string}
   */
  toAttribute(date) {
    return date.toString();
  },
};
