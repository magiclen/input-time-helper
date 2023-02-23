const SECOND_IN_MILLISECONDS = 1000;
const MINUTE_IN_MILLISECONDS = 60 * SECOND_IN_MILLISECONDS;

const utcTimestampToLocalTimestamp = (timestamp: number): number => {
    // eslint-disable-next-line no-extra-parens
    return timestamp + (new Date().getTimezoneOffset() * MINUTE_IN_MILLISECONDS);
};

const localTimestampToUtcTimestamp = (timestamp: number): number => {
    // eslint-disable-next-line no-extra-parens
    return timestamp - (new Date().getTimezoneOffset() * MINUTE_IN_MILLISECONDS);
};

const getTimestampFromDate = (date: number | Date): number => {
    if (date instanceof Date) {
        return date.getTime();
    }

    return date;
};

/**
 * The value can be used for the step attrbute of a time-based element.
 */
export enum TimeUnit {
    Minute = 60,
    Second = 1,
    Millisecond = 0.1
}

/**
 * @param element the input type should be `date` or `datetime-local`
 */
export const getTimestamp = (element: HTMLInputElement): number => {
    const timestamp = element.valueAsNumber;

    if (Number.isNaN(timestamp)) {
        return NaN;
    }

    return utcTimestampToLocalTimestamp(timestamp);
};

/**
 * @param element the input type should be `date`
 */
export const setTimestampDate = (element: HTMLInputElement, timestamp: number | Date) => {
    const t = getTimestampFromDate(timestamp);

    if (Number.isNaN(t)) {
        element.valueAsNumber = NaN;
        return;
    }

    element.valueAsNumber = localTimestampToUtcTimestamp(t);
};

/**
 * @param element the input type should be `datetime-local`
 */
export const setTimestampDateTime = (element: HTMLInputElement, timestamp: number | Date) => {
    let t = getTimestampFromDate(timestamp);

    if (Number.isNaN(t)) {
        element.valueAsNumber = NaN;
        return;
    }

    const step = parseInt(element.step);

    if (!Number.isNaN(step)) {
        if (step >= TimeUnit.Minute) {
            t = Math.trunc(t / MINUTE_IN_MILLISECONDS) * MINUTE_IN_MILLISECONDS;
        } else if (step >= TimeUnit.Second) {
            t = Math.trunc(t / SECOND_IN_MILLISECONDS) * SECOND_IN_MILLISECONDS;
        }
    }
    
    element.valueAsNumber = localTimestampToUtcTimestamp(t);
};
