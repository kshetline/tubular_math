import { expect } from 'chai';
import { Angle, convertFromRadians, convertToRadians, FMT_SECS, Unit } from './angle';

const epsilon = 1E-12;

describe('Angle', () => {
  it('should correctly convert radians to other units', () => {
    expect(Math.abs(convertFromRadians(Math.PI, Unit.DEGREES) - 180)).to.be.lessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI / 2, Unit.GRADS) - 100)).to.be.lessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI * 2, Unit.ROTATIONS) - 1)).to.be.lessThan(epsilon);
  });

  it('should correctly convert other angle units to radians', () => {
    expect(Math.abs(convertToRadians(180, Unit.DEGREES) - Math.PI)).to.be.lessThan(epsilon);
    expect(Math.abs(convertToRadians(100, Unit.GRADS) - Math.PI / 2)).to.be.lessThan(epsilon);
    expect(Math.abs(convertToRadians(1, Unit.ROTATIONS) - Math.PI * 2)).to.be.lessThan(epsilon);
  });

  it('should correctly format angles as strings', () => {
    expect(Angle.RIGHT.toHourString(null, 2)).to.equal('6.00h');
    expect(new Angle(42.75, Unit.DEGREES).toString(FMT_SECS)).to.equal('42°45\'00"');
  });
});
