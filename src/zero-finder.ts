// noinspection JSSuspiciousNameCombination

const INTERVALS = 10;

export class ZeroFinder {
  private _iterationCount = 0;
  private x2: number;
  private y: number;
  private y2: number;
  private _resolved = false;
  private _x: number;
  private xForY: number;
  private maxError = 0;

  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number, maxIterations: number,
    x1: number, x2: number, maxError?: number);

  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number, maxIterations: number,
    x1: number, y1: number, x2: number, y2: number, maxError?: number);

  constructor(private zeroSeekingFunction: (x: number) => number, private tolerance: number, private maxIterations: number,
              private x1: number, private y1: number, x2?: number, y2?: number, maxError?: number) {
    if (y2 == null) {
      this.x2 = y1;
      this.y1 = zeroSeekingFunction(x1);
      this.y2 = zeroSeekingFunction(y1);

      if (x2 != null)
        this.maxError = x2;
    }
    else {
      this.x2 = x2;
      this.y2 = y2;
      this.maxError = maxError || 0;
    }
  }

  getXAtZero(): number {
    if (this._x != null)
      return this._x;

    let x;
    let lastY: number | undefined = 0;
    let maxIter = this.maxIterations / 2;
    let tryIntervals = true;
    let stayedTheSame = 0;

    this._iterationCount = 1;

    outerLoop:
    while (!this._resolved) {
      --this._iterationCount;

      while (++this._iterationCount <= maxIter && !this._resolved) {
        const slope = (this.y2 - this.y1) / (this.x2 - this.x1);

        x = slope ? this.x1 - this.y1 / slope : (this.x1 + this.x2) / 2;
        this.y = this.zeroSeekingFunction(x);

        if (this.y === lastY) {
          if (++stayedTheSame >= 3) {
            tryIntervals = false;
            break;
          }
        }
        else
          stayedTheSame = 0;

        lastY = this.y;

        if (Math.abs(this.y) <= this.tolerance) {
          this._resolved = Math.abs(this.x2 - this.x1) <= this.tolerance;
          this.xForY = this._x = x;
          break;
        }

        if ((this.y1 < this.y2 && this.y < 0) || (this.y1 > this.y2 && this.y > 0)) {
          this.x1 = x;
          this.y1 = this.y;
        }
        else {
          this.x2 = x;
          this.y2 = this.y;
        }
      }

      if (!this._resolved && tryIntervals) {
        let xa = this.x1;
        let xb = this.x2;

        --this._iterationCount;
        tryIntervals = false;
        maxIter = this.maxIterations;

        while (++this._iterationCount <= maxIter) {
          const step = (xb - xa) / INTERVALS;
          let i = 1;
          let bestX = x = xa;
          let y = this.zeroSeekingFunction(x);
          let bestY = Math.abs(y);
          let sign = Math.sign(y);

          do {
            if (Math.abs(y) <= this.tolerance && step <= this.tolerance) {
              this._resolved = true;
              this.y = y;
              this.xForY = x;
              break outerLoop;
            }

            x += step;
            y = this.zeroSeekingFunction(x);

            if (Math.abs(y) < bestY) {
              bestX = x;
              bestY = Math.abs(y);
            }

            const sign2 = Math.sign(y);

            if (sign2 !== sign) {
              xa = x - step;
              xb = x;
              x = x - step / 2;
              break;
            }
          } while (++i <= INTERVALS);

          if (i > INTERVALS) {
            if (this.maxError && bestY < this.maxError) {
              xa = bestX - step;
              xb = bestY + step;

              if (maxIter === this.maxIterations)
                maxIter = Math.min(this._iterationCount + 2, this.maxIterations);
            }
            else {
              maxIter = this._iterationCount;
              break;
            }
          }
        }

        if (this.xForY !== x)
          this.y = this.zeroSeekingFunction(x); // A last approximation in case iterations are exhausted
      }
      else
        break;
    }

    if (this.maxError && Math.abs(this.y) > this.maxError) {
      x = NaN;
      this.y = NaN;
    }

    this._x = x;

    return x;
  }

  get lastY(): number {
    if (this._x == null)
      this.getXAtZero();

    return this.y;
  }

  get iterationCount(): number {
    if (this._x == null)
      this.getXAtZero();

    return this._iterationCount;
  }

  get resolved(): boolean {
    if (this._x == null)
      this.getXAtZero();

    return this._resolved && isFinite(this.y) && !isNaN(this.y);
  }
}
