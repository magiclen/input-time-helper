import {
    formatDatetimeParts,
    formatTimeParts,
    getLocalParts,
    partsToUTCTimestamp,
    toValidDate,
    utcTimestampToParts,
} from "./date-parts.ts";
import { formatDate, parseDate, parseDatetime, parseTime } from "./string.ts";

/**
 * The properties of an `input` element used by `getValueAsLocalDate` and `setValueAsLocalDate`. An
 * `HTMLInputElement` can be passed directly.
 */
export type TimeInputElement = Pick<HTMLInputElement, "type" | "value" | "step">;

/**
 * Common values in seconds for the `step` attribute of an `input[type="time"]` or
 * `input[type="datetime-local"]` element.
 */
export const TimeUnit = {
    Minute: 60,
    Second: 1,
    Millisecond: 0.001,
} as const;

/** A value of `TimeUnit`. */
export type TimeUnit = (typeof TimeUnit)[keyof typeof TimeUnit];

// The default step of `time` and `datetime-local` is 60 seconds.
const DEFAULT_STEP_MILLISECONDS = 60_000;

/** Returns `null` if the value should not be rounded. */
const getStepMilliseconds = (step: string): number | null => {
    if (step.toLowerCase() === "any") {
        return null;
    }

    const seconds = Number(step);

    // An empty, zero, negative or invalid step falls back to the default step.
    if (!(seconds > 0)) {
        return DEFAULT_STEP_MILLISECONDS;
    }

    return Math.max(1, Math.round(seconds * 1000));
};

const createUnsupportedTypeError = (type: string): TypeError =>
    new TypeError(
        `The type of the input element must be "date", "time" or "datetime-local", but it is "${type}".`,
    );

const formatSteppedValue = (
    type: "time" | "datetime-local",
    date: Date | number,
    step: string,
): string => {
    const validDate = toValidDate(date);

    if (validDate === null) {
        return "";
    }

    let parts = getLocalParts(validDate);

    // The step base of `time` is midnight, so only the time of the day matters.
    if (type === "time") {
        parts = { ...parts, year: 1970, month: 1, day: 1 };
    }

    const stepMilliseconds = getStepMilliseconds(step);

    if (stepMilliseconds !== null) {
        const timestamp = partsToUTCTimestamp(parts);

        parts = utcTimestampToParts(Math.floor(timestamp / stepMilliseconds) * stepMilliseconds);
    }

    return type === "time" ? formatTimeParts(parts) : formatDatetimeParts(parts);
};

/**
 * Gets the value of an `input[type="date"]`, `input[type="time"]` or `input[type="datetime-local"]`
 * element as a date in local time. For `date`, the time is midnight. For `time`, the date part is
 * 1970-01-01.
 *
 * @returns `null` if the value is empty or invalid.
 * @throws {TypeError} If the type of the element is not supported.
 */
export const getValueAsLocalDate = (element: TimeInputElement): Date | null => {
    const { type, value } = element;

    switch (type) {
        case "date":
            return parseDate(value);
        case "time":
            return parseTime(value);
        case "datetime-local":
            return parseDatetime(value);
        default:
            throw createUnsupportedTypeError(type);
    }
};

/**
 * Sets the value of an `input[type="date"]`, `input[type="time"]` or `input[type="datetime-local"]`
 * element to a date in local time. For `time` and `datetime-local`, the time is rounded down to a
 * multiple of the `step` attribute (60 seconds by default), so that the value does not cause a step
 * mismatch. The `min` attribute is not used as the base of the step. If `date` is `null` or
 * invalid, the value is cleared.
 *
 * @throws {TypeError} If the type of the element is not supported.
 */
export const setValueAsLocalDate = (
    element: TimeInputElement,
    date: Date | number | null,
): void => {
    const { type } = element;

    switch (type) {
        case "date":
            element.value = date === null ? "" : formatDate(date);
            break;
        case "time":
        case "datetime-local":
            element.value = date === null ? "" : formatSteppedValue(type, date, element.step);
            break;
        default:
            throw createUnsupportedTypeError(type);
    }
};
