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
      else if (typeof Math[key] === 'number')
        expect(M_[key]).to.equal(Math[key]);
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

  it('acos_deg', () => {
    expect(M_.acos_deg(0)).to.equal(90);
    expect(M_.acos_deg(-1)).to.equal(180);
  });

  it('acot', () => {
    expect(M_.acot2(3, 4)).to.equal(0.9272952180016122);
  });

  it('acot2', () => {
    expect(M_.acot(0)).to.equal(M_.HALF_PI);
  });

  it('acot2_deg', () => {
    expect(M_.acot2_deg(3, 4)).to.equal(143.13010235415598);
  });

  it('acot_deg', () => {
    expect(M_.acot_deg(0)).to.equal(180);
  });

  it('asin_deg', () => {
    expect(M_.asin_deg(0)).to.equal(0);
    expect(M_.asin_deg(0.5)).to.approximately(30, 0.0001);
  });

  it('atan2_deg', () => {
    expect(M_.atan2_deg(3, 4)).to.equal(36.86989764584402);
  });

  it('atan_deg', () => {
    expect(M_.atan_deg(0)).to.equal(0);
    expect(M_.atan_deg(1)).to.equal(45);
  });

  it('cos_deg', () => {
    expect(M_.cos_deg(0)).to.equal(1);
    expect(M_.cos_deg(30)).to.equal(0.8660254037844387);
  });

  it('interpolate', () => {
    expect(M_.interpolate(4, 5, 4, 7, 8)).to.equal(7);
    expect(M_.interpolate(4, 5, 6, 7, 8)).to.equal(7.5);
  });

  it('interpolateModular', () => {
    expect(new Array(16).fill(0).map((_, i) => M_.interpolateModular(4, i - 8, 5, 14, -1, 8)))
      .to.deep.equal([2, 3, 4, 5, 6, 7, 0, 1, 2, 3, 4, 5, 6, 7, 0, 1]);
    expect(new Array(16).fill(0).map((_, i) => M_.interpolateModular(4, i - 8, 5, 6, 15, 8, true)))
      .to.deep.equal([2, 3, -4, -3, -2, -1, 0, 1, 2, 3, -4, -3, -2, -1, 0, 1]);
  });

  it('interpolateTabular', () => {
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], 1.5)).to.equal(3);
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], 1.5, 10)).to.equal(3);
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], 2, 10)).to.equal(4);
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], -10, 10)).to.equal(2);
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], 10, 10)).to.equal(6);
    expect(M_.interpolateTabular([1, 2, 3], [2, 4, 6], 1.5, 0.1)).to.equal(3);
  });

  it('intersects', () => {
    expect(M_.intersects({ x: 0, y: 0, w: 4, h: 3 }, { x: 1, y: -1, w: 3, h: 4 })).to.be.true;
  });

  it('limitNeg1to1', () => {
    expect(M_.limitNeg1to1(0)).to.equal(0);
    expect(M_.limitNeg1to1(1)).to.equal(1);
    expect(M_.limitNeg1to1(1.1)).to.equal(1);
    expect(M_.limitNeg1to1(1.00001)).to.equal(1);
    expect(M_.limitNeg1to1(-1.1)).to.equal(-1);
    expect(M_.limitNeg1to1(-1.00001)).to.equal(-1);
  });

  it('mod', () => {
    expect(M_.mod(33, 5)).to.equal(3);
  });

  it('mod2', () => {
    expect(M_.mod2(34, 5)).to.equal(-1);
  });

  it('signZN', () => {
    expect(M_.signZN(-1)).to.equal(-1);
    expect(M_.signZN(0)).to.equal(-1);
    expect(M_.signZN(1)).to.equal(1);
  });

  it('signZP', () => {
    expect(M_.signZP(-1)).to.equal(-1);
    expect(M_.signZP(0)).to.equal(1);
    expect(M_.signZP(1)).to.equal(1);
  });

  it('sin_deg', () => {
    expect(M_.sin_deg(0)).to.equal(0);
  });

  it('squared', () => {
    expect(M_.squared(3)).to.equal(9);
  });

  it('tan_deg', () => {
    expect(M_.tan_deg(0)).to.equal(0);
  });

  it('to_degree', () => {
    expect(M_.to_degree(0)).to.equal(0);
  });

  it('to_radian', () => {
    expect(M_.to_radian(0)).to.equal(0);
  });

  it('trunc', () => {
    expect(M_.trunc(0)).to.equal(0);
  });

  it('union', () => {
    expect(M_.union({ x: 0, y: 0, w: 4, h: 3 }, { x: 1, y: -1, w: 3, h: 4 })).to.deep.equal({ x: 0, y: -1, w: 4, h: 4 });
  });
});
