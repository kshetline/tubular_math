// noinspection JSSuspiciousNameCombination

export class ZeroFinder {
  private _iterationCount = 0;
  private x2: number;
  private y: number;
  private y2: number;

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
    let x: number;

    this._iterationCount = 0;

    while (++this._iterationCount <= this.maxIterations) {
      x = this.x1 - this.y1 / (this.y2 - this.y1) * (this.x2 - this.x1);
      this.y = this.zeroSeekingFunction(x);

      if (Math.abs(this.y) <= this.tolerance)
        break;

      if ((this.y1 < this.y2 && this.y < 0) || (this.y1 > this.y2 && this.y > 0)) {
        this.x1 = x;
        this.y1 = this.y;
      }
      else {
        this.x2 = x;
        this.y2 = this.y;
      }
    }

    return x;
  }

  get lastY(): number { return this.y; }

  get iterationCount(): number { return this._iterationCount; }
}
