import { expect } from 'chai';
import { ZeroFinder } from './zero-finder';
import { HALF_PI } from './math';

const epsilon = 1E-10;
const tolerance = epsilon / 100;

describe('ZeroFinder', () => {
  it('should correctly find the zero of a function', () => {
    let zf = new ZeroFinder(Math.sin, tolerance, 50, 0.2, Math.sin(0.2), 3, Math.sin(3));

    expect(zf.getXAtZero()).to.approximately(Math.PI, epsilon);
    expect(zf.lastY).to.approximately(0, epsilon);
    expect(zf.iterationCount).to.be.greaterThan(5);
    expect(zf.resolved).to.be.true;

    zf = new ZeroFinder(Math.cos, tolerance, 50, 0.2, 3);

    expect(Math.abs(zf.getXAtZero() - HALF_PI)).to.be.lessThan(epsilon);
    expect(Math.abs(zf.getXAtZero() - HALF_PI)).to.be.lessThan(epsilon);

    zf = new ZeroFinder(x => x / 2, tolerance, 50, -1, 1);

    expect(Math.abs(zf.getXAtZero())).to.approximately(0, epsilon);

    // Range includes a potential trouble spot, which seems to be the only way to exercise
    //   a portion of the code.
    zf = new ZeroFinder(Math.tan, tolerance, 50, -1.5, 1.7);

    zf.getXAtZero();
    expect(zf.lastY).to.approximately(0, epsilon);

    const zff = () => new ZeroFinder(x => x ** 3, tolerance, 50, -3, 2.8);

    expect(zff().getXAtZero()).to.approximately(0, epsilon);
    expect(zff().lastY).to.approximately(0, epsilon);
    expect(zff().iterationCount).to.equal(38);
    expect(zff().resolved).to.be.true;
  });

  it('should correctly handle not being able to find a zero value', () => {
    let zf = new ZeroFinder(x => x ** 2 + 1, tolerance, 50, -2, 2, 0.01);

    expect(zf.getXAtZero()).to.be.NaN;
    expect(zf.resolved).to.be.false;

    zf = new ZeroFinder(x => x ** 2 + 0.0001, tolerance, 50, -2, 2, 0.01);

    expect(zf.getXAtZero()).to.not.be.NaN;
    expect(zf.resolved).to.be.false;

    zf = new ZeroFinder(_x => 1, tolerance, 50, 0, 5, 0.01);

    expect(zf.getXAtZero()).to.be.NaN;
    expect(zf.iterationCount).to.equal(4);
  });
});
