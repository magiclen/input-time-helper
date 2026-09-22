import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
    formatDateToDateString,
    formatDateToDatetimeString,
    formatDateToLocalISOString,
    formatDateToTimeString,
    parseDateAndTimeStringToDate,
    parseDateStringToDate,
    parseDatetimeStringToDate,
} from "../src/index.ts";

describe("formatDateToDateString", () => {
    it("ok", () => {
        assert.equal(formatDateToDateString(new Date(2000, 1 - 1, 1)), "2000-01-01");
    });
});

describe("formatDateToTimeString", () => {
    it("ok", () => {
        assert.equal(formatDateToTimeString(new Date(2000, 1 - 1, 1, 1)), "01:00");
    });
});

describe("formatDateToDatetimeString", () => {
    it("ok", () => {
        assert.equal(formatDateToDatetimeString(new Date(2000, 1 - 1, 1)), "2000-01-01T00:00");
    });
});

describe("parseDateStringToDate", () => {
    it("ok", () => {
        assert.deepEqual(parseDateStringToDate("2000-01-01"), new Date(2000, 1 - 1, 1));
    });
});

describe("parseDateAndTimeStringToDate", () => {
    it("ok", () => {
        assert.deepEqual(
            parseDateAndTimeStringToDate("2000-01-01", "01:00"),
            new Date(2000, 1 - 1, 1, 1),
        );
    });
});

describe("parseDatetimeStringToDate", () => {
    it("ok", () => {
        assert.deepEqual(parseDatetimeStringToDate("2000-01-01T00:00"), new Date(2000, 1 - 1, 1));
    });
});

describe("toLocalISOString", () => {
    it("ok", () => {
        const date = new Date();

        assert.deepEqual(new Date(formatDateToLocalISOString(date)), date);
    });
});
