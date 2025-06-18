import { expect } from 'chai';
import { Angle, convertFromRadians, convertToRadians, FMT_SECS, Mode, Unit } from './angle';
import { HALF_PI, PI, TWO_PI } from './math';

const ALL_UNITS = Object.values(Unit).filter(v => typeof v === 'number') as Unit[];
const epsilon = 1E-12;

describe('Angle', () => {
  it('should create Angle instances', () => {
    expect(new Angle().radians).to.equal(0);
    expect(new Angle(444, Unit.DEGREES, Mode.RANGE_UNLIMITED).degrees).to.equal(444);
  });

  it('should return basic unit conversions', () => {
    expect(Angle.RIGHT.arcMinutes).to.approximately(5400, epsilon);
    expect(Angle.RIGHT.arcSeconds).to.approximately(324000, epsilon);
    expect(Angle.RIGHT.degrees).to.equal(90);
    expect(Angle.RIGHT.grads).to.equal(100);
    expect(Angle.RIGHT.hours).to.equal(6);
    expect(Angle.RIGHT.radians).to.equal(HALF_PI);
    expect(Angle.RIGHT.rotations).to.equal(0.25);
  });

  it('should correctly convert radians to other units', () => {
    expect(Math.abs(convertFromRadians(Math.PI, Unit.DEGREES) - 180)).to.be.lessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI / 2, Unit.GRADS) - 100)).to.be.lessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI * 2, Unit.ROTATIONS) - 1)).to.be.lessThan(epsilon);
    expect(Math.abs(convertFromRadians(0, -1 as Unit) - 1)).to.be.NaN;

    expect(ALL_UNITS.map(u => convertFromRadians(Math.PI, u))
      .map(v => Math.round(v * 10000) / 10000))
      .to.deep.equal([3.1416, 180, 10800, 648000, 12, 720, 43200, 0.5, 200]);

    expect(ALL_UNITS.map(u => u === Unit.RADIANS ? -Angle.STRAIGHT.getAngle() : -Angle.STRAIGHT.getAngle(u))
      .map(v => Math.round(v * 10000) / 10000))
      .to.deep.equal([3.1416, 180, 10800, 648000, 12, 720, 43200, 0.5, 200]);
  });

  it('should generate Angle values from static arc functions', () => {
    const staticFunctions = Object.getOwnPropertyNames(Angle)
      .filter(prop => !prop.startsWith('to') && typeof Angle[prop] === 'function');

    staticFunctions.forEach(func => {
      const nonNeg = func.endsWith('_nonneg');
      const func2 = nonNeg ? func.slice(0, -7) : func;

      for (let x = -TWO_PI; x <= TWO_PI; x += PI / 8) {
        const rads = Angle[func](x).radians;
        let ref = Math[func2](x);

        if (nonNeg && ref < 0)
          ref += TWO_PI;

        if (isNaN(rads))
          expect(ref).to.be.NaN;
        else
          expect(rads).to.approximately(ref, epsilon);
      }
    });
  });

  it('should correctly convert other angle units to radians', () => {
    expect(Math.abs(convertToRadians(180, Unit.DEGREES) - Math.PI)).to.be.lessThan(epsilon);
    expect(Math.abs(convertToRadians(100, Unit.GRADS) - Math.PI / 2)).to.be.lessThan(epsilon);
    expect(Math.abs(convertToRadians(1, Unit.ROTATIONS) - Math.PI * 2)).to.be.lessThan(epsilon);
    expect(Math.abs(convertToRadians(0, -1 as Unit) - 1)).to.be.NaN;

    expect(ALL_UNITS.map(u => convertToRadians(1, u))
      .map(v => Math.round(v * 1000000) / 1000000))
      .to.deep.equal([1, 0.017453, 0.000291, 0.000005, 0.261799, 0.004363, 0.000073, 6.283185, 0.015708]);
  });

  it('sin', () => {
    expect(Angle.RIGHT.sin).to.equal(1);
  });

  it('cos', () => {
    expect(Angle.RIGHT.cos).to.approximately(0, epsilon);
  });

  it('tan', () => {
    expect(Angle.ZERO.tan).to.equal(0);
    expect(Angle.RIGHT.tan).to.be.greaterThan(1E12);
  });

  it('add', () => {
    expect(Angle.RIGHT.add(new Angle(45, Unit.DEGREES)).degrees).to.equal(135);
  });

  it('add_nonneg', () => {
    expect(Angle.RIGHT.add_nonneg(Angle.STRAIGHT.negate()).degrees).to.equal(270);
  });

  it('subtract', () => {
    expect(Angle.RIGHT.subtract(Angle.STRAIGHT).degrees).to.equal(-90);
  });

  it('subtract_nonneg', () => {
    expect(Angle.RIGHT.subtract_nonneg(Angle.STRAIGHT).degrees).to.equal(270);
  });

  it('complement', () => {
    expect(new Angle(30, Unit.DEGREES).complement().degrees).to.approximately(60, epsilon);
  });

  it('complement_nonneg', () => {
    expect(new Angle(100, Unit.DEGREES).complement_nonneg().degrees).to.approximately(350, epsilon);
  });

  it('supplement', () => {
    expect(Angle.RIGHT.supplement().grads).to.equal(100);
  });

  it('supplement_nonneg', () => {
    expect(Angle.RIGHT.negate().supplement_nonneg().grads).to.equal(300);
  });

  it('opposite', () => {
    expect(Angle.RIGHT.opposite().hours).to.equal(-6);
  });

  it('opposite_nonneg', () => {
    expect(Angle.RIGHT.opposite_nonneg().hours).to.equal(18);
  });

  it('negate', () => {
    expect(new Angle(30, Unit.DEGREES).negate().degrees).to.approximately(-30, epsilon);
  });

  it('negate_nonneg', () => {
    expect(new Angle(30, Unit.DEGREES).negate_nonneg().degrees).to.approximately(330, epsilon);
  });

  it('multiply', () => {
    expect(Angle.RIGHT.multiply(3).degrees).to.equal(-90);
  });

  it('multiply_nonneg', () => {
    expect(Angle.RIGHT.multiply_nonneg(3).degrees).to.equal(270);
  });

  it('divide', () => {
    expect(Angle.RIGHT.divide(-3).degrees).to.approximately(-30, epsilon);
  });

  it('divide_nonneg', () => {
    expect(Angle.RIGHT.divide_nonneg(-3).degrees).to.approximately(330, epsilon);
  });

  it('should correctly format angles as strings', () => {
    expect(Angle.RIGHT.toHourString(null, 2)).to.equal('6.00h');
    expect(new Angle(42.75, Unit.DEGREES).toString(FMT_SECS)).to.equal('42°45\'00"');
  });
});
