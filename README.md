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

```typescript
import {
    formatDateToDateString,
    formatDateToDatetimeString,
    formatDateToLocalISOString,
    parseDateStringToDate,
    parseDatetimeStringToDate,

    getTimestamp,
    setTimestampDate,
    setTimestampDateTime,
} from "input-time-helper";

console.log(formatDateToDateString(new Date(2000, 1 - 1, 1))); // 2000-01-01
console.log(formatDateToDatetimeString(new Date(2000, 1 - 1, 1))); // 2000-01-01T00:00
console.log(formatDateToLocalISOString(new Date(2000, 1 - 1, 1))); // 2000-01-01T00:00+08:00
console.log(parseDateStringToDate("2000-01-01"));
console.log(parseDatetimeStringToDate("2000-01-01T00:00"));

const myInputDate = document.getElementById("myInputDate");
const myInputDatetimeLocal = document.getElementById("myInputDatetimeLocal");

console.log(getTimestamp(myInputDate));
console.log(getTimestamp(myInputDatetimeLocal));

setTimestampDate(myInputDate, 946656000000);
setTimestampDateTime(myInputDatetimeLocal, 946656000000);
```

## Usage for Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/input-time-helper/master/demo.html)

## License

[MIT](LICENSE)