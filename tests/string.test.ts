import {
    formatDateToDateString,
    formatDateToDatetimeString,
    parseDateStringToDate,
    parseDatetimeStringToDate,
} from "../src/lib.js";

describe("formatDateToDateString", () => {
    it("ok", () => {
        expect(formatDateToDateString(new Date(2000, 1 - 1, 1))).toBe("2000-01-01");
    });
});

describe("formatDateToDatetimeString", () => {
    it("ok", () => {
        expect(formatDateToDatetimeString(new Date(2000, 1 - 1, 1))).toBe("2000-01-01T00:00");
    });
});

describe("parseDateStringToDate", () => {
    it("ok", () => {
        expect(parseDateStringToDate("2000-01-01")).toEqual(new Date(2000, 1 - 1, 1));
    });
});

describe("parseDatetimeStringToDate", () => {
    it("ok", () => {
        expect(parseDatetimeStringToDate("2000-01-01T00:00")).toEqual(new Date(2000, 1 - 1, 1));
    });
});
