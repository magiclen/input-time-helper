import {
    formatDateToDateString,
    formatDateToDatetimeString,
    formatDateToLocalISOString,
    formatDateToTimeString,
    parseDateAndTimeStringToDate,
    parseDateStringToDate,
    parseDatetimeStringToDate,
} from "../src/lib.js";

describe("formatDateToDateString", () => {
    it("ok", () => {
        expect(formatDateToDateString(new Date(2000, 1 - 1, 1))).toBe("2000-01-01");
    });
});

describe("formatDateToTimeString", () => {
    it("ok", () => {
        expect(formatDateToTimeString(new Date(2000, 1 - 1, 1, 1))).toBe("01:00");
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

describe("parseDateAndTimeStringToDate", () => {
    it("ok", () => {
        expect(parseDateAndTimeStringToDate("2000-01-01", "01:00")).toEqual(new Date(2000, 1 - 1, 1, 1));
    });
});

describe("parseDatetimeStringToDate", () => {
    it("ok", () => {
        expect(parseDatetimeStringToDate("2000-01-01T00:00")).toEqual(new Date(2000, 1 - 1, 1));
    });
});

describe("toLocalISOString", () => {
    it("ok", () => {
        const date = new Date();

        expect(new Date(formatDateToLocalISOString(date))).toEqual(date);
    });
});
