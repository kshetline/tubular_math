import { Angle, Mode, Unit } from './angle';
import { abs, acos, limitNeg1to1, mod2, TWO_PI } from './math';

export class SphericalPosition {
  protected _longitude: Angle;
  protected _latitude: Angle;

  constructor(longitude: Angle | number = 0, latitude: Angle | number = 0,
              longUnit = Unit.RADIANS, latUnit?: Unit) {
    if (latUnit == null)
      latUnit = longUnit;

    if (typeof longitude === 'number')
      this._longitude = new Angle(longitude, longUnit, Mode.RANGE_LIMIT_NONNEGATIVE);
    else
      this._longitude = longitude;

    if (typeof latitude === 'number')
      this._latitude = new Angle(latitude, latUnit);
    else
      this._latitude = latitude;
  }

  get longitude(): Angle {
    return this._longitude;
  }

  get rightAscension(): Angle {
    return this._longitude;
  }

  get altitude(): Angle {
    return this._latitude;
  }

  get azimuth(): Angle {
    return this._longitude;
  }

  get latitude(): Angle {
    return this._latitude;
  }

  get declination(): Angle {
    return this._latitude;
  }

  distanceFrom(p: SphericalPosition): Angle {
    // Tiny rounding errors which can make the argument of acos very slightly larger than 1.0
    // or very slight smaller than -1.0 are enough to blow up the acos function and get you a
    // NaN for your trouble.
    //
    let d = acos(limitNeg1to1(this._latitude.sin * p._latitude.sin +
                              this._latitude.cos * p._latitude.cos *
                              this._longitude.subtract(p._longitude).cos));

    d = abs(mod2(d, TWO_PI));

    return new Angle(d);
  }

  toString(): string {
    return `lon: ${this.longitude}, lat: ${this.latitude}`;
  }
}
