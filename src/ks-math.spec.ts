import * as M_ from './ks-math';
import { irandom, random } from './ks-math';

function inRange(low: number, value: number, high: number): boolean {
  return low <= value && value < high;
}

function inRangeInclusive(low: number, value: number, high: number): boolean {
  return low <= value && value <= high;
}

describe('ks-math', () => {
  it('should perform integer division, rounding down', () => {
    expect(M_.div_rd(5, 3)).toBe(1);
    expect(M_.div_rd(-5, 3)).toBe(-2);
  });

  it('should perform integer division, truncating toward 0', () => {
    expect(M_.div_tt0(5, 3)).toBe(1);
    expect(M_.div_tt0(-5, 3)).toBe(-1);
  });

  it('should create random numbers in correct ranges', () => {
    for (let i = 0; i < 50; ++i)
      expect(inRange(0, random(), 1)).toBeTruthy();

    for (let i = 0; i < 50; ++i)
      expect(inRange(0, random(77), 77)).toBeTruthy();

    for (let i = 0; i < 50; ++i)
      expect(inRange(-300, random(-300, 400), 400)).toBeTruthy();
  });

  it('should create random integers in correct ranges', () => {
    for (let i = 0; i < 50; ++i)
      expect(inRangeInclusive(1, irandom(10), 10)).toBeTruthy();

    for (let i = 0; i < 50; ++i)
      expect(inRangeInclusive(5, irandom(5, 15), 15)).toBeTruthy();
  });
});
