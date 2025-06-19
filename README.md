<!-- omit in toc -->
# @tubular/math

Provides a few useful math utilities as well as pass-through declarations of the standard JavaScript Math library.

This includes min-max finding, zero finding, assistance for integer and modular math, angle calculations and conversions and formatting, and support for spherical coordinates.

## Installation

### Via npm

`npm install @tubular/math`

`import { `...`} from '@tubular/math'; // ESM`

...or...

`const {`...`} = require('@tubular/math'); // CommonJS`

_Documentation examples will assume **@tubular/math** has been imported as above._

### Via `<script>` tag

To remotely download the full code as an ES module:

```html
<script type="module">
  import('https://unpkg.com/@tubular/math/dist/index.min.mjs').then(pkg => {
    const {  } = pkg;

    // ...
  });
</script>
```

For the old-fashioned UMD approach:

```html
<script src="https://unpkg.com/@tubular/math/dist/index.min.js"></script>
```

The **@tubular/math** package will be made available via the global variable `tbMath`. Functions, classes, and constants will also be available via this variable, such as `tbMath.`, `tbMath.`, `tbMath.`, etc.

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
function cos_deg(x: number): number;
```

Same as `Math.asin`, but accepts an argument in degrees rather than radians.

```typescript
function div_tt0(x: number, y: number): number;
```

Integer division with "truncation toward zero", that is positive results of _x_/_y_ round downward to the nearest integer, and negative results round upward to the nearest integer.

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

This is useful for interpolating angular values, not only to pin results to a range such as [0, 360) or [‑180, 180), but when the input value might span across a modular discontinuity.

```typescript
function limitNeg1to1(x: number): number;
```

Returns the value of _x_ pinned within the range [‑1, 1], a function particularly useful for preventing `NaN` results from `asin` or `acos` when the value of _x_ might overflow this range slightly due to rounding errors.

```typescript
function mod(x: number, y: number): number;
```

This is equivalent to `x % y` except for the function’s behavior with negative argument values. The resulting value always tracks the sign of `y`, not the sign of `x`. When `y` is positive, the returned value will be in the range &#91;0, _y_). When `y` is negative, the returned value will be in the range (_y_, 0]. _(This matches the behavior of the Python `%` operator.)_

```typescript
function mod2(x: number, y: number): number;
```

Like the `mod` function above, except when `y` is positive, the returned value will be in the range &#91;‑_y_/2, _y_/2). When `y` is negative, the returned value will be in the range (‑_y_/2, _y_/2].

