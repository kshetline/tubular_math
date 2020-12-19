import { expect } from 'chai';
import { MinMaxFinder } from './min-max-finder';

const epsilon = 1E-10;

describe('MinMaxFinder', () => {
  it('should correctly find the minimum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, -3, -1.5, 0);
    expect(Math.abs(mmf.getXAtMinMax() + Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMinimum).to.be.true;
    expect(Math.abs(mmf.lastY + 1)).to.be.lessThan(epsilon);
  });

  it('should correctly find the maximum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, 0, 1.5, 3);
    expect(Math.abs(mmf.getXAtMinMax() - Math.PI / 2)).to.be.lessThan(epsilon);
    expect(mmf.foundMaximum).to.be.true;
    expect(Math.abs(mmf.lastY - 1)).to.be.lessThan(epsilon);
  });
});
