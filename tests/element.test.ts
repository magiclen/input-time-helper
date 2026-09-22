import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { TimeInputElement } from "../src/index.ts";
import { getValueAsLocalDate, setValueAsLocalDate } from "../src/index.ts";

// Use a time zone with DST to make sure that the offset of the current date is not used for other dates.
process.env.TZ = "America/New_York";

// Some platforms may not support changing the time zone at runtime.
const isTimeZoneApplied =
    new Date(2026, 1 - 1, 15).getTimezoneOffset() === 300 &&
    new Date(2026, 7 - 1, 15).getTimezoneOffset() === 240;

const createElement = (type: string, value = "", step = ""): TimeInputElement => ({
    type,
    value,
    step,
});

describe("getValueAsLocalDate", () => {
    it("gets the value of a date input", () => {
        assert.deepEqual(
            getValueAsLocalDate(createElement("date", "2026-01-15")),
            new Date(2026, 1 - 1, 15),
        );
    });

    it("gets the value of a time input", () => {
        assert.deepEqual(
            getValueAsLocalDate(createElement("time", "13:30:05")),
            new Date(1970, 1 - 1, 1, 13, 30, 5),
        );
    });

    it("gets the value of a datetime-local input", () => {
        assert.deepEqual(
            getValueAsLocalDate(createElement("datetime-local", "2026-07-15T13:30")),
            new Date(2026, 7 - 1, 15, 13, 30),
        );
    });

    it("returns null for an empty value", () => {
        assert.equal(getValueAsLocalDate(createElement("date")), null);
    });

    it("throws for an unsupported type", () => {
        assert.throws(() => getValueAsLocalDate(createElement("month", "2026-01")), TypeError);
    });
});

describe("setValueAsLocalDate", () => {
    it("sets the value of a date input", () => {
        const element = createElement("date");

        setValueAsLocalDate(element, new Date(2026, 1 - 1, 15, 13, 30));
        assert.equal(element.value, "2026-01-15");

        setValueAsLocalDate(element, new Date(2026, 7 - 1, 15).getTime());
        assert.equal(element.value, "2026-07-15");
    });

    it("rounds down to the default step of 60 seconds", () => {
        const element = createElement("datetime-local");

        setValueAsLocalDate(element, new Date(2026, 1 - 1, 15, 13, 30, 5, 50));
        assert.equal(element.value, "2026-01-15T13:30");
    });

    it("rounds down to the step attribute", () => {
        const time = createElement("time", "", "1");

        setValueAsLocalDate(time, new Date(2026, 1 - 1, 15, 13, 30, 5, 50));
        assert.equal(time.value, "13:30:05");

        const datetime = createElement("datetime-local", "", "300");

        setValueAsLocalDate(datetime, new Date(2026, 1 - 1, 15, 13, 34));
        assert.equal(datetime.value, "2026-01-15T13:30");
    });

    it("keeps milliseconds when the step is any", () => {
        const element = createElement("time", "", "any");

        setValueAsLocalDate(element, new Date(2026, 1 - 1, 15, 13, 30, 5, 50));
        assert.equal(element.value, "13:30:05.050");
    });

    it("clears the value with null", () => {
        const element = createElement("date", "2026-01-15");

        setValueAsLocalDate(element, null);
        assert.equal(element.value, "");
    });
});

describe(
    "time zone with DST",
    { skip: isTimeZoneApplied ? false : "changing the time zone at runtime is not supported" },
    () => {
        it("keeps the date in winter and summer", () => {
            for (const value of ["2026-01-15", "2026-07-15"]) {
                const element = createElement("date", value);
                const date = getValueAsLocalDate(element);

                assert.equal(date?.getDate(), 15);

                setValueAsLocalDate(element, date);
                assert.equal(element.value, value);
            }
        });

        it("keeps the datetime in winter and summer", () => {
            for (const value of ["2026-01-15T00:30", "2026-07-15T00:30"]) {
                const element = createElement("datetime-local", value);

                setValueAsLocalDate(element, getValueAsLocalDate(element));
                assert.equal(element.value, value);
            }
        });
    },
);
