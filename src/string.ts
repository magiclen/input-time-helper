const getDateFromTimestamp = (date: number | Date): Date => {
    if (date instanceof Date) {
        return date;
    }

    return new Date(date);
};

const addLeadingZeros = (n: number, maxLength: number): string => {
    return n.toString().padStart(maxLength, "0");
};

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
export const parseDateStringToDate = (dateString: string): Date => {
    return new Date(`${dateString}T00:00`);
};

/**
 * A datetime string can be used for the attrubutes of an `input[type="datetime-local"]` element such as `value`, `min`, `max`.
 */
export const formatDateToDatetimeString = (timestamp: number | Date): string => {
    const date = getDateFromTimestamp(timestamp);

    if (Number.isNaN(date.getTime())) {
        return "";
    }
    
    const y = addLeadingZeros(date.getFullYear(), 4);
    const m = addLeadingZeros(date.getMonth() + 1, 2);
    const d = addLeadingZeros(date.getDate(), 2);
    const h = addLeadingZeros(date.getHours(), 2);
    const min = addLeadingZeros(date.getMinutes(), 2);

    let out = `${y}-${m}-${d}T${h}:${min}`;

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
export const parseDatetimeStringToDate = (datetimeString: string): Date => {
    return new Date(datetimeString);
};
