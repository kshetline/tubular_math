import { expect } from 'chai';
import { ZeroFinder } from './zero-finder';

const epsilon = 1E-10;

describe('ZeroFinder', () => {
  it('should correctly find the zero of a function', () => {
    const zf = new ZeroFinder(Math.sin, epsilon / 100, 50, 0.2, Math.sin(0.2), 3, Math.sin(3));
    expect(Math.abs(zf.getXAtZero() - Math.PI)).to.be.lessThan(epsilon);
  });
});
