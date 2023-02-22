input-time-helper
==========

[![CI](https://github.com/magiclen/input-time-helper/actions/workflows/ci.yml/badge.svg)](https://github.com/magiclen/input-time-helper/actions/workflows/ci.yml)

Intuitively (by using local time) get/set the value of a date- or time-based HTML input element.

## Motives

By default, the value of a date- or time-based HTML input element is in UTC, which is confusing.

For example, an user lives in an area where the timezone is GMT-8, and he/she fills in an `input[type="date"]` element with `2010-01-11`. However, the following code shows him/her the date is `2010-01-10`...

```typescript
const element = document.querySelector("input[type='date']");

const date = element.valueAsDate;
console.log(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
```

## Usage for Browsers

[Source](demo.html)

[Demo Page](https://rawcdn.githack.com/magiclen/input-time-helper/master/demo.html)

## License

[MIT](LICENSE)