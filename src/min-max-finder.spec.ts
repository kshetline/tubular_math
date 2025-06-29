import { expect } from 'chai';
import { MinMaxFinder } from './min-max-finder';

const epsilon = 1E-10;
const tolerance = epsilon / 100;

describe('MinMaxFinder', () => {
  const testFunc = x => x ** 3 - 3 * x ** 2 + 7;
  const testFunc2 = x => Math.log(x) + x ** 3 / 10 - x ** 2;

  it('should correctly find the minimum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, tolerance, 50, -3, -1.5, 0);

    expect(Math.abs(mmf.getXAtMinMax() + Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMinimum).to.be.true;
    expect(Math.abs(mmf.lastY + 1)).to.be.lessThan(epsilon);

    const mmf2 = new MinMaxFinder(Math.sin, tolerance, mmf.iterationCount - 1, -3, -1.5, 0);

    expect(Math.abs(mmf2.getXAtMinMax() + Math.PI / 2)).to.be.greaterThan(tolerance);

    const mmf3 = new MinMaxFinder(Math.sin, tolerance, 50, 3.2, 3.7, 4.2);

    mmf3.getXAtMinMax();
    expect(mmf3.foundMinimum).to.be.true;
    expect(mmf3.resolved).to.be.false;
    expect(mmf3.lastY).to.approximately(Math.sin(4.2), epsilon);

    const mmf4 = new MinMaxFinder(testFunc, tolerance, 50, 1, 2, 3);

    expect(mmf4.getXAtMinMax()).to.approximately(2, epsilon);
    expect(mmf4.getXAtMinMax()).to.approximately(2, epsilon);
    expect(mmf4.foundMinimum).to.be.true;
    expect(mmf4.lastY).to.approximately(3, epsilon);

    const mmf5 = () => new MinMaxFinder(testFunc2, tolerance, 50, 2, 6, 10);

    expect(mmf5().getXAtMinMax()).to.approximately(6.58990931744, epsilon);
    expect(mmf5().foundMinimum).to.be.true;
    expect(mmf5().foundMaximum).to.be.false;
    expect(mmf5().resolved).to.be.true;
    expect(mmf5().lastY).to.approximately(-12.9234287594, epsilon);
    expect(mmf5().iterationCount).to.equal(30);

    const mmf6 = new MinMaxFinder(x => 1 / x, tolerance, 100, -1, 0, 1);

    expect(mmf6.resolved).to.be.false;
    expect(mmf6.lastY).to.not.be.finite;
  });

  it('should correctly find the maximum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, tolerance, 50, 3, 1.5, 0);

    expect(Math.abs(mmf.getXAtMinMax() - Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMaximum).to.be.true;
    expect(Math.abs(mmf.lastY - 1)).to.be.lessThan(epsilon);

    const mmf2 = new MinMaxFinder(x => -Math.sin(x), tolerance, 50, 3.2, 3.7, 4.2);

    mmf2.getXAtMinMax();
    expect(mmf2.foundMaximum).to.be.true;
    expect(mmf2.lastY).to.approximately(-Math.sin(4.2), epsilon);

    const mmf3 = new MinMaxFinder(testFunc, tolerance, 50, -1, 0, 1);

    expect(mmf3.getXAtMinMax()).to.approximately(0, epsilon);
    expect(mmf3.foundMaximum).to.be.true;
    expect(mmf3.lastY).to.approximately(7, epsilon);

    const mmf4 = new MinMaxFinder(testFunc2, tolerance, 50, 0.1, 1, 2);

    expect(mmf4.getXAtMinMax()).to.approximately(0.750626358504, epsilon);
    expect(mmf4.foundMaximum).to.be.true;
    expect(mmf4.lastY).to.approximately(-0.807993920104, epsilon);
  });
});
