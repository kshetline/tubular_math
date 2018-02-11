import { MinMaxFinder } from './min-max-finder';

const epsilon = 1E-10;

describe('MinMaxFinder', () => {
  it('should correctly find the minimum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, -3, -1.5, 0);
    expect(Math.abs(mmf.getXAtMinMax() + Math.PI / 2)).toBeLessThan(epsilon);
    expect(mmf.foundMinimum).toBeTruthy();
    expect(Math.abs(mmf.lastY + 1)).toBeLessThan(epsilon);
  });

  it('should correctly find the maximum of a function', () => {
    const mmf = new MinMaxFinder(Math.sin, epsilon / 100, 50, 0, 1.5, 3);
    expect(Math.abs(mmf.getXAtMinMax() - Math.PI / 2 )).toBeLessThan(epsilon);
    expect(mmf.foundMaximum).toBeTruthy();
    expect(Math.abs(mmf.lastY - 1)).toBeLessThan(epsilon);
  });
});
