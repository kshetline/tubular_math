import { expect } from 'chai';
import { ZeroFinder } from './zero-finder';
import { HALF_PI } from './math';

const epsilon = 1E-10;

describe('ZeroFinder', () => {
  it('should correctly find the zero of a function', () => {
    let zf = new ZeroFinder(Math.sin, epsilon / 100, 50, 0.2, Math.sin(0.2), 3, Math.sin(3));

    expect(Math.abs(zf.getXAtZero() - Math.PI)).to.be.lessThan(epsilon);
    expect(zf.lastY).to.approximately(0, epsilon);
    expect(zf.iterationCount).to.be.greaterThan(5);

    zf = new ZeroFinder(Math.cos, epsilon / 100, 50, 0.2, 3);

    expect(Math.abs(zf.getXAtZero() - HALF_PI)).to.be.lessThan(epsilon);

    // Range includes a potential trouble spot, which seems to be the only way to exercise
    //   a portion of the code.
    zf = new ZeroFinder(Math.tan, epsilon / 100, 50, -1.5, 1.7);

    zf.getXAtZero();
    expect(zf.lastY).to.approximately(0, epsilon);
  });
});
