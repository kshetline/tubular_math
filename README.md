<!-- omit in toc -->
# @tubular/math

This library provides several useful math utilities as well as pass-through declarations of the standard JavaScript Math library.

These include min-max seeking, zero finding, assistance for integer and modular math, angle calculations, conversions and formatting, and support for working with spherical coordinates.

The chief motivation behind the creation of this library was solving astronomical calculations (as those available via [@tubular/astronomy](https://github.com/kshetline/tubular_astronomy)), but the functionality provided here is applicable to many tasks.

[![npm](https://img.shields.io/npm/v/@tubular/math.svg)](https://www.npmjs.com/package/@tubular/math/) [![Coverage Status](https://coveralls.io/repos/github/kshetline/tubular_math/badge.svg?branch=master)](https://coveralls.io/github/kshetline/tubular_math) [![npm downloads](https://img.shields.io/npm/dm/@tubular/math.svg)](https://npmjs.org/package/@tubular/math/) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@tubular/math)  ![license](https://img.shields.io/badge/licence-mit-informational)

## Installation

### Via npm

`npm install @tubular/math`

`import { cos_deg, interpolate, union, `...`} from '@tubular/math'; // ESM`

...or...

`const { cos_deg, interpolate, union, `...`} = require('@tubular/math'); // CommonJS`

_Documentation examples will assume **@tubular/math** has been imported as above._

### Via `<script>` tag

To remotely download the full code as an ES module:

```html
<script type="module">
  import('https://unpkg.com/@tubular/math/dist/index.min.mjs').then(pkg => {
    const { cos_deg, interpolate, union } = pkg;

    // ...
  });
</script>
```

For the old-fashioned UMD approach:

```html
<script src="https://unpkg.com/@tubular/math/dist/index.min.js"></script>
```

The **@tubular/math** package will be made available via the global variable `tbMath`. Functions, classes, and constants will also be available via this variable, such as `tbMath.cos_deg`, `tbMath.interpolate`, `tbMath.union`, etc.

## Simple pass-through functions and constants from `Math`

`abs`, `acos`, `acosh`, `asin`, `asinh`, `atan`, `atan2`, `atanh`, `cbrt`, `clz32`, `cos`, `cosh`, `E`, `exp`, `expm1`, `fround`, `hypot`, `imul`, `LN10`, `LN2`, `log`, `log10`, `LOG10E`, `log1p`, `log2`, `LOG2E`, `max`, `min`, `PI`, `pow`, `sign`, `sin`, `sinh`, `sqrt`, `SQRT1_2`, `SQRT2`, `tan`, `tanh`, `trunc`

## Additional math functions

```typescript
function acos_deg(x: number): number;
```

Same as `Math.acos`, but returns a result in degrees rather than radians.

```typescript
function acot(x: number): number;
```

Arccotangent (_cot_<sup>‑1</sup>).

```typescript
function acot2(y: number, x: number): number;
```

Two-argument version of arccotangent (_cot_<sup>‑1</sup>), conceptually related to `atan2`.

```typescript
function acot_deg(x: number): number;
```

Arccotangent (_cot_<sup>‑1</sup>), but returns a result in degrees rather than radians.

```typescript
function acot2_deg(y: number, x: number): number;
```

Two-argument version of arccotangent (_cot_<sup>‑1</sup>), conceptually related to `atan2`, returning a result in degrees rather than radians.

```typescript
function asin_deg(x: number): number;
```

Same as `Math.asin`, but returns a result in degrees rather than radians.

```typescript
function atan_deg(x: number): number;
```

Same as `Math.atan`, but returns a result in degrees rather than radians.

```typescript
function ceil(x: number, multiple = 1): number;
```

Same as `Math.ceil` when the second argument is omitted (or equals 1), otherwise rounds `x` upward to the nearest integer multiple of `multiple`.

```typescript
function convertFromRadians(angle: number, unit: Unit): number
```

Converts an angle expressed in radians to an angle expressed in `unit`, where `unit` is one of the following enumerated values:

> `enum Unit { RADIANS, DEGREES, ARC_MINUTES, ARC_SECONDS, HOURS, HOUR_ANGLE_MINUTES, HOUR_ANGLE_SECONDS, ROTATIONS, GRADS }`

```typescript
function convertToRadians(angle: number, unit: Unit): number
```

Converts an angle expressed in `unit` to an angle expressed in radians, where `unit` is one of the above-listed enumerated values, e.g. `Unit.ARC_MINUTES`.


```typescript
function cos_deg(x: number): number;
```

Same as `Math.cos`, but accepts an argument in degrees rather than radians.

```typescript
function div_tt0(x: number, y: number): number;
```

Integer division with “truncation toward zero”, that is, positive results of _x_/_y_ round downward to the nearest integer, and negative results round upward to the nearest integer.

```typescript
function div_rd(x: number, y: number): number;
```

Integer division where the result of _x_/_y_ always rounds downward to the nearest integer.

```typescript
function floor(x: number, multiple = 1): number;
```

Same as `Math.floor` when the second argument is omitted (or equals 1), otherwise rounds `x` downward to the nearest integer multiple of `multiple`.

```typescript
function interpolate(x0: number, x: number, x1: number, y0: number, y1: number): number;
```

Given two points, (_x_<sub>0</sub>, _y_<sub>0</sub>), (_x_<sub>1</sub>, _y_<sub>1</sub>), and a value _x_ such that _x_<sub>0</sub> ≤ _x_ ≤ _x_<sub>1</sub>, this function returns a corresponding _y_ value by simple linear interpolation.

```typescript
function interpolateModular(x0: number, x: number, x1: number, y0: number, y1: number, modulus: number, signedResult = false): number;
```

This function works identically to the `interpolate` function above except that results are pinned within a modular range of [0, _modulus_) when `signedResult` is omitted or `false`, or [‑_modulus_/2, _modulus_/2) if `signedResult` is true.

This is useful for interpolating angular values, not only to pin results to a range such as [0, 360) or [‑180, 180), but when the input values might span across a modular discontinuity.

```typescript
function interpolateTabular(xx: number[], yy: number[], x: number, maxSpan = 0): number;
```

This function finds the value of _y_ for a given value of _x_ by tabular interpolation, using (_x_, _y_) pairs from `xx` and `yy`. `maxSpan` can typically be omitted (or set to 0).

For special cases where there is a possible discontinuity in the source of the tabular values (e.g. some values come from an historical table of past values, whereas others come from a predicative formula for future values), a non-zero `maxSpan` limits the range of tabular values used for the interpolation to tabular value pairs where the _x_ value is in the range [`x - maxSpan`, `x + maxSpan`].

_Note: Using a non-zero `maxSpan` imposes the requirement that the `xx` array be sorted in ascending order, and the `yy` array be sorted so that its values pair correctly with the sorted `xx` values._

What the `maxSpan` limit achieves, in terms of the example cited, is the creation of three separate types of results: results that are based only on historical values, results which are based only on predicative values, and a transitional range of results where the interpolation smoothly blends the two source ranges using weighted averaging.


```typescript
function irandom(maxValue: number): number;
function irandom(lowest: number, highest: number): number;
```

- With one argument, this function returns a random integer in the range [1, maxValue].
- With two arguments, this function returns a random integer in the range [lowest, highest].

```typescript
function limitNeg1to1(x: number): number;
```

Returns the value of _x_ pinned within the range [‑1, 1], a function particularly useful for preventing `NaN` results from `asin` or `acos` when the value of _x_ might overflow this range slightly due to rounding errors.

```typescript
function mod(x: number, y: number): number;
```

This is equivalent to `x % y` except for the function’s behavior with negative argument values. The resulting value tracks the sign of `y`, not the sign of `x`. When `y` is positive, the returned value will be in the range &#91;0, _y_). When `y` is negative, the returned value will be in the range (_y_, 0]. _(This matches the behavior of the Python `%` operator.)_

```typescript
function mod2(x: number, y: number): number;
```

Like the `mod` function above, except when `y` is positive, the returned value will be in the range &#91;‑_y_/2, _y_/2). When `y` is negative, the returned value will be in the range (‑_y_/2, _y_/2].

```typescript
function random(): number;
function random(maxValue: number): number;
function random(lowest: number, highest: number): number;
```

- With no arguments, this function is equivalent to `Math.random`.
- With one argument, this function returns a random number in the range [0, maxValue).
- With two arguments, this function returns a random number in the range [lowest, highest).

```typescript
function round(x: number, multiple = 1): number;
```

Same as `Math.round` when the second argument is omitted (or equals 1), otherwise rounds `x` to the nearest integer multiple of `multiple`, rounding upward when x is exactly halfway between two multiples.

```typescript
function signZN(x: number): number;
```

Like `Math.sign`, but returns -1 for an `x` of 0.

```typescript
function signZP(x: number): number;
```

Like `Math.sign`, but returns 1 for an `x` of 0.

```typescript
function sin_deg(x: number): number;
```

Same as `Math.sin`, but accepts an argument in degrees rather than radians.

```typescript
function squared(x: number): number;
```

Returns _x_<sup>2</sup>.

```typescript
function tan_deg(x: number): number;
```

Same as `Math.tan`, but accepts an argument in degrees rather than radians.

```typescript
function to_degree(x: number): number;
```

Converts `x` in radians to degrees.

```typescript
function to_radian(x: number): number;
```

Converts `x` in degrees to radians.

```typescript
function union(r1: Rectangle, r2: Rectangle): Rectangle;
```

Returns the smallest `Rectangle` which encloses both `r1` and `r2`.

## Data types

```typescript
interface Point {
  x: number;
  y: number;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}
```

## The `Angle` class

The `Angle` class represents immutable angle values, with methods to facilitate angular calculations and formatting angular values. Angle instances cache _sin_, _cos_, and _tan_ values internally so they only need to be computed once.

### Constructor

```typescript
constructor(angle = 0, unit?: Unit, mode = Mode.RANGE_LIMIT_SIGNED)
```

- With no arguments, `new Angle()` creates a zero-valued angle, equivalent to the constant Angle.ZERO.
- With one argument an `Angle` instance of `angle` radians is created.
- With two arguments an `Angle` instance of `angle` expressed in `unit` is created. As a radian value, `angle` will be adjusted to the range [-_π_, _π_), or [-180, 180) as degrees, etc.
- Given three arguments, and when `mode` is `Mode.RANGE_LIMIT_SIGNED`, a new `Angle` instance is created as described above.<br>
  A `mode` of `Mode.RANGE_LIMIT_NONNEGATIVE` coerces `angle` into the range [0, 2 _π_) in radians, [0, 360) in degrees, etc.<br>
  A `mode` of `Mode.RANGE_UNLIMITED` leaves the value of `angle` as-is.

### Static `Angle` factory methods

`Angle.asin`, `Angle.asin_nonneg`, `Angle.acos`, `Angle.atan`, `Angle.atan_nonneg`, `Angle.atan2`, and `Angle.atan2_nonneg` all function the same as the like-named general functions, but returning an `Angle` instance equivalent to the expected value in radians.

```typescript
Angle.parse(s: string, throwException = false): Angle
```

This method parses a string, either in degrees or hours, and an Angle instance. If the string can’t be parsed as a valid value, the method either returns `null`, or if `throwException` is specified and `true`, throws an "Invalid angle" exception.

If the characters `h` or `m`, are found within the string, the angle is treated as an hour angle, otherwise the angle is considered to be in degrees. A leading `-` will negate the angle value, or, when parsing degree values, a trailing `e` or `s` will negate the value. (These rules are case-insensitive.)

No range-limiting is applied &mdash; `"700"` will parse as an angle of 700°, not 340° or -20°.

### Enums

```typescript
enum Unit { RADIANS, DEGREES, ARC_MINUTES, ARC_SECONDS,
            HOURS, HOUR_ANGLE_MINUTES, HOUR_ANGLE_SECONDS,
            ROTATIONS, GRADS }

enum Mode { RANGE_LIMIT_SIGNED, RANGE_LIMIT_NONNEGATIVE,
            RANGE_UNLIMITED }
```

### Accessors for angle values in different units, and a conversion function

`arcMinutes`, `arcSeconds`, `degrees`, `grads`, `hours`, `radians`, `rotations`

For example, given:

```typescript
const a = new Angle(60, Unit.DEGREES);
```

...`a.hours` has a value of 4, `a.arcMinutes` is 3600, and `a.rotations` is 0.16666666666666666.

You can also access different unit values via the function:

```typescript
getAngle(unit = Unit.RADIANS): number
```

...such that `a.getAngle(Unit.HOURS)` would return 4, `a.getAngle(Unit.ARC_MINUTES)` would return 3600, etc.

### Caching trigonometric accessors

`cos`, `sin`, `tan`

Given `a` as defined in the previous examples, `a.cos` returns 0.5 (well, okay, 0.5000000000000001 because rounding isn’t perfect). Note: No parenthesis!

### `Angle` methods which return instances of `Angle`

```typescript
add(angle2: Angle, mode = Mode.RANGE_LIMIT_SIGNED): Angle;
subtract(angle2: Angle, mode = Mode.RANGE_LIMIT_SIGNED): Angle;
complement(mode = Mode.RANGE_LIMIT_SIGNED): Angle;
supplement(mode = Mode.RANGE_LIMIT_SIGNED): Angle;
opposite(mode = Mode.RANGE_LIMIT_SIGNED): Angle;
negate(mode = Mode.RANGE_LIMIT_SIGNED): Angle;
multiply(x: number, mode = Mode.RANGE_LIMIT_SIGNED): Angle;
divide(x: number, mode = Mode.RANGE_LIMIT_SIGNED): Angle;
```

Omitting the default `mode` argument of `Mode.RANGE_LIMIT_SIGNED` for clarity:

```typescript
add(angle2: Angle): Angle;
subtract(angle2: Angle): Angle;
complement(): Angle;
supplement(): Angle;
opposite(): Angle;
negate(): Angle;
multiply(x: number): Angle;
divide(x: number): Angle;
```

For non-negative results, without the need to specify `Mode.RANGE_LIMIT_NONNEGATIVE`:

```typescript
add_nonneg(angle2: Angle): Angle;
subtract_nonneg(angle2: Angle): Angle;
complement_nonneg(): Angle;
supplement_nonneg(): Angle;
opposite_nonneg(): Angle;
negate_nonneg(): Angle; // Sounds contradictory perhaps, but `negate_nonneg` of 20° is simply 340°.
multiply_nonneg(x: number): Angle;
divide_nonneg(x: number): Angle;
```

### Formatting/Stringifying

```typescript
toString(): string
```

With no arguments, the default string conversion is to display an angle value in decimal degrees with three digits of precision, followed by a degree (`°`) symbol.

```typescript
toString(format?: number, precision?: number): string
```

Stringifies an angle as decimal degrees according to `format`, specified using the following constants:

> ```typescript
> const FMT_DD     = 0x01; // Integer degrees zero-padded to two digits
> const FMT_HH     = 0x01; // Integer hours zero-padded to two digits (for use with
>                          //   toHourString and toTimeString)
> const FMT_DDD    = 0x02; // Integer degrees zero-padded to three digits
> const FMT_MINS   = 0x04; // Display arcminutes
> const FMT_SECS   = 0x08; // Display arcseconds (and arcminutes too)
> const FMT_SIGNED = 0x10; // Prefix positive values with `+` (`-` appears when needed)
> ```

These constants can be combined using `|` to express combinations of formatting options, such as `FMT_DD | FMT_MINS | FMT_SIGNED` to format an angle as a signed angle, integer portion zero-padded to two digits, with minute resolution, e.g. 3.5° becomes `+03°30'`.

The optional `precision` parameter (defaulting to 0) specifies how many decimal places to display as part of the smallest unit or subunit. For example:

`new Angle(3.5, Unit.DEGREES).toString(null, 2)`         ➜ `3.50°`<br>
`new Angle(3.5, Unit.DEGREES).toString(FMT_MINS)`       ➜ `3°30'`<br>
`new Angle(3.5, Unit.DEGREES).toString(FMT_MINS, 2)` ➜ `3°30.00'`

```typescript
toSuffixedString(positiveSuffix: string, negativeSuffix: string,
                 format?: number, precision?: number): string

```

This works like `toString()`, but rather than indicating the sign of the angle value using a leading `+` or `-` sign, either `positiveSuffix` or `negativeSuffix` is added at the end of the string representation. Typical values of `positiveSuffix` would be `N` or `W` for North or West. Typical values of `negativeSuffix` would be `S` or `E` for South or East.

```typescript
 toHourString(format?: number, precision?: number): string
```

Formats an angle as an hour angle (24 hours = 360°), using `h`, `m` and `s` to denote hours, minutes, and seconds, e.g. `12h34m56s`.

```typescript
 toTimeString(format?: number, precision?: number): string
```

Formats an angle as an hour angle (24 hours = 360°), using colons (`:`) to separate hours, minutes, and seconds, e.g. `12:34:56`.

## The `SphericalPosition` class

Instances of this class are immutable objects containing two `Angle` values, representing longitude and latitude (or right ascension and declination, or azimuth and altitude).

### Constructor

```typescript
constructor(longitude: Angle | number = 0, latitude: Angle | number = 0,
            longUnit = Unit.RADIANS, latUnit?: Unit)
```

- With no arguments an instance equivalent to 0°N, 0°W is created.
- With two arguments an instance of `longitude`, `latitude` is created. Numerical arguments will be interpreted as radians.
- With three arguments an instance of `longitude`, `latitude` is created, numerical arguments both interpreted according to `longUnit`.
- With four arguments an instance of `longitude`, `latitude` is created, numerical arguments interpreted according to `longUnit` and `latUnit`, respectively.

### Accessors

`altitude`, `azimuth`, `declination`, `latitude`, `longitude`, `rightAscension`

`azimuth` and `rightAscension` are equivalent to `longitude`.

`altitude` and `declination` are equivalent to `latitude`.

### Method

```typescript
distanceFrom(p: SphericalPosition): Angle
```

This method computes the angular distance between a `SphericalPosition` instance and another `SphericalPosition` instance.

## The `SphericalPosition3D` class

Instances of this class are a subclass of `SphericalPosition` with the addition of a radius value, specifying a unique point in a 3D space.

### Constructor

```typescript
constructor(longitude?: Angle | number, latitude?: Angle | number,
            radius = 0, longUnit?: Unit, latUnit?: Unit)
```

This works the same way as the `SphericalPosition` constructor, with the addition of a `radius` argument.

### Static `SphericalPosition3D` factory methods

```typescript
SphericalPosition3D.convertRectangular(x: number, y: number, z: number): SphericalPosition3D
SphericalPosition3D.convertRectangular(point: Point3D): SphericalPosition3D
```

These methods convert rectangle coordinates to 3D spherical coordinates.

```typescript
from2D(pos: SphericalPosition, radius: number): SphericalPosition3D
```

This method creates a `SphericalPosition3D` instance from a `SphericalPosition` instance and a `radius` value.

### Accessors

`radius`: The radius value.

`xyz`: The rectangular coordinates for the `SphericalPosition3D` instance.

## The `MinMaxFinder` class

This class finds estimated minima or maxima of numerical functions by parabolic interpolation, using Brent’s Method.

### Constructor

```typescript
 constructor(minMaxSeekingFunction: (x: number) => number,
             tolerance: number, maxIterations: number,
             xa: number, xb: number, xc: number)
```

This creates an instance of `MinMaxFinder` to find the _x_ value for which the value `minMaxSeekingFunction(x)` reaches a minimum (or maximum) value over the range _x_<sub>a</sub> ≤ _x_ ≤ _x_<sub>c</sub>, using the value _x_<sub>b</sub> (also in the range _x_<sub>a</sub> ≤ _x_<sub>b</sub> ≤ _x_<sub>c</sub>) as a hint for whether a minimum or maximum value should be sought.

Seeking is an iterative process. Once the difference in estimates between successive iterations is less than or equal to `tolerance` an estimate with be returned.

Often very accurate estimates can be found in less than 10 iterations, but `maxIterations` puts a limit on how many iterations will be attempted before possibly giving up, as some functions cannot be guaranteed to produce a solution.

### Method

```typescript
getXAtMinMax(): number
```

Returns the estimated value of _x_ at the minimum (or maximum) point of the function `minMaxSeekingFunction` in the range _x_<sub>a</sub> ≤ _x_ ≤ _x_<sub>c</sub> within `tolerance` of the best possible estimate, or the closest approximation reached when `maxIterations` have been exhausted.

### Accessors

_Note: using any accessor will invoke `getXAtMinMax()` if it has not already been invoked._

`foundMaximum`

`true` if a maximum value rather than a minimum value was found. `true` does not signify, however, that the result is a valid result found within `tolerance` or `maxIterations`.

`foundMinimum`

`true` if a minimum value rather than a maximum value was found. `true` does not signify, however, that the result is a valid result found within `tolerance` or `maxIterations`.

`lastY`

The last _y_ value computed when either a solution was found or `maxIterations` were exhausted.

`iterationCount`

The total number of iterations needed either to solve for the min/max value, or when `maxIterations` was reached.

`resolved`

`true` if a valid estimate was found within `tolerance` before `maxIterations` were exhausted.

## The `ZeroFinder` class

This class finds estimated zero-axis crossing points of functions, i.e. _x_ values at which _f_(_x_) transitions from a negative to a positive value, or vice-versa.

### Constructors

```typescript
  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number,
              maxIterations: number, x1: number, x2: number)
```

This creates an instance of `ZeroFinder` to find the estimated _x_ value at which the value `zeroSeekingFunction(x)` becomes zero, over the range _x_<sub>1</sub> ≤ _x_ ≤ _x_<sub>2</sub>.

Like `MinMaxFinder`, a solution is found using an iterative process. Once the difference in estimates between successive iterations is less than or equal to `tolerance` an estimate with be returned.

```typescript
  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number,
              maxIterations: number, x1: number, y1: number, x2: number, y2: number)
```

This constructor works the same as above except that the values _y_<sub>1</sub> and _y_<sub>2</sub> corresponding to  _x_<sub>1</sub> and _x_<sub>2</sub> are provided precomputed.

### Method

```typescript
getXAtZero(): number
```

Returns the estimated value of _x_ in the range _x_<sub>1</sub> ≤ _x_ ≤ _x_<sub>2</sub> for which the function `zeroSeekingFunction(x)` reaches 0, within `tolerance` of the best possible estimate, or the closest approximation reached when `maxIterations` have been exhausted.

The value of `tolerance` applies not only to the difference between successive estimates of _x_, but to how close `zeroSeekingFunction(x)` is to 0.

### Accessors

_Note: using any accessor will invoke `getXAtZero()` if it has not already been invoked._

`lastY`

The last _y_ value computed when either a solution was found or `maxIterations` were exhausted.

`iterationCount`

The total number of iterations needed either to solve for the min/max value, or when `maxIterations` was reached.

`resolved`

`true` if a valid estimate was found within `tolerance` before `maxIterations` were exhausted.

