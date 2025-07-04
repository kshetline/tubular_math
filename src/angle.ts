import { abs, floor, mod, mod2, pow, round } from './math';

export enum Unit { RADIANS, DEGREES, ARC_MINUTES, ARC_SECONDS, HOURS, HOUR_ANGLE_MINUTES, HOUR_ANGLE_SECONDS, ROTATIONS, GRADS }
export enum Mode { RANGE_LIMIT_SIGNED, RANGE_LIMIT_NONNEGATIVE, RANGE_UNLIMITED }

const PI = Math.PI;
const HALF_PI = PI / 2;
const TWO_PI = PI * 2;

export const FMT_DD = 0x01;
export const FMT_HH = 0x01;
export const FMT_DDD = 0x02;
export const FMT_MINS = 0x04;
export const FMT_SECS = 0x08;
export const FMT_SIGNED = 0x10;

export function convertToRadians(angle: number, unit: Unit): number {
  switch (unit) {
    case Unit.RADIANS:
      return angle;
    case Unit.DEGREES:
      return angle / 180 * PI;
    case Unit.ARC_MINUTES:
      return angle / 10800 * PI;
    case Unit.ARC_SECONDS:
      return angle / 648000 * PI;
    case Unit.HOURS:
      return angle / 12 * PI;
    case Unit.HOUR_ANGLE_MINUTES:
      return angle / 720 * PI;
    case Unit.HOUR_ANGLE_SECONDS:
      return angle / 43200 * PI;
    case Unit.ROTATIONS:
      return angle * TWO_PI;
    case Unit.GRADS:
      return angle / 200 * PI;
  }

  return NaN;
}

export function convertFromRadians(angle: number, unit: Unit): number {
  switch (unit) {
    case Unit.RADIANS:
      return angle;
    case Unit.DEGREES:
      return angle * 180 / PI;
    case Unit.ARC_MINUTES:
      return angle * 10800 / PI;
    case Unit.ARC_SECONDS:
      return angle * 648000 / PI;
    case Unit.HOURS:
      return angle * 12 / PI;
    case Unit.HOUR_ANGLE_MINUTES:
      return angle * 720 / PI;
    case Unit.HOUR_ANGLE_SECONDS:
      return angle * 43200 / PI;
    case Unit.ROTATIONS:
      return angle / TWO_PI;
    case Unit.GRADS:
      return angle * 200 / PI;
  }

  return NaN;
}

export class Angle {
  static ZERO = new Angle(0);
  static RIGHT = new Angle(HALF_PI);
  static STRAIGHT = new Angle(PI);

  private readonly angle: number; // In radians
  private cached_sin = 2;
  private cached_cos = 2;
  private cached_tan = 0;

  static asin(x: number): Angle {
    return new Angle(Math.asin(x));
  }

  static asin_nonneg(x: number): Angle {
    return new Angle(Math.asin(x), Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  static acos(x: number): Angle {
    return new Angle(Math.acos(x));
  }

  static atan(x: number): Angle {
    return new Angle(Math.atan(x));
  }

  static atan_nonneg(x: number): Angle {
    return new Angle(Math.atan(x), Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  static atan2(y: number, x: number): Angle {
    return new Angle(Math.atan2(y, x));
  }

  static atan2_nonneg(y: number, x: number): Angle {
    return new Angle(Math.atan2(y, x), Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  static parse(s: string, throwException = false): Angle {
    const result = Angle.#parseAux(s);

    if (result == null && throwException)
      throw new Error('Invalid angle: ' + s);
    else
      return result;
  }

  static #parseAux(s: string): Angle {
    const parts = (s || '').split(/([-+hms'"’”°:new])/i);
    let sign = 1;
    let unit = Unit.DEGREES;

    if (!parts[0] && (parts[1] === '+' || parts[1] === '-')) {
      if (parts[1] === '-')
        sign = -1;

      parts.splice(0, 2);
    }

    const nums = parts.filter((p, i) => i % 2 === 0).map(p => parseFloat(p.trim()));
    const delimiters = parts.filter((p, i) => i % 2 === 1).map(p => p.trim().toLowerCase());

    if (nums.length > 1 && isNaN(nums.at(-1)))
      nums.splice(nums.length - 1, 1);

    if (nums.findIndex(n => isNaN(n)) >= 0)
      return null;

    if (delimiters.find(d => d === 'h' || d === 'm' || d === ':'))
      unit = Unit.HOURS;
    else if (delimiters.at(-1) === 's')
      sign *= -1;

    return new Angle(sign * (nums[0] + (nums[1] || 0) / 60 + (nums[2] || 0) / 3600), unit, Mode.RANGE_UNLIMITED);
  }

  constructor(angle = 0, unit?: Unit, mode = Mode.RANGE_LIMIT_SIGNED) {
    if (unit === undefined)
      unit = Unit.RADIANS;

    if (angle === 0 && Angle.ZERO)
      return Angle.ZERO;

    if (mode === Mode.RANGE_LIMIT_SIGNED)
      this.angle = mod2(convertToRadians(angle, unit), TWO_PI);
    else if (mode === Mode.RANGE_LIMIT_NONNEGATIVE)
      this.angle = mod(convertToRadians(angle, unit), TWO_PI);
    else
      this.angle = convertToRadians(angle, unit);

    if (Angle.RIGHT && this.angle === Angle.RIGHT.angle)
      return Angle.RIGHT;
    else if (Angle.STRAIGHT && this.angle === Angle.STRAIGHT.angle)
      return Angle.STRAIGHT;
  }

  get radians(): number {
    return this.angle;
  }

  get degrees(): number {
    return convertFromRadians(this.angle, Unit.DEGREES);
  }

  get arcMinutes(): number {
    return convertFromRadians(this.angle, Unit.ARC_MINUTES);
  }

  get arcSeconds(): number {
    return convertFromRadians(this.angle, Unit.ARC_SECONDS);
  }

  get hours(): number {
    return convertFromRadians(this.angle, Unit.HOURS);
  }

  get rotations(): number {
    return convertFromRadians(this.angle, Unit.ROTATIONS);
  }

  get grads(): number {
    return convertFromRadians(this.angle, Unit.GRADS);
  }

  getAngle(unit = Unit.RADIANS): number {
    return convertFromRadians(this.angle, unit);
  }

  get sin(): number {
    if (this.cached_sin > 1)
      this.cached_sin = Math.sin(this.angle);

    return this.cached_sin;
  }

  get cos(): number {
    if (this.cached_cos > 1)
      this.cached_cos = Math.cos(this.angle);

    return this.cached_cos;
  }

  get tan(): number {
    if (this.angle === 0)
      return 0;
    else if (this.cached_tan === 0)
      this.cached_tan = Math.tan(this.angle);

    return this.cached_tan;
  }

  add(angle2: Angle, mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(this.angle + angle2.angle, Unit.RADIANS, mode);
  }

  add_nonneg(angle2: Angle): Angle {
    return new Angle(this.angle + angle2.angle, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  subtract(angle2: Angle, mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(this.angle - angle2.angle, Unit.RADIANS, mode);
  }

  subtract_nonneg(angle2: Angle): Angle {
    return new Angle(this.angle - angle2.angle, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  complement(mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(HALF_PI - this.angle, Unit.RADIANS, mode);
  }

  complement_nonneg(): Angle {
    return new Angle(HALF_PI - this.angle, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  supplement(mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(PI - this.angle, Unit.RADIANS, mode);
  }

  supplement_nonneg(): Angle {
    return new Angle(PI - this.angle, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  opposite(mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(this.angle + PI, Unit.RADIANS, mode);
  }

  opposite_nonneg(): Angle {
    return new Angle(this.angle + PI, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  negate(mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(-this.angle, Unit.RADIANS, mode);
  }

  // Sounds contradictory, doesn't it? Return whatever angle is 180 degrees away, as a non-negative value.
  negate_nonneg(): Angle {
    return new Angle(-this.angle, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  multiply(x: number, mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(this.angle * x, Unit.RADIANS, mode);
  }

  multiply_nonneg(x: number): Angle {
    return new Angle(this.angle * x, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  divide(x: number, mode = Mode.RANGE_LIMIT_SIGNED): Angle {
    return new Angle(this.angle / x, Unit.RADIANS, mode);
  }

  divide_nonneg(x: number): Angle {
    return new Angle(this.angle / x, Unit.RADIANS, Mode.RANGE_LIMIT_NONNEGATIVE);
  }

  toString(format?: number, precision?: number): string {
    return Angle.toStringAux(this.degrees, '°', '\'', '"', format, precision);
  }

  toSuffixedString(positiveSuffix: string, negativeSuffix: string,
                   format?: number, precision?: number): string {
    format = (format || 0) & ~FMT_SIGNED;

    return Angle.toStringAux(abs(this.degrees), '°', '\'', '"', format, precision) +
           (this.degrees < 0 ? negativeSuffix : positiveSuffix);
  }

  toHourString(format?: number, precision?: number): string {
    format = (format || 0) & ~FMT_DDD;

    return Angle.toStringAux(this.hours, 'h', 'm', 's', format, precision);
  }

  toTimeString(format?: number, precision?: number): string {
    format = (format || 0) & ~FMT_DDD;

    if ((format & FMT_SECS) === 0)
      format |= FMT_MINS;

    return Angle.toStringAux(this.hours, ':', format === FMT_MINS ? '' : ':', '', format, precision, 2);
  }

  private static toStringAux(units: number, delim1: string, delim2: string, delim3: string,
                             format: number, precision: number, unitsPadding = 0): string {
    format = (format || 0);

    const sxg = ((format & (FMT_MINS | FMT_SECS)) !== 0);

    if ((format & FMT_DD) !== 0)
      unitsPadding = 2;
    else if ((format & FMT_DDD) !== 0)
      unitsPadding = 3;

    if (precision == null) {
      if (format != null && sxg)
        precision = 0;
      else
        precision = 3;
    }

    const sign = Math.sign(units);
    units = abs(units);
    let result: string;

    if (sxg) {
      const pwr = pow(10, precision);

      if ((format & FMT_MINS) !== 0) {
        let mins = round(units * 60 * pwr) / pwr;

        units = floor(mins / 60);
        mins = mins % 60;
        result = units + delim1 + (mins < 10 ? '0' : '') + mins.toFixed(precision) + delim2;
      }
      else {
        let secs = round(units * 3600 * pwr) / pwr;
        let mins = floor(secs / 60);

        secs = secs % 60;
        units = floor(mins / 60);
        mins = mins % 60;

        result = units + delim1 + (mins < 10 ? '0' : '') + mins + delim2
                + (secs < 10 ? '0' : '') + secs.toFixed(precision) + delim3;
      }
    }
    else {
      result = units.toFixed(precision) + delim1;
    }

    if (unitsPadding) {
      const match = /^(\d+)\D/.exec(result);
      const padding = unitsPadding - match[1].length;

      for (let i = 0; i < padding; ++i)
        result = '0' + result;
    }

    if (sign < 0)
      result = '-' + result;
    else if ((format & FMT_SIGNED) !== 0)
      result = '+' + result;

    return result;
  }
}
