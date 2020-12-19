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
});
