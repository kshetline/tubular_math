// Parabolic interpolation via Brent's Method, translated from Numerical Recipes in C.

/* eslint-disable @stylistic/no-multi-spaces */

import { abs } from './math';

const CGOLD = 0.381966011250105; // (3 - sqrt(5)) / 2
const ZEPS = 1.0E-20;

export class MinMaxFinder {
  private _iterationCount = 0;
  private fx: number;
  private isMin = true;
  private _resolved = false;
  private _x: number;

  constructor(private minMaxSeekingFunction: (x: number) => number, private tolerance: number, private maxIterations: number,
              private xa: number, private xb: number, private xc: number) {
  }

  getXAtMinMax(): number {
    if (this._x != null)
      return this._x;

    let a: number;
    let b: number;
    let d = 0;
    let etemp: number;
    let fu: number;
    let fv: number;
    let fw: number;
    let p: number;
    let q: number;
    let r: number;
    let tol1: number;
    let tol2: number;
    let u: number;
    let v: number;
    let w: number;
    let x: number;
    let xm: number;
    let e = 0;
    let sign = 1;

    a = Math.min(this.xa, this.xc);
    b = Math.max(this.xa, this.xc);
    x = w = v = this.xb;
    this.fx = this.minMaxSeekingFunction(x);

    // Reverse the sign of the evaluated function if we're searching for a max rather than a min.
    if (this.fx > this.minMaxSeekingFunction(this.xa)) {
      this.isMin = false;
      this.fx *= -1;
      sign = -1;
    }
    else
      this.isMin = true;

    fw = fv = this.fx;
    this._iterationCount = 0;

    while (++this._iterationCount <= this.maxIterations) {
      xm = 0.5 * (a + b);
      tol1 = this.tolerance * abs(x) + ZEPS;
      tol2 = 2 * tol1;

      if (abs(x - xm) <= tol2 - 0.5 * (b - a)) {
        this.fx *= sign;
        this._resolved = true;
        this._x = x;

        return x;
      }

      if (abs(e) > tol1) {
        r = (x - w) * (this.fx - fv);
        q = (x - v) * (this.fx - fw);
        p = (x - v) * q - (x - w) * r;
        q = 2 * (q - r);

        if (q > 0)
          p = -p;

        q = abs(q);
        etemp = e;
        e = d;

        if (abs(p) >= abs(0.5 * q * etemp) || p <= q * (a - x) || p >= q * (b - x)) {
          e = (x >= xm ? a - x : b - x);
          d = CGOLD * e;
        }
        else {
          d = p / q;
          u = x + d;

          /* istanbul ignore next */ // TODO: Does this condition ever come up?
          if (u - a < tol2 || b - u < tol2)
            d = Math.sign(xm - x) * tol1;
        }
      }
      else {
        e = (x >= xm ? a - x : b - x);
        d = CGOLD * e;
      }

      u  = (abs(d) >= tol1 ? x + d : x + Math.sign(d) * tol1);
      fu = sign * this.minMaxSeekingFunction(u);

      if (fu <= this.fx) {
        if (u >= x)
          a = x;
        else
          b = x;

        v  = w;  w  = x;       x  = u;
        fv = fw; fw = this.fx; this.fx = fu;
      }
      else {
        if (u < x)
          a = u;
        else
          b = u;

        if (fu <= fw || w === x) {
          v = w;
          w = u;
          fv = fw;
          fw = fu;
        }
        else if (fu <= fv || v === x || v === w) {
          v = u;
          fv = fu;
        }
      }
    }

    this.fx *= sign;
    this._x = x;

    return x;
  }

  get foundMaximum(): boolean {
    if (this._x == null)
      this.getXAtMinMax();

    return !this.isMin;
  }

  get foundMinimum(): boolean {
    if (this._x == null)
      this.getXAtMinMax();

    return this.isMin;
  }

  get lastY(): number {
    if (this._x == null)
      this.getXAtMinMax();

    return this.fx;
  }

  get iterationCount(): number {
    if (this._x == null)
      this.getXAtMinMax();

    return this._iterationCount;
  }

  get resolved(): boolean {
    if (this._x == null)
      this.getXAtMinMax();

    return this._resolved && isFinite(this.fx) && !isNaN(this.fx);
  }
}
