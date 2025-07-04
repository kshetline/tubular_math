const debug = false;

export interface Point {
  x: number;
  y: number;
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Rectangle {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const abs = Math.abs;

export const acos = Math.acos;

export const acosh = Math.acosh;

export function acos_deg(x: number): number {
  return Math.acos(x) / Math.PI * 180;
}

export function acot(x: number): number {
  return Math.PI / 2 - Math.atan(x);
}

export function acot2(y: number, x: number): number {
  return Math.PI / 2 - Math.atan2(y, x);
}

export function acot_deg(x: number): number {
  return 180 - Math.atan(x) / Math.PI * 180;
}

export function acot2_deg(a: number, b: number): number {
  return 180 - Math.atan2(a, b) / Math.PI * 180;
}

export const asin = Math.asin;

export const asinh = Math.asinh;

export function asin_deg(x: number): number {
  return Math.asin(x) / Math.PI * 180;
}

export const atan = Math.atan;

export const atan2 = Math.atan2;

export const atanh = Math.atanh;

export function atan_deg(x: number): number {
  return Math.atan(x) / Math.PI * 180;
}

export function atan2_deg(a: number, b: number): number {
  return Math.atan2(a, b) / Math.PI * 180;
}

export const cbrt = Math.cbrt;

export function ceil(x: number, multiple = 1): number {
  if (multiple === 1)
    return Math.ceil(x);

  return -(-x - mod(-x, multiple));
}

export const clz32 = Math.clz32;

export const cos = Math.cos;

export const cosh = Math.cosh;

export function cos_deg(x: number): number {
  return Math.cos(x / 180 * Math.PI);
}

/**
 * Integer division with "truncation toward zero".
 */
export function div_tt0(x: number, y: number): number {
  const d = x / y;

  if (d >= 0)
    return Math.floor(d);
  else
    return Math.ceil(d);
}

/**
 * Integer division, always rounding down to the nearest integer regardless of sign of the result.
 */
export function div_rd(x: number, y: number): number {
  return Math.floor(x / y);
}

export const E = Math.E;

export const exp = Math.exp;

export const expm1 = Math.expm1;

export function floor(x: number, multiple = 1): number {
  if (multiple === 1)
    return Math.floor(x);

  return x - mod(x, multiple);
}

export const fround = Math.fround;

export const hypot = Math.hypot;

export const imul = Math.imul;

export function interpolate(x0: number, x: number, x1: number, y0: number, y1: number): number {
  if (x0 === x1)
    return y0;

  return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

export function interpolateModular(x0: number, x: number, x1: number, y0: number, y1: number, modulus: number, signedResult = false): number {
  const m2 = modulus / 2;

  if (y0 < 0 || y0 >= modulus)
    // noinspection JSSuspiciousNameCombination
    y0 = mod(y0, modulus);

  while (y1 < y0 - m2)
    y1 += modulus;

  while (y1 >= y0 + m2)
    y1 -= modulus;

  let y = interpolate(x0, x, x1, y0, y1);

  if (signedResult && (y < m2 || y >= m2))
    // noinspection JSSuspiciousNameCombination
    y = mod2(y, modulus);
  else if (y < 0 || y >= modulus)
    // noinspection JSSuspiciousNameCombination
    y = mod(y, modulus);

  return y;
}

function interpolateOverIntRange(xx: number[], yy: number[], x: number, a: number, b: number): number {
  let y = 0;

  for (let i = a; i <= b; ++i) {
    let c = 1;

    for (let j = a; j <= b; ++j) {
      if (j !== i)
        c *= (x - xx[j]) / (xx[i] - xx[j]);
    }

    y += c * yy[i];
  }

  return y;
}

function interpolateAux(xx: number[], yy: number[], x: number, maxSpan: number, xc: number): number {
  const n = Math.min(xx.length, yy.length);
  let a = -1;
  let b = n - 1;

  for (let i = 0; i < n; ++i) {
    const xi = xx[i];

    if (a < 0 && xi >= xc - maxSpan)
      a = i;

    if (xi >= xc + maxSpan) {
      b = i;
      break;
    }
  }

  return interpolateOverIntRange(xx, yy, x, Math.max(a, 0), b);
}

// Note: To use maxSpan (by specifying a positive value) array data must be pre-sorted
// by ascending x value.
//
export function interpolateTabular(xx: number[], yy: number[], x: number, maxSpan = 0): number {
  const n = Math.min(xx.length, yy.length);

  if (maxSpan <= 0)
    return interpolateOverIntRange(xx, yy, x, 0, n - 1);

  // To avoid sudden jumps in the return value of this function as we shift
  // from one range of table values to another, we'll construct two ranges
  // based on maxSpan -- one for the tabular xx value just below x, another
  // for the xx value just above x. An interpolation will be performed over
  // both ranges, then a weighted average of the two interpolations, based
  // on the relative position of x between the two bounding xx values, will
  // be returned.

  let ca = -1;
  let cb = -1;

  for (let i = 0; i < n; ++i) {
    const xi = xx[i];

    if (xi === x)
      return yy[i];

    if (xi < x)
      ca = i;
    else if (xi > x) {
      cb = i;
      break;
    }
  }

  if (ca < 0)
    return yy[0];
  else if (cb < 0)
    return yy[n - 1];

  const xa = xx[ca];
  const xb = xx[cb];
  const weight = (x - xa) / (xb - xa);
  const ya = interpolateAux(xx, yy, x, maxSpan, xa);
  const yb = interpolateAux(xx, yy, x, maxSpan, xb);

  return ya * (1 - weight) + yb * weight;
}

export function intersects(r1: Rectangle, r2: Rectangle): boolean {
  return (r1.x < r2.x + r2.w && r1.x + r1.w > r2.x &&
          r1.y < r2.y + r2.h && r1.y + r1.h > r2.y);
}

export function irandom(maxValue: number): number;
export function irandom(lowest: number, highest: number): number;
export function irandom(lowestOrMax?: number, highest?: number): number {
  if (arguments.length === 1)
    return 1 + Math.floor(Math.random() * lowestOrMax);

  return lowestOrMax + Math.floor(Math.random() * (highest - lowestOrMax + 1));
}

function _limitNeg1to1(x: number, tolerance = 0.01): number {
  if (x < -1 - tolerance) {
    /* istanbul ignore next */
    if (debug) {
      console.debug('Value out of range: ' + x + ' < -1.0');
      console.trace();
    }

    return -1;
  }
  else if (x > 1 + tolerance) {
    /* istanbul ignore next */
    if (debug) {
      console.debug('Value out of range: ' + x + ' > 1.0');
      console.trace();
    }

    return 1;
  }
  else if (x < -1)
    return -1;
  else if (x > 1)
    return 1;
  else
    return x;
}

export const limitNeg1to1: (x: number) => number = _limitNeg1to1;

export const LN10 = Math.LN10;

export const LN2 = Math.LN2;

export const LOG10E = Math.LOG10E;

export const LOG2E = Math.LOG2E;

export const HALF_PI = Math.PI / 2;

export const log = Math.log;

export const log10 = Math.log10;

export const log1p = Math.log1p;

export const log2 = Math.log2;

export const max = Math.max;

export const min = Math.min;

/**
 * A modulo operation complementary to div_rd(), differing from % in how the relationship between
 * the signs of the arguments and the result is handled.
 */
export function mod(x: number, y: number): number {
  const m = x % y;

  if ((m < 0 && y > 0) || (m > 0 && y < 0)) {
    return y + m;
  }

  return m;
}

/**
 * For use with values such as angles, this modulo function splits the range of the modulus
 * between negative and positive numbers, [-y/2, y/2), e.g., for a y of 360, the result ranges
 * from -180 up to (but not including) 180. This function can return non-integer values.
 */
export function mod2(x: number, y: number): number {
  let result = x - Math.floor(x / y) * y;

  if (result >= y / 2)
    result -= y;

  return result;
}

export const PI = Math.PI;

export const pow = Math.pow;

export function random(): number;
export function random(maxValue: number): number;
export function random(lowest: number, highest: number): number;
export function random(lowestOrMax?: number, highest?: number): number {
  switch (arguments.length) {
    case 1: return Math.random() * lowestOrMax;
    case 2: return lowestOrMax + Math.random() * (highest - lowestOrMax);
  }

  return Math.random();
}

export function round(x: number, multiple = 1): number {
  if (multiple === 1)
    return Math.round(x);

  return x + multiple / 2 - mod(x + multiple / 2, multiple);
}

export const sign = Math.sign;

export function signZN(x: number): number {
  if (x > 0)
    return 1;
  else
    return -1;
}

export function signZP(x: number): number {
  if (x < 0)
    return -1;
  else
    return 1;
}

export const sin = Math.sin;

export const sinh = Math.sinh;

export function sin_deg(x: number): number {
  return Math.sin(x / 180 * Math.PI);
}

export const sqrt = Math.sqrt;

export const SQRT1_2 = Math.SQRT1_2;

export const SQRT2 = Math.SQRT2;

export function squared(x: number): number {
  return x * x;
}

export const tan = Math.tan;

export const tanh = Math.tanh;

export function tan_deg(x: number): number {
  return Math.tan(x / 180 * Math.PI);
}

export function to_degree(x: number): number {
  return x * 180 / Math.PI;
}

export function to_radian(x: number): number {
  return x * Math.PI / 180;
}

export const trunc = Math.trunc;

export const TWO_PI = Math.PI * 2;

export function union(r1: Rectangle, r2: Rectangle): Rectangle {
  const minX = min(r1.x, r2.x);
  const minY = min(r1.y, r2.y);
  const maxX = max(r1.x + r1.w, r2.x + r2.w);
  const maxY = max(r1.y + r1.h, r2.y + r2.h);

  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}
