import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { IsoDate, isoDateAttributePropertyConverter } from './iso-date.js';
import { shadowPartAttribute } from './shadow-part-attribute.js';

/**
 * @typedef {import('./activity-graph.d.ts').ActivityGraphData} ActivityGraphData
 * @typedef {import('./activity-graph.d.ts').MonthHeaderFormat} MonthHeaderFormat
 * @typedef {import('./activity-graph.d.ts').MonthPosition} MonthPosition
 * @typedef {import('./activity-graph.d.ts').WeekdayHeaderFormat} WeekdayHeaderFormat
 */

export class ActivityGraph extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      endDate: { type: IsoDate, attribute: 'end-date', converter: isoDateAttributePropertyConverter },
      lang: { type: String },
      monthHeaders: { type: String, attribute: 'month-headers' },
      monthLimits: { type: String, attribute: 'month-limits' },
      monthPosition: { type: String, attribute: 'month-position' },
      startDate: { type: IsoDate, attribute: 'start-date', converter: isoDateAttributePropertyConverter },
      weekStartDay: { type: Number, attribute: 'week-start-day' },
      weekdayHeaders: { type: String, attribute: 'weekday-headers' },
    };
  }

  constructor() {
    super();

    /** @type {ActivityGraphData|null} */
    this.data = null;

    /** @type {IsoDate} */
    this.endDate = new IsoDate();

    /** @type {string} */
    this.lang = document?.querySelector('html')?.lang ?? 'en';

    /** @type {'none' | MonthHeaderFormat } */
    this.monthHeaders = 'short';

    /** @type {'early' | 'middle' | 'late'} */
    this.monthLimits = 'middle';

    /** @type {MonthPosition} */
    this.monthPosition = 'top';

    /** @type {IsoDate} */
    this.startDate = this.endDate.addYears(-1);

    /** @type {number} */
    this.weekStartDay = 0;

    /** @type {'none' | WeekdayHeaderFormat} */
    this.weekdayHeaders = 'narrow';
  }

  /**
   * @param {number} value
   * @return {number}
   */
  #roundMonthLimit(value) {
    if (this.monthLimits === 'early') {
      return Math.floor(value / 2) * 2;
    }
    if (this.monthLimits === 'late') {
      return Math.ceil(value / 2) * 2;
    }
    return value;
  }

  render() {
    const dates = Array
      //
      .from({ length: this.startDate.countDaysUntil(this.endDate) })
      .map((_, nbDays) => this.startDate.addDays(nbDays));

    return [this.#renderWeekdayHeaders(), this.#renderMonthHeaders(dates), this.#renderDays(dates)];
  }

  #renderWeekdayHeaders() {
    if (this.weekdayHeaders === 'none') {
      return nothing;
    }

    const weekdayHeaderFormat = this.weekdayHeaders;
    const monthRowAtTop = this.monthHeaders !== 'none' && this.monthPosition === 'top';

    return Array.from({ length: 7 }).map((_, nbDays) => {
      const shift = nbDays - this.startDate.getDay() + this.weekStartDay;
      const date = this.startDate.addDays(shift);
      const text = date.toLocaleDateString(this.lang, { weekday: weekdayHeaderFormat });

      const isEvenMonth = date.getDay(this.weekStartDay) % 2 === 0;
      const parts = ['weekday-header', isEvenMonth ? 'weekday-header--even' : 'weekday-header--odd'];

      const style = {
        gridRowStart: nbDays + (monthRowAtTop ? 2 : 1),
        gridColumnEnd: 'span 2',
      };

      return html` <div part=${shadowPartAttribute(parts)} style=${styleMap(style)}>${text}</div>`;
    });
  }

  /**
   * @param {IsoDate[]} dates
   */
  #renderMonthHeaders(dates) {
    if (this.monthHeaders === 'none') {
      return nothing;
    }

    const monthHeaderFormat = this.monthHeaders;
    const monthRowAtTop = this.monthPosition === 'top';
    const weekdayColumn = this.weekdayHeaders !== 'none';
    const columnShift = weekdayColumn ? 3 : 1;

    return dates
      .flatMap((date) => {
        const rebasedWeekday = date.getDay(this.weekStartDay);

        const isGraphStartDate = date.isSameDate(this.startDate);
        const isWeekStartDay = rebasedWeekday === 0;
        const isWeekEndDay = rebasedWeekday === 6;
        const isGraphEndDate = date.isSameDate(this.endDate);

        if ((isGraphStartDate && isWeekEndDay) || (isWeekStartDay && isGraphEndDate)) {
          return [date, date];
        }

        if (isGraphStartDate || isWeekStartDay || isWeekEndDay || isGraphEndDate) {
          return date;
        }

        return [];
      })
      .map((date, index) => {
        return { date, index };
      })
      .map((monthSlice, index, allMonthSlices) => {
        const currentMonthSlices = allMonthSlices.filter((ms) => monthSlice.date.isSameMonth(ms.date));
        const firstMonthSlice = currentMonthSlices[0];
        if (firstMonthSlice?.index !== index) {
          return nothing;
        }
        const monthName = firstMonthSlice.date.toLocaleDateString(this.lang, { month: monthHeaderFormat });
        const rawWeekStart = firstMonthSlice.index;
        const rawWeekEnd = rawWeekStart + currentMonthSlices.length;
        const style = {
          gridRowStart: monthRowAtTop ? 1 : 8,
          gridColumnStart: this.#roundMonthLimit(rawWeekStart) + columnShift,
          gridColumnEnd: this.#roundMonthLimit(rawWeekEnd) + columnShift,
        };
        return html` <div part="month-header" style=${styleMap(style)}>${monthName}</div>`;
      });
  }

  /**
   * @param {IsoDate[]} dates
   */
  #renderDays(dates) {
    const weekdayColumn = this.weekdayHeaders !== 'none';
    const monthRowAtTop = this.monthHeaders !== 'none' && this.monthPosition === 'top';
    const daysBeforeStart = this.startDate.getDay(this.weekStartDay);

    return dates.map((date, index) => {
      const dateString = date.toString();

      const data = this.data?.[dateString];
      const text = data?.text ?? '';
      const title = data?.title ?? null;
      const dataStyle = data?.style ?? {};

      const hasData = data != null;
      const parts = ['day', hasData ? 'day--data' : 'day--nodata'];

      const currentWeek = Math.floor((index + daysBeforeStart) / 7);
      const style = {
        gridRowStart: 1 + (monthRowAtTop ? 1 : 0) + date.getDay(this.weekStartDay),
        gridColumnStart: 1 + (weekdayColumn ? 2 : 0) + currentWeek * 2,
        gridColumnEnd: 'span 2',
        ...dataStyle,
      };

      return html`
        <div part=${shadowPartAttribute(parts)} title=${ifDefined(title)} style=${styleMap(style)}>${text}</div>
      `;
    });
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        grid-auto-columns: auto;
        justify-content: start;
      }
    `;
  }
}

window.customElements.define('activity-graph', ActivityGraph);
