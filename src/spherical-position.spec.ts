import { expect } from 'chai';
import { SphericalPosition } from './spherical-position';
import { Angle } from './angle';

describe('SphericalPosition', () => {
  it('create instance', () => {
    const pos = new SphericalPosition();

    expect(pos.longitude.degrees).to.equal(0);
    expect(pos.latitude.degrees).to.equal(0);
    expect(pos.azimuth.degrees).to.equal(0);
    expect(pos.altitude.degrees).to.equal(0);
    expect(pos.rightAscension.degrees).to.equal(0);
    expect(pos.declination.degrees).to.equal(0);
    expect(pos.toString()).to.equal('lon: 0.000°, lat: 0.000°');
    expect(pos.distanceFrom(new SphericalPosition(Angle.RIGHT, Angle.RIGHT)).degrees).to.equal(90);
  });
});
