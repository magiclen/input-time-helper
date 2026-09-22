input-time-helper
==========

[![CI](https://github.com/magiclen/input-time-helper/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/input-time-helper/actions/workflows/ci.yml)

Intuitively (by using local time) get/set the value of a date- or time-based HTML input element.

## Motives

By default, the value of a date- or time-based HTML input element is in UTC, which is confusing.

For example, a user lives in an area where the timezone is GMT-8, and he/she fills in an `input[type="date"]` element with `2010-01-11`. However, the following code shows him/her the date is `2010-01-10`...

```typescript
const element = document.querySelector("input[type='date']");

const date = element.valueAsDate;
console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
```

Moreover, the `value`/`min`/`max` attributes of these kinds of elements are formatted in specific patterns. We need to format our data into strings.

## Usage

### Get and Set the Value of an Input Element

```typescript
import { getValueAsLocalDate, setValueAsLocalDate } from "input-time-helper";

const element = document.querySelector<HTMLInputElement>("input[type='date']")!;

const date = getValueAsLocalDate(element); // a `Date` in local time, or `null` if the input is empty

setValueAsLocalDate(element, new Date(2000, 1 - 1, 1));
setValueAsLocalDate(element, 946656000000); // a timestamp also works
setValueAsLocalDate(element, null); // clears the value
```

`input[type="date"]`, `input[type="time"]`, and `input[type="datetime-local"]` are supported. Other types throw a `TypeError`.

- For `date`, the time of the returned `Date` is midnight.
- For `time`, the date of the returned `Date` is 1970-01-01, the same as `valueAsDate`.
- For `time` and `datetime-local`, `setValueAsLocalDate` rounds the time down to a multiple of the `step` attribute (60 seconds by default), so the value does not cause a step mismatch. Set `step="any"` to keep milliseconds. `TimeUnit` provides common `step` values.

### Format and Parse Strings

```typescript
import {
    formatDate,
    formatDatetime,
    formatTime,
    parseDate,
    parseDateAndTime,
    parseDatetime,
    parseTime,
} from "input-time-helper";

const date = new Date(2000, 1 - 1, 1, 13, 30);

console.log(formatDate(date)); // 2000-01-01
console.log(formatTime(date)); // 13:30
console.log(formatTime(date, { precision: "second" })); // 13:30:00
console.log(formatDatetime(date)); // 2000-01-01T13:30
console.log(formatDatetime(date, { separator: " " })); // 2000-01-01 13:30 (for SQL)

document.querySelector<HTMLInputElement>("input[type='date']")!.min = formatDate(new Date());

console.log(parseDate("2000-01-01")); // 2000-01-01 00:00 in local time
console.log(parseTime("13:30")); // 1970-01-01 13:30 in local time
console.log(parseDatetime("2000-01-01T13:30")); // 2000-01-01 13:30 in local time
console.log(parseDateAndTime("2000-01-01", "13:30")); // 2000-01-01 13:30 in local time
console.log(parseDate("")); // null
```

The format functions accept a `Date` or a timestamp and return an empty string for an invalid date, so their results can be assigned to the `value`, `min`, or `max` attribute directly. The parse functions return `null` for an empty or invalid string.

### Local ISO Strings

```typescript
import { formatLocalISOString, formatTimezoneOffset } from "input-time-helper";

const date = new Date(2000, 1 - 1, 1);

console.log(formatLocalISOString(date)); // 2000-01-01T00:00:00.000+08:00
console.log(formatLocalISOString(date, { precision: "second" })); // 2000-01-01T00:00:00+08:00
console.log(formatTimezoneOffset(date.getTimezoneOffset())); // +08:00
```

Unlike `Date.prototype.toISOString`, `formatLocalISOString` keeps the local time and appends the time zone offset. The result can be parsed back by `new Date(string)`.

## Migrating from 0.4

| 0.4                                                    | 0.5                                                   |
| ------------------------------------------------------ | ----------------------------------------------------- |
| `formatDateToDateString(date)`                         | `formatDate(date)`                                    |
| `formatDateToTimeString(date)`                         | `formatTime(date)`                                    |
| `formatDateToDatetimeString(date, " ")`                | `formatDatetime(date, { separator: " " })`            |
| `parseDateStringToDate(value)`                         | `parseDate(value)`                                    |
| `parseDatetimeStringToDate(value)`                     | `parseDatetime(value)`                                |
| `parseDateAndTimeStringToDate(dateValue, timeValue)`   | `parseDateAndTime(dateValue, timeValue)`              |
| `formatTimezoneOffsetToString(offset)`                 | `formatTimezoneOffset(offset)`                        |
| `formatDateToLocalISOString(date)`                     | `formatLocalISOString(date)`                          |
| `toLocalISOString(date, { ignoreMilliseconds: true })` | `formatLocalISOString(date, { precision: "second" })` |
| `getTimestamp(element)`                                | `getValueAsLocalDate(element)?.getTime()`             |
| `setTimestampDate(element, date)`                      | `setValueAsLocalDate(element, date)`                  |
| `setTimestampDateTime(element, date)`                  | `setValueAsLocalDate(element, date)`                  |

- The parse functions and `getValueAsLocalDate` return `null` instead of an invalid `Date` or `NaN`.
- `formatLocalISOString` returns an empty string for an invalid date, while `toLocalISOString` threw a `RangeError`.
- `TimeUnit` is a plain object instead of an enum, and `TimeUnit.Millisecond` is fixed from `0.1` to `0.001`.
- The time zone offset of the given date is used instead of the current one, so dates across DST changes are no longer shifted by an hour.

## Usage for Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/input-time-helper/master/demo.html)

## License

[MIT](LICENSE)
