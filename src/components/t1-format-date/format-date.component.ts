import { LitElement, html } from 'lit';
import { property } from 'lit/decorators.js';
import { LocalizeController } from '@utils/localize';

export default class T1FormatDate extends LitElement {
  private readonly localize = new LocalizeController(this);

  /**
   * The date/time to format. Defaults to the current date/time. Pass an ISO 8601 string
   * to ensure timezone handling is correct.
   */
  @property() date: Date | string = new Date();

  /** The format for displaying the weekday. */
  @property() weekday: 'narrow' | 'short' | 'long' | undefined;

  /** The format for displaying the era. */
  @property() era: 'narrow' | 'short' | 'long' | undefined;

  /** The format for displaying the year. */
  @property() year: 'numeric' | '2-digit' | undefined;

  /** The format for displaying the month. */
  @property() month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long' | undefined;

  /** The format for displaying the day. */
  @property() day: 'numeric' | '2-digit' | undefined;

  /** The format for displaying the hour. */
  @property() hour: 'numeric' | '2-digit' | undefined;

  /** The format for displaying the minute. */
  @property() minute: 'numeric' | '2-digit' | undefined;

  /** The format for displaying the second. */
  @property() second: 'numeric' | '2-digit' | undefined;

  /** The format for displaying the time zone name. */
  @property({ attribute: 'time-zone-name' }) timeZoneName: 'short' | 'long' | undefined;

  /** The time zone to express the time in. */
  @property({ attribute: 'time-zone' }) timeZone: string | undefined;

  /** Controls 12-hour vs 24-hour time format. `auto` uses the locale default. */
  @property({ attribute: 'hour-format' }) hourFormat: 'auto' | '12' | '24' = 'auto';

  render() {
    const date = new Date(this.date);
    if (isNaN(date.getTime())) return undefined;

    const hour12 = this.hourFormat === 'auto' ? undefined : this.hourFormat === '12';

    return html`
      <time datetime=${date.toISOString()}>
        ${this.localize.date(date, {
          weekday: this.weekday,
          era: this.era,
          year: this.year,
          month: this.month,
          day: this.day,
          hour: this.hour,
          minute: this.minute,
          second: this.second,
          timeZoneName: this.timeZoneName,
          timeZone: this.timeZone,
          hour12,
        })}
      </time>
    `;
  }
}
