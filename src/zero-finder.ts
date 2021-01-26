export class ZeroFinder {
  private _iterationCount = 0;
  private y: number;

  constructor(private zeroSeekingFunction: Function, private tolerance: number, private maxIterations: number,
              private x1: number, private y1: number, private x2: number, private y2: number) {
  }

  public getXAtZero(): number {
    let x: number;

    this._iterationCount = 0;

    while (++this._iterationCount <= this.maxIterations) {
      x = this.x1 - this.y1 / (this.y2 - this.y1) * (this.x2 - this.x1);
      this.y = this.zeroSeekingFunction(x);

      if (Math.abs(this.y) <= this.tolerance)
        break;

      if ((this.y1 < this.y2 && this.y < 0.0) || (this.y1 > this.y2 && this.y > 0.0)) {
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

  public get lastY(): number { return this.y; }

  public get iterationCount(): number { return this._iterationCount; }
}
