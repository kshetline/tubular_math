import { expect } from 'chai';
import { MinMaxFinder } from './min-max-finder';

const epsilon = 1E-10;

describe('MinMaxFinder', () => {
  const testFunc = x => x ** 3 - 3 * x ** 2 + 7;
  const testFunc2 = x => Math.log(x) + x ** 3 / 10 - x ** 2;

  it('should correctly find the minimum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, -3, -1.5, 0);

    expect(Math.abs(mmf.getXAtMinMax() + Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMinimum).to.be.true;
    expect(Math.abs(mmf.lastY + 1)).to.be.lessThan(epsilon);

    const mmf2 = new MinMaxFinder(Math.sin, epsilon / 100, mmf.iterationCount - 1, -3, -1.5, 0);

    expect(Math.abs(mmf2.getXAtMinMax() + Math.PI / 2)).to.be.greaterThan(epsilon / 100);

    const mmf3 = new MinMaxFinder(Math.sin, epsilon / 100, 50, 3.2, 3.7, 4.2);

    mmf3.getXAtMinMax();
    expect(mmf3.foundMinimum).to.be.true;
    expect(mmf3.lastY).to.approximately(Math.sin(4.2), epsilon);

    const mmf4 = new MinMaxFinder(testFunc, epsilon / 100, 50, 1, 2, 3);

    expect(mmf4.getXAtMinMax()).to.approximately(2, epsilon);
    expect(mmf4.foundMinimum).to.be.true;
    expect(mmf4.lastY).to.approximately(3, epsilon);

    const mmf5 = new MinMaxFinder(testFunc2, epsilon / 100, 50, 2, 6, 10);

    expect(mmf5.getXAtMinMax()).to.approximately(6.58990931744, epsilon);
    expect(mmf5.foundMinimum).to.be.true;
    expect(mmf5.lastY).to.approximately(-12.9234287594, epsilon);
  });

  it('should correctly find the maximum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, 3, 1.5, 0);

    expect(Math.abs(mmf.getXAtMinMax() - Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMaximum).to.be.true;
    expect(Math.abs(mmf.lastY - 1)).to.be.lessThan(epsilon);

    const mmf2 = new MinMaxFinder(x => -Math.sin(x), epsilon / 100, 50, 3.2, 3.7, 4.2);

    mmf2.getXAtMinMax();
    expect(mmf2.foundMaximum).to.be.true;
    expect(mmf2.lastY).to.approximately(-Math.sin(4.2), epsilon);

    const mmf3 = new MinMaxFinder(testFunc, epsilon / 100, 50, -1, 0, 1);

    expect(mmf3.getXAtMinMax()).to.approximately(0, epsilon);
    expect(mmf3.foundMaximum).to.be.true;
    expect(mmf3.lastY).to.approximately(7, epsilon);

    const mmf4 = new MinMaxFinder(testFunc2, epsilon / 100, 50, 0.1, 1, 2);

    expect(mmf4.getXAtMinMax()).to.approximately(0.750626358504, epsilon);
    expect(mmf4.foundMaximum).to.be.true;
    expect(mmf4.lastY).to.approximately(-0.807993920104, epsilon);
  });
});
