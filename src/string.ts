import type { DateParts, TimePrecision } from "./date-parts.ts";
import {
    createLocalDate,
    formatDateParts,
    formatDatetimeParts,
    formatTimeParts,
    getLocalParts,
    pad,
    toValidDate,
} from "./date-parts.ts";

export type { TimePrecision } from "./date-parts.ts";

/** Options for `formatTime`. */
export interface FormatTimeOptions {
    /**
     * The smallest time unit to include.
     *
     * If it is not set, seconds and milliseconds are only included when they are not zero.
     */
    precision?: TimePrecision;
}

/** Options for `formatDatetime`. */
export interface FormatDatetimeOptions extends FormatTimeOptions {
    /**
     * The separator between the date and the time. Use `" "` to format a datetime for SQL.
     *
     * @default "T"
     */
    separator?: "T" | " ";
}

/** Options for `formatLocalISOString`. */
export interface FormatLocalISOStringOptions {
    /**
     * The smallest time unit to include.
     *
     * @default "millisecond"
     */
    precision?: "second" | "millisecond";
}

type DateFields = Pick<DateParts, "year" | "month" | "day">;
type TimeFields = Pick<DateParts, "hour" | "minute" | "second" | "millisecond">;

const DATE_REGEX = /^(\d{4,})-(\d{2})-(\d{2})$/u;
const TIME_REGEX = /^(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/u;

const matchDate = (value: string): DateFields | null => {
    const match = DATE_REGEX.exec(value);

    if (match === null) {
        return null;
    }

    const [, year, month, day] = match;

    return { year: Number(year), month: Number(month), day: Number(day) };
};

const matchTime = (value: string): TimeFields | null => {
    const match = TIME_REGEX.exec(value);

    if (match === null) {
        return null;
    }

    const [, hour, minute, second = "0", fraction = ""] = match;

    return {
        hour: Number(hour),
        minute: Number(minute),
        second: Number(second),
        // ".5" means 500 milliseconds.
        millisecond: Number(fraction.padEnd(3, "0")),
    };
};

/**
 * Formats a date to a string for the `value`, `min` or `max` attribute of an `input[type="date"]`
 * element, such as `2000-01-01`.
 *
 * @returns An empty string if the date is invalid or its year is less than 1.
 */
export const formatDate = (date: Date | number): string => {
    const validDate = toValidDate(date);

    return validDate === null ? "" : formatDateParts(getLocalParts(validDate));
};

/**
 * Formats a date to a string for the `value`, `min` or `max` attribute of an `input[type="time"]`
 * element, such as `13:30`.
 *
 * @returns An empty string if the date is invalid.
 */
export const formatTime = (date: Date | number, options: FormatTimeOptions = {}): string => {
    const validDate = toValidDate(date);

    return validDate === null ? "" : formatTimeParts(getLocalParts(validDate), options.precision);
};

/**
 * Formats a date to a string for the `value`, `min` or `max` attribute of an
 * `input[type="datetime-local"]` element, such as `2000-01-01T13:30`.
 *
 * @returns An empty string if the date is invalid or its year is less than 1.
 */
export const formatDatetime = (
    date: Date | number,
    options: FormatDatetimeOptions = {},
): string => {
    const validDate = toValidDate(date);

    if (validDate === null) {
        return "";
    }

    return formatDatetimeParts(getLocalParts(validDate), options.separator, options.precision);
};

/**
 * Parses the value of an `input[type="date"]` element, such as `2000-01-01`, to a date at midnight
 * in local time.
 *
 * @returns `null` if the value is empty or invalid.
 */
export const parseDate = (value: string): Date | null => {
    const date = matchDate(value);

    if (date === null) {
        return null;
    }

    return createLocalDate({ ...date, hour: 0, minute: 0, second: 0, millisecond: 0 });
};

/**
 * Parses the value of an `input[type="time"]` element, such as `13:30`, to a date in local time.
 * Like the `valueAsDate` property, the date part is 1970-01-01.
 *
 * @returns `null` if the value is empty or invalid.
 */
export const parseTime = (value: string): Date | null => {
    const time = matchTime(value);

    if (time === null) {
        return null;
    }

    return createLocalDate({ year: 1970, month: 1, day: 1, ...time });
};

/**
 * Parses the values of an `input[type="date"]` element and an `input[type="time"]` element to a
 * date in local time.
 *
 * @returns `null` if a value is empty or invalid.
 */
export const parseDateAndTime = (dateValue: string, timeValue: string): Date | null => {
    const date = matchDate(dateValue);
    const time = matchTime(timeValue);

    if (date === null || time === null) {
        return null;
    }

    return createLocalDate({ ...date, ...time });
};

/**
 * Parses the value of an `input[type="datetime-local"]` element, such as `2000-01-01T13:30`, to a
 * date in local time. A space can also be used instead of `T`.
 *
 * @returns `null` if the value is empty or invalid.
 */
export const parseDatetime = (value: string): Date | null => {
    const index = value.search(/[T ]/u);

    if (index < 0) {
        return null;
    }

    return parseDateAndTime(value.slice(0, index), value.slice(index + 1));
};

/**
 * Formats a time zone offset in minutes to the `±HH:mm` format. The offset has the same sign as the
 * result of `Date.prototype.getTimezoneOffset`, so `-480` (UTC+8) becomes `+08:00`.
 */
export const formatTimezoneOffset = (offset: number): string => {
    const sign = offset <= 0 ? "+" : "-";
    const minutes = Math.abs(offset);

    return `${sign}${pad(Math.trunc(minutes / 60), 2)}:${pad(Math.trunc(minutes % 60), 2)}`;
};

// Years outside 0 to 9999 need the expanded format, such as `+012345`, so that `new Date(string)` can parse them.
const formatISOYear = (year: number): string => {
    if (year >= 0 && year <= 9999) {
        return pad(year, 4);
    }

    return `${year < 0 ? "-" : "+"}${pad(Math.abs(year), 6)}`;
};

/**
 * Formats a date to an ISO 8601 (RFC 3339) string in local time with the time zone offset, such as
 * `2000-01-01T00:00:00.000+08:00`. Unlike `Date.prototype.toISOString`, it does not convert the
 * date to UTC. The result can be parsed back by `new Date(string)`.
 *
 * @returns An empty string if the date is invalid.
 */
export const formatLocalISOString = (
    date: Date | number,
    options: FormatLocalISOStringOptions = {},
): string => {
    const validDate = toValidDate(date);

    if (validDate === null) {
        return "";
    }

    const parts = getLocalParts(validDate);
    const datePart = `${formatISOYear(parts.year)}-${pad(parts.month, 2)}-${pad(parts.day, 2)}`;
    const timePart = formatTimeParts(parts, options.precision ?? "millisecond");

    return `${datePart}T${timePart}${formatTimezoneOffset(validDate.getTimezoneOffset())}`;
};
