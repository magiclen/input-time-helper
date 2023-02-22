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
export const setTimestampDate = (element: HTMLInputElement, timestamp: number) => {
    if (Number.isNaN(timestamp)) {
        element.valueAsNumber = NaN;
        return;
    }

    element.valueAsNumber = localTimestampToUtcTimestamp(timestamp);
};

/**
 * @param element the input type should be `datetime-local`
 */
export const setTimestampDateTime = (element: HTMLInputElement, timestamp: number) => {
    if (Number.isNaN(timestamp)) {
        element.valueAsNumber = NaN;
        return;
    }

    const step = parseInt(element.step);

    if (!Number.isNaN(step)) {
        if (step >= TimeUnit.Minute) {
            timestamp = Math.trunc(timestamp / MINUTE_IN_MILLISECONDS) * MINUTE_IN_MILLISECONDS;
        } else if (step >= TimeUnit.Second) {
            timestamp = Math.trunc(timestamp / SECOND_IN_MILLISECONDS) * SECOND_IN_MILLISECONDS;
        }
    }
    
    element.valueAsNumber = localTimestampToUtcTimestamp(timestamp);
};
