import { abs } from './math';

const CGOLD = 0.381966011250105; // (3 - sqrt(5)) / 2
const ZEPS = 1.0E-20;

export class MinMaxFinder {
  private _iterationCount = 0;
  private fx: number;
  private isMin = true;

  constructor(private minMaxSeekingFunction: (x: number) => number, private tolerance: number, private maxIterations: number,
              private ax: number, private bx: number, private cx: number) {
  }

  public getXAtMinMax(): number {
    let a: number;
    let b: number;
    let d = 0.0;
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
    let e = 0.0;
    let sign = 1.0;

    a = (this.ax < this.cx ? this.ax : this.cx);
    b = (this.ax > this.cx ? this.ax : this.cx);
    x = w = v = this.bx;
    this.fx = this.minMaxSeekingFunction(x);

    // Reverse the sign of the evaluated function if we're searching for a max rather than a min.
    if (this.fx > this.minMaxSeekingFunction(this.ax)) {
      this.isMin = false;
      this.fx *= -1;
      sign = -1.0;
    }
    else
      this.isMin = true;

    fw = fv = this.fx;
    this._iterationCount = 0;

    while (++this._iterationCount <= this.maxIterations) {
      xm = 0.5 * (a + b);
      tol1 = this.tolerance * abs(x) + ZEPS;
      tol2 = 2.0 * tol1;

      if (abs(x - xm) <= tol2 - 0.5 * (b - a)) {
        this.fx *= sign;

        return x;
      }

      if (abs(e) > tol1) {
        r = (x - w) * (this.fx - fv);
        q = (x - v) * (this.fx - fw);
        p = (x - v) * q - (x - w) * r;
        q = 2.0 * (q - r);

        if (q > 0.0)
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

    return x;
  }

  public get foundMaximum(): boolean { return !this.isMin; }

  public get foundMinimum(): boolean { return this.isMin; }

  public get lastY(): number { return this.fx; }

  public get iterationCount(): number { return this._iterationCount; }
}
