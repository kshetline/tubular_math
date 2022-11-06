import { expect } from 'chai';
import * as M_ from './math';
import { irandom, random } from './math';

function inRange(low: number, value: number, high: number): boolean {
  return low <= value && value < high;
}

function inRangeInclusive(low: number, value: number, high: number): boolean {
  return low <= value && value <= high;
}

describe('math', () => {
  it('should perform integer division, rounding down', () => {
    expect(M_.div_rd(5, 3)).to.equal(1);
    expect(M_.div_rd(-5, 3)).to.equal(-2);
  });

  it('should perform integer division, truncating toward 0', () => {
    expect(M_.div_tt0(5, 3)).to.equal(1);
    expect(M_.div_tt0(-5, 3)).to.equal(-1);
  });

  it('should create random numbers in correct ranges', () => {
    for (let i = 0; i < 50; ++i)
      expect(inRange(0, random(), 1)).to.be.true;

    for (let i = 0; i < 50; ++i)
      expect(inRange(0, random(77), 77)).to.be.true;

    for (let i = 0; i < 50; ++i)
      expect(inRange(-300, random(-300, 400), 400)).to.be.true;
  });

  it('should create random integers in correct ranges', () => {
    for (let i = 0; i < 50; ++i)
      expect(inRangeInclusive(1, irandom(10), 10)).to.be.true;

    for (let i = 0; i < 50; ++i)
      expect(inRangeInclusive(5, irandom(5, 15), 15)).to.be.true;
  });

  it('should match Math.xxx function returns, where applicable', () => {
    Object.keys(M_).forEach(key => {
      if (typeof Math[key] === 'function' && key !== 'random') {
        let a: number;
        let b: number;
        const args = /^(ceil|floor|round)$/.test(key) ? [15.5] : [0.5, 1.5, -2.9];

        try {
          a = M_[key](...args);
          b = Math[key](...args);
        }
        catch (e) {
          console.log(key, e.message);
          a = b = 0;
        }

        if (isNaN(a))
          expect(b).to.be.NaN;
        else
          expect(a).to.equal(b);
      }
    });
  });

  it('should perform ceil, floor, and round with multiples', () => {
    expect(M_.round(1.4)).to.equal(1);
    expect(M_.round(-1.4)).to.equal(-1);
    expect(M_.round(1.5)).to.equal(2);
    expect(M_.round(-1.5)).to.equal(-1);
    expect(M_.round(1.7)).to.equal(2);
    expect(M_.round(-1.7)).to.equal(-2);
    expect(M_.round(1400, 100)).to.equal(1400);
    expect(M_.round(-1400, 100)).to.equal(-1400);
    expect(M_.round(1400, 1000)).to.equal(1000);
    expect(M_.round(-1400, 1000)).to.equal(-1000);
    expect(M_.round(1500, 1000)).to.equal(2000);
    expect(M_.round(-1500, 1000)).to.equal(-1000);
    expect(M_.round(1501, 1000)).to.equal(2000);
    expect(M_.round(-1501, 1000)).to.equal(-2000);

    expect(M_.ceil(1)).to.equal(1);
    expect(M_.ceil(1.4)).to.equal(2);
    expect(M_.ceil(1.4, -1)).to.equal(1);
    expect(M_.ceil(1.5)).to.equal(2);
    expect(M_.ceil(1.7)).to.equal(2);
    expect(M_.ceil(10, 10)).to.equal(10);
    expect(M_.ceil(14, 10)).to.equal(20);
    expect(M_.ceil(15, 10)).to.equal(20);
    expect(M_.ceil(17, 10)).to.equal(20);
    expect(M_.ceil(19.99, 10)).to.equal(20);

    expect(M_.floor(1)).to.equal(1);
    expect(M_.floor(1.4)).to.equal(1);
    expect(M_.floor(1.4, -1)).to.equal(2);
    expect(M_.floor(1.5)).to.equal(1);
    expect(M_.floor(1.7)).to.equal(1);
    expect(M_.floor(10, 10)).to.equal(10);
    expect(M_.floor(14, 10)).to.equal(10);
    expect(M_.floor(15, 10)).to.equal(10);
    expect(M_.floor(17, 10)).to.equal(10);
    expect(M_.floor(19.99, 10)).to.equal(10);
  });
});
