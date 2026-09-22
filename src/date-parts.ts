/** The smallest time unit to include when formatting a time. */
export type TimePrecision = "minute" | "second" | "millisecond";

/** The fields of a date and time without a time zone. `month` is from 1 to 12. */
export interface DateParts {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
}

export const pad = (n: number, length: number): string => n.toString().padStart(length, "0");

/** Returns `null` if the date or the timestamp is invalid. */
export const toValidDate = (date: Date | number): Date | null => {
    const d = date instanceof Date ? date : new Date(date);

    return Number.isNaN(d.getTime()) ? null : d;
};

export const getLocalParts = (date: Date): DateParts => ({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: date.getMilliseconds(),
});

/** Treats the parts as UTC, so calculations on the result are not affected by time zone offsets. */
export const partsToUTCTimestamp = (parts: DateParts): number => {
    const date = new Date(0);

    // `Date.UTC` maps years 0 to 99 to 1900 to 1999, but `setUTCFullYear` does not.
    date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
    date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);

    return date.getTime();
};

export const utcTimestampToParts = (timestamp: number): DateParts => {
    const date = new Date(timestamp);

    return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        day: date.getUTCDate(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds(),
    };
};

/** Creates a date in local time. Returns `null` if the parts are out of range, such as February 30. */
export const createLocalDate = (parts: DateParts): Date | null => {
    if (parts.year < 1 || parts.hour > 23 || parts.minute > 59 || parts.second > 59) {
        return null;
    }

    const date = new Date(0);

    // `new Date(year, ...)` maps years 0 to 99 to 1900 to 1999, but `setFullYear` does not.
    date.setFullYear(parts.year, parts.month - 1, parts.day);
    date.setHours(parts.hour, parts.minute, parts.second, parts.millisecond);

    // An invalid month or day overflows to another date.
    if (
        date.getFullYear() !== parts.year ||
        date.getMonth() !== parts.month - 1 ||
        date.getDate() !== parts.day
    ) {
        return null;
    }

    return date;
};

/** Returns an empty string if the year is less than 1, which HTML does not allow. */
export const formatDateParts = (parts: DateParts): string => {
    if (parts.year < 1) {
        return "";
    }

    return `${pad(parts.year, 4)}-${pad(parts.month, 2)}-${pad(parts.day, 2)}`;
};

const getAutoPrecision = (parts: DateParts): TimePrecision => {
    if (parts.millisecond > 0) {
        return "millisecond";
    }

    if (parts.second > 0) {
        return "second";
    }

    return "minute";
};

/** If `precision` is not set, seconds and milliseconds are only included when they are not zero. */
export const formatTimeParts = (
    parts: DateParts,
    precision: TimePrecision = getAutoPrecision(parts),
): string => {
    let out = `${pad(parts.hour, 2)}:${pad(parts.minute, 2)}`;

    if (precision !== "minute") {
        out += `:${pad(parts.second, 2)}`;

        if (precision === "millisecond") {
            out += `.${pad(parts.millisecond, 3)}`;
        }
    }

    return out;
};

export const formatDatetimeParts = (
    parts: DateParts,
    separator: "T" | " " = "T",
    precision?: TimePrecision,
): string => {
    const date = formatDateParts(parts);

    if (date === "") {
        return "";
    }

    return `${date}${separator}${formatTimeParts(parts, precision)}`;
};
