const getDateFromTimestamp = (date: number | Date): Date => {
    if (date instanceof Date) {
        return date;
    }

    return new Date(date);
};

const addLeadingZeros = (n: number, maxLength: number): string => n.toString().padStart(maxLength, "0");

/**
 * A date string can be used for the attrubutes of an `input[type="date"]` element such as `value`, `min`, `max`.
 */
export const formatDateToDateString = (timestamp: number | Date): string => {
    const date = getDateFromTimestamp(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const y = addLeadingZeros(date.getFullYear(), 4);
    const m = addLeadingZeros(date.getMonth() + 1, 2);
    const d = addLeadingZeros(date.getDate(), 2);

    return `${y}-${m}-${d}`;
};

/**
 * A date string can be fetched from the attrubutes of an `input[type="date"]` element such as `value`, `min`, `max`.
 */
export const parseDateStringToDate = (dateString: string): Date => new Date(`${dateString}T00:00`);

/**
 * A time string can be used for the attrubutes of an `input[type="time"]` element such as `value`, `min`, `max`.
 */
export const formatDateToTimeString = (timestamp: number | Date): string => {
    const date = getDateFromTimestamp(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const h = addLeadingZeros(date.getHours(), 2);
    const min = addLeadingZeros(date.getMinutes(), 2);

    let out = `${h}:${min}`;

    const s = date.getSeconds();
    const ms = date.getMilliseconds();

    if (ms > 0 || s > 0) {
        out += `:${addLeadingZeros(s, 2)}`;

        if (ms > 0) {
            out += `.${addLeadingZeros(ms, 3)}`;
        }
    }

    return out;
};

/**
 * A date string can be fetched from the attrubutes of an `input[type="date"]` element such as `value`, `min`, `max`. A time string can be fetched from the attrubutes of an `input[type="time"]` element such as `value`, `min`, `max`.
 */
export const parseDateAndTimeStringToDate = (
    dateString: string,
    timeString: string,
): Date => new Date(`${dateString}T${timeString}`);

/**
 * A datetime string can be used for the attrubutes of an `input[type="datetime-local"]` element such as `value`, `min`, `max`. The `splitter` parameter can be set to `" "` (a space) in order to format the datetime string for RDBMS SQL statements.
 */
export const formatDateToDatetimeString = (
    timestamp: number | Date,
    splitter: "T" | " " = "T",
): string => {
    const date = getDateFromTimestamp(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    const y = addLeadingZeros(date.getFullYear(), 4);
    const m = addLeadingZeros(date.getMonth() + 1, 2);
    const d = addLeadingZeros(date.getDate(), 2);
    const h = addLeadingZeros(date.getHours(), 2);
    const min = addLeadingZeros(date.getMinutes(), 2);

    let out = `${y}-${m}-${d}${splitter}${h}:${min}`;

    const s = date.getSeconds();
    const ms = date.getMilliseconds();

    if (ms > 0 || s > 0) {
        out += `:${addLeadingZeros(s, 2)}`;

        if (ms > 0) {
            out += `.${addLeadingZeros(ms, 3)}`;
        }
    }

    return out;
};

/**
 * A datetime string can be fetched from the attrubutes of an `input[type="datetime-local"]` element such as `value`, `min`, `max`.
 */
export const parseDatetimeStringToDate = (datetimeString: string): Date => new Date(datetimeString);

export interface ToLocalISOStringOptions {
    /**
     * Whether to ignore milliseconds.
     *
     * @default false
     */
    ignoreMilliseconds?: boolean;
}

/**
 * Formats the difference in minutes between Universal Coordinated Time (UTC) and the time on the local computer to the `[+-]HH:mm` format.
 */
export const formatTimezoneOffsetToString = (timezoneOffset: number): string => {
    let out = "";

    if (timezoneOffset <= 0) {
        timezoneOffset = -timezoneOffset;
        out += "+";
    } else {
        out += "-";
    }

    const tzM = addLeadingZeros(Math.trunc(timezoneOffset / 60), 2);
    const tzS = addLeadingZeros(Math.trunc(timezoneOffset % 60), 2);

    out += `${tzM}:${tzS}`;

    return out;
};

/**
 * Returns a date as a string value in ISO format (RFC3339) with the local time zone.
 *
 * @throws {RangeError} Invalid time value
 */
export const toLocalISOString = (
    date: Date,
    options: ToLocalISOStringOptions = {},
): string => {
    if (Number.isNaN(date.getTime())) {
        throw new RangeError("Invalid time value");
    }

    const y = addLeadingZeros(date.getFullYear(), 4);
    const m = addLeadingZeros(date.getMonth() + 1, 2);
    const d = addLeadingZeros(date.getDate(), 2);
    const h = addLeadingZeros(date.getHours(), 2);
    const min = addLeadingZeros(date.getMinutes(), 2);
    const s = addLeadingZeros(date.getSeconds(), 2);

    let out = `${y}-${m}-${d}T${h}:${min}:${s}`;

    if (options.ignoreMilliseconds !== true) {
        const ms = date.getMilliseconds();

        out += `.${addLeadingZeros(ms, 3)}`;
    }

    out += formatTimezoneOffsetToString(date.getTimezoneOffset());

    return out;
};

/**
 * A date string can be used for `new Date(string)`. It uses the local time zone instead of UTC.
 */
export const formatDateToLocalISOString = (
    timestamp: number | Date,
    options: ToLocalISOStringOptions = {},
): string => {
    const date = getDateFromTimestamp(timestamp);

    try {
        return toLocalISOString(date, options);
    } catch (_error) {
        return "";
    }
};
