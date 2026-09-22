import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    formatDate,
    formatDatetime,
    formatLocalISOString,
    formatTime,
    formatTimezoneOffset,
    parseDate,
    parseDateAndTime,
    parseDatetime,
    parseTime,
} from "../src/index.ts";

describe("formatDate", () => {
    it("formats a date", () => {
        assert.equal(formatDate(new Date(2000, 1 - 1, 2, 13, 30)), "2000-01-02");
        assert.equal(formatDate(new Date(2000, 1 - 1, 2).getTime()), "2000-01-02");
    });

    it("returns an empty string for an invalid date", () => {
        assert.equal(formatDate(Number.NaN), "");
    });
});

describe("formatTime", () => {
    it("omits zero seconds and milliseconds", () => {
        assert.equal(formatTime(new Date(2000, 1 - 1, 1, 13, 30)), "13:30");
        assert.equal(formatTime(new Date(2000, 1 - 1, 1, 13, 30, 5)), "13:30:05");
        assert.equal(formatTime(new Date(2000, 1 - 1, 1, 13, 30, 0, 50)), "13:30:00.050");
    });

    it("uses the given precision", () => {
        const date = new Date(2000, 1 - 1, 1, 13, 30, 5, 50);

        assert.equal(formatTime(date, { precision: "minute" }), "13:30");
        assert.equal(formatTime(date, { precision: "second" }), "13:30:05");
        assert.equal(
            formatTime(new Date(2000, 1 - 1, 1, 13, 30), { precision: "millisecond" }),
            "13:30:00.000",
        );
    });
});

describe("formatDatetime", () => {
    it("formats a datetime", () => {
        assert.equal(formatDatetime(new Date(2000, 1 - 1, 2, 13, 30)), "2000-01-02T13:30");
    });

    it("uses the given separator and precision", () => {
        assert.equal(
            formatDatetime(new Date(2000, 1 - 1, 2, 13, 30), {
                separator: " ",
                precision: "second",
            }),
            "2000-01-02 13:30:00",
        );
    });
});

describe("parseDate", () => {
    it("parses a date at midnight", () => {
        assert.deepEqual(parseDate("2000-01-02"), new Date(2000, 1 - 1, 2));
    });

    it("parses a year after 9999", () => {
        assert.equal(parseDate("12345-01-02")?.getFullYear(), 12345);
    });

    it("returns null for an empty or invalid value", () => {
        assert.equal(parseDate(""), null);
        assert.equal(parseDate("2000-02-30"), null);
    });
});

describe("parseTime", () => {
    it("parses a time on 1970-01-01", () => {
        assert.deepEqual(parseTime("13:30"), new Date(1970, 1 - 1, 1, 13, 30));
        assert.deepEqual(parseTime("13:30:05.5"), new Date(1970, 1 - 1, 1, 13, 30, 5, 500));
    });
});

describe("parseDatetime", () => {
    it("parses a datetime", () => {
        assert.deepEqual(parseDatetime("2000-01-02T13:30"), new Date(2000, 1 - 1, 2, 13, 30));
        assert.deepEqual(parseDatetime("2000-01-02 13:30:05"), new Date(2000, 1 - 1, 2, 13, 30, 5));
    });

    it("returns null for a value with a time zone", () => {
        assert.equal(parseDatetime("2000-01-02T13:30Z"), null);
    });
});

describe("parseDateAndTime", () => {
    it("combines a date and a time", () => {
        assert.deepEqual(parseDateAndTime("2000-01-02", "13:30"), new Date(2000, 1 - 1, 2, 13, 30));
    });
});

describe("formatTimezoneOffset", () => {
    it("formats an offset", () => {
        assert.equal(formatTimezoneOffset(-480), "+08:00");
        assert.equal(formatTimezoneOffset(330), "-05:30");
        assert.equal(formatTimezoneOffset(0), "+00:00");
    });
});

describe("formatLocalISOString", () => {
    it("formats a date which can be parsed back", () => {
        const date = new Date(2000, 1 - 1, 2, 13, 30, 5, 50);
        const s = formatLocalISOString(date);

        assert.match(s, /^2000-01-02T13:30:05\.050[+-]\d{2}:\d{2}$/u);
        assert.deepEqual(new Date(s), date);
    });

    it("omits milliseconds when the precision is second", () => {
        assert.match(
            formatLocalISOString(new Date(2000, 1 - 1, 2, 13, 30, 5, 50), { precision: "second" }),
            /^2000-01-02T13:30:05[+-]\d{2}:\d{2}$/u,
        );
    });

    it("uses the expanded year format after 9999", () => {
        const date = new Date(0);

        date.setFullYear(12345, 1 - 1, 2);

        const s = formatLocalISOString(date);

        assert.ok(s.startsWith("+012345-01-02T"));
        assert.deepEqual(new Date(s), date);
    });
});
