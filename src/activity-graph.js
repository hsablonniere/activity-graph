import { css, html, LitElement, nothing } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';
import { shadowPartAttribute } from './shadow-part-attribute.js';

/**
 * @typedef {import('./activity-graph.d.ts').PlainDate} PlainDate
 * @typedef {import('./activity-graph.d.ts').ActivityGraphData} ActivityGraphData
 * @typedef {import('./activity-graph.d.ts').MonthHeaderFormat} MonthHeaderFormat
 * @typedef {import('./activity-graph.d.ts').MonthLimits} MonthLimits
 * @typedef {import('./activity-graph.d.ts').MonthPosition} MonthPosition
 * @typedef {import('./activity-graph.d.ts').WeekdayHeaderFormat} WeekdayHeaderFormat
 */

export class ActivityGraph extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      endDate: { type: String, attribute: 'end-date' },
      lang: { type: String },
      monthHeaders: { type: String, attribute: 'month-headers' },
      monthLimits: { type: String, attribute: 'month-limits' },
      monthPosition: { type: String, attribute: 'month-position' },
      startDate: { type: String, attribute: 'start-date' },
      weekStartDay: { type: Number, attribute: 'week-start-day' },
      weekdayHeaders: { type: String, attribute: 'weekday-headers' },
    };
  }

  constructor() {
    super();

    // Default time window is one year from today to today
    const baseDate = new Date();
    const endDate = baseDate.toISOString().substring(0, 10);
    baseDate.setUTCFullYear(baseDate.getFullYear() - 1);
    baseDate.setUTCDate(baseDate.getDate() + 1);
    const startDate = baseDate.toISOString().substring(0, 10);

    /** @type {ActivityGraphData|null} */
    this.data = null;

    /** @type {string} */
    this.endDate = endDate;

    /** @type {string} */
    this.lang = globalThis.document?.querySelector('html')?.lang || 'en';

    /** @type {'none' | MonthHeaderFormat } */
    this.monthHeaders = 'short';

    /** @type {MonthLimits} */
    this.monthLimits = 'late';

    /** @type {MonthPosition} */
    this.monthPosition = 'top';

    /** @type {string} */
    this.startDate = startDate;

    /** @type {number} */
    this.weekStartDay = 0;

    /** @type {'none' | WeekdayHeaderFormat} */
    this.weekdayHeaders = 'narrow';
  }

  /**
   * @return {Array<PlainDate>}
   */
  #getDates() {
    const currentDate = new Date(this.startDate);
    const endDate = new Date(this.endDate);
    const startDateWeekday = this.#getWeekday(currentDate);

    /** @type {Array<PlainDate>} */
    const dates = [];

    while (currentDate <= endDate) {
      const date = currentDate.getDate();
      const weekday = this.#getWeekday(currentDate);
      dates.push({
        id: currentDate.toISOString().substring(0, 10),
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        date,
        weekday,
        weekIndex: Math.floor((dates.length + startDateWeekday) / 7),
        isInFirstWeekOfTheMonth: date <= weekday + 1,
      });
      currentDate.setUTCDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  /**
   * @param {Date} date
   */
  #getWeekday(date) {
    return (date.getDay() + 7 - this.weekStartDay) % 7;
  }

  render() {
    const dates = this.#getDates();
    const baseRowDays = this.monthHeaders === 'none' || this.monthPosition === 'bottom' ? 1 : 2;
    const baseRowMonthHeaders = this.monthPosition === 'top' ? 1 : 8;
    const baseColumnDays = this.weekdayHeaders === 'none' ? 1 : 2;
    return [
      this.#renderWeekdayHeaders(dates, baseRowDays),
      this.#renderMonthHeaders(dates, baseRowMonthHeaders, baseColumnDays),
      this.#renderDays(dates, baseRowDays, baseColumnDays),
    ].flat();
  }

  /**
   * @param {Array<PlainDate>} dates
   * @param {number} baseRow
   */
  #renderWeekdayHeaders(dates, baseRow) {
    if (this.weekdayHeaders === 'none') {
      return nothing;
    }

    const shift = 7 - dates[0].weekday;
    const weekdayHeaderFormat = this.weekdayHeaders;

    return dates.slice(shift, shift + 7).map((date, index) => {
      const text = new Date(date.id).toLocaleDateString(this.lang, { weekday: weekdayHeaderFormat });

      const isWeekdayHeaderEven = date.weekday % 2 === 0;
      const parts = ['weekday-header', isWeekdayHeaderEven ? 'weekday-header--even' : 'weekday-header--odd'];

      return html` <div part=${shadowPartAttribute(parts)} style="grid-row: ${baseRow + index}">${text}</div>`;
    });
  }

  /**
   * @param {Array<PlainDate>} dates
   * @param {number} baseRow
   * @param {number} baseColumn
   */
  #renderMonthHeaders(dates, baseRow, baseColumn) {
    if (this.monthHeaders === 'none') {
      return nothing;
    }

    const monthHeaderFormat = this.monthHeaders;

    return dates
      .filter((d, i) => i === 0 || d.date === 1)
      .map((firstDayOfTheMonth, i, all) => {
        const monthName = new Date(firstDayOfTheMonth.id).toLocaleDateString(this.lang, { month: monthHeaderFormat });

        const { year, month } = firstDayOfTheMonth;
        const lastDayOfTheMonth = dates.findLast((d) => d.year === year && d.month === month);
        const isGraphStartMonth = i === 0;
        const isGraphEndMonth = i === all.length - 1;

        const dayStart =
          isGraphStartMonth || this.monthLimits !== 'late'
            ? firstDayOfTheMonth
            : dates.find((d) => d.year === year && d.month === month && d.weekday === 0);

        const dayEnd =
          isGraphEndMonth || this.monthLimits !== 'early'
            ? lastDayOfTheMonth
            : dates.findLast((d) => d.year === year && d.month === month && d.weekday === 6);

        if (firstDayOfTheMonth == null || lastDayOfTheMonth == null || dayStart == null || dayEnd == null) {
          throw new Error('TODO');
        }

        const colStart = baseColumn + dayStart.weekIndex;
        const colEnd = baseColumn + dayEnd.weekIndex + 1;

        const style = {
          marginLeft: isGraphStartMonth || firstDayOfTheMonth.weekday === 0 ? null : 'var(--activity-graph-month-gap)',
          marginRight: isGraphEndMonth || lastDayOfTheMonth.weekday === 6 ? null : 'var(--activity-graph-month-gap)',
          gridColumn: `${colStart}/${colEnd}`,
          gridRow: baseRow,
        };

        return html` <div part="month-header" style=${styleMap(style)}>${monthName}</div>`;
      });
  }

  /**
   * @param {Array<PlainDate>} dates
   * @param {number} baseRow
   * @param {number} baseColumn
   */
  #renderDays(dates, baseRow, baseColumn) {
    return dates.map((date) => {
      const data = this.data?.[date.id];
      const text = data?.text ?? '';
      const title = data?.title ?? null;

      const dataParts = data?.parts ?? [];
      const parts = ['day', ...dataParts];

      const style = {
        gridArea: `${baseRow + date.weekday}/${baseColumn + date.weekIndex}`,
        marginLeft: date.isInFirstWeekOfTheMonth && date.weekIndex !== 0 ? 'var(--activity-graph-month-gap)' : null,
      };

      return html`
        <div part=${shadowPartAttribute(parts)} title=${ifDefined(title)} style=${styleMap(style)} data-date=${date.id}>
          ${text}
        </div>
      `;
    });
  }

  static get styles() {
    return css`
      :host {
        display: grid;
        justify-content: start;
      }
    `;
  }
}

customElements.define('activity-graph', ActivityGraph);
