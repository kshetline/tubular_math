import { SphericalPosition } from './spherical-position';
import { Angle, Unit } from './angle';
import { Point3D } from './math';

export class SphericalPosition3D extends SphericalPosition {
  public static convertRectangular(xOrPoint: number | Point3D, y?: number, z?: number): SphericalPosition3D {
    let x: number;

    if (typeof xOrPoint === 'number') {
      x = <number> xOrPoint;

      if (y === undefined || z === undefined)
        throw new Error('Invalid arguments');
    }
    else {
      x = (<Point3D> xOrPoint).x;
      y = (<Point3D> xOrPoint).y;
      z = (<Point3D> xOrPoint).z;
    }

    return new SphericalPosition3D(Angle.atan2_nonneg(y, x),
                                   Angle.atan2(z, Math.sqrt(x * x + y * y)),
                                   Math.sqrt(x * x + y * y + z * z));
  }

  public static from2D(pos: SphericalPosition, radius: number): SphericalPosition3D {
    return new SphericalPosition3D(pos.longitude, pos.latitude, radius);
  }

  constructor(longitude?: Angle | number, latitude?: Angle | number, protected _radius = 0, longUnit?: Unit, latUnit?: Unit) {
    super(longitude, latitude, longUnit, latUnit);
  }

  public get radius(): number {
    return this._radius;
  }

  public get xyz(): Point3D {
    return {
      x: this._radius * this._latitude.cos * this._longitude.cos,
      y: this._radius * this._latitude.cos * this._longitude.sin,
      z: this._radius * this._latitude.sin
    };
  }

  public translate(newOrigin: SphericalPosition3D): SphericalPosition3D {
    const L0 = newOrigin.longitude;
    const B0 = newOrigin.latitude;
    const R0 = newOrigin.radius;

    const L = this.longitude;
    const B = this.latitude;
    const R = this.radius;

    const x = R * B.cos * L.cos - R0 * B0.cos * L0.cos;
    const y = R * B.cos * L.sin - R0 * B0.cos * L0.sin;
    const z = R * B.sin         - R0 * B0.sin;

    return SphericalPosition3D.convertRectangular(x, y, z);
  }

  public toString(): string {
    return super.toString() + ', rad: ' + this.radius.toFixed(5);
  }
}
