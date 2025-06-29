import { expect } from 'chai';
import { SphericalPosition3D } from './spherical-position-3d';
import { SphericalPosition } from './spherical-position';

describe('SphericalPosition3D', () => {
  it('create instance', () => {
    const pos = new SphericalPosition3D(0, 0, 10);

    expect(pos.radius).to.equal(10);
    expect(pos.toString()).to.equal('lon: 0.000°, lat: 0.000°, rad: 10.00000');

    expect(new SphericalPosition3D(0, 0).radius).to.equal(0);
  });

  it('convertRectangular', () => {
    let pos = SphericalPosition3D.convertRectangular(3, 4, 5);

    expect(pos.radius).to.approximately(7.07106, 1E-5);
    expect(pos.xyz.x).to.approximately(3, 1E-10);
    expect(pos.xyz.y).to.approximately(4, 1E-10);
    expect(pos.xyz.z).to.approximately(5, 1E-10);

    pos = SphericalPosition3D.convertRectangular({ x: 3, y: 4, z: 5 });
    expect(pos.radius).to.approximately(7.07106, 1E-5);

    expect(() => SphericalPosition3D.convertRectangular(1)).to.throw();
  });

  it('from2D', () => {
    const pos = SphericalPosition3D.from2D(new SphericalPosition(), 7);

    expect(pos.toString()).to.equal('lon: 0.000°, lat: 0.000°, rad: 7.00000');
  });

  it('translate', () => {
    const pos = SphericalPosition3D.convertRectangular(3, 4, 5);
    const pos2 = SphericalPosition3D.convertRectangular(-1, 1, -2);
    const pos3 = pos.translate(pos2);

    expect(pos3.xyz.x).to.approximately(4, 1E-10);
    expect(pos3.xyz.y).to.approximately(3, 1E-10);
    expect(pos3.xyz.z).to.approximately(7, 1E-10);
  });
});
