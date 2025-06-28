// noinspection JSSuspiciousNameCombination

const INTERVALS = 10;

export class ZeroFinder {
  private _iterationCount = 0;
  private x2: number;
  private y: number;
  private y2: number;
  private _resolved = false;
  private _x: number;

  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number, maxIterations: number,
    x1: number, x2: number);

  constructor(zeroSeekingFunction: (x: number) => number, tolerance: number, maxIterations: number,
    x1: number, y1: number, x2: number, y2: number);

  constructor(private zeroSeekingFunction: (x: number) => number, private tolerance: number, private maxIterations: number,
              private x1: number, private y1: number, x2?: number, y2?: number) {
    if (x2 == null) {
      this.x2 = y1;
      this.y1 = zeroSeekingFunction(x1);
      this.y2 = zeroSeekingFunction(y1);
    }
    else {
      this.x2 = x2;
      this.y2 = y2;
    }
  }

  getXAtZero(): number {
    if (this._x != null)
      return this._x;

    let x: number;
    let maxIter = this.maxIterations / 2;
    let triedIntervals = false;

    this._iterationCount = 0;

    while (!this._resolved) {
      while (++this._iterationCount <= maxIter && !this._resolved) {
        x = this.x1 - this.y1 / (this.y2 - this.y1) * (this.x2 - this.x1);
        this.y = this.zeroSeekingFunction(x);

        if (Math.abs(this.y) <= this.tolerance) {
          this._resolved = Math.abs(this.x2 - this.x1) <= this.tolerance;
          this._x = x;
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

      if (!this._resolved && !triedIntervals) {
        triedIntervals = true;
        maxIter = this.maxIterations;

        outer:
        while (++this._iterationCount <= maxIter) {
          const step = (this.x2 - this.x1) / INTERVALS;
          let i = 1;
          x = this.x1;
          let y = this.zeroSeekingFunction(x);
          let sign = Math.sign(y);

          do {
            if (Math.abs(y) <= this.tolerance && step <= this.tolerance) {
              this._resolved = true;
              this.y = y;
              break outer;
            }

            x += step;
            y = this.zeroSeekingFunction(x);
            const sign2 = Math.sign(y);

            if (sign2 !== sign) {
              this.x1 = x - step;
              this.x2 = x;
              x = x - step / 2;
              break;
            }
          } while (++i <= INTERVALS);

          if (i > INTERVALS)
            break;
        }

        this.y = this.zeroSeekingFunction(x); // A last approximation in case iterations are exhausted
      }
      else
        break;
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
