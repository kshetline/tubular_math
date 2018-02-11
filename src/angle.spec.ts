import { Angle, convertFromRadians, convertToRadians, FMT_SECS, Unit } from './angle';

const epsilon = 1E-12;

describe('Angle', () => {
  it('should correctly convert radians to other units', () => {
    expect(Math.abs(convertFromRadians(Math.PI, Unit.DEGREES) - 180)).toBeLessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI / 2, Unit.GRADS) - 100)).toBeLessThan(epsilon);
    expect(Math.abs(convertFromRadians(Math.PI * 2, Unit.ROTATIONS) - 1)).toBeLessThan(epsilon);
  });

  it('should correctly convert other angle units to radians', () => {
    expect(Math.abs(convertToRadians(180, Unit.DEGREES) - Math.PI)).toBeLessThan(epsilon);
    expect(Math.abs(convertToRadians(100, Unit.GRADS) - Math.PI / 2)).toBeLessThan(epsilon);
    expect(Math.abs(convertToRadians(1, Unit.ROTATIONS) - Math.PI * 2)).toBeLessThan(epsilon);
  });

  it('should correctly format angles as strings', () => {
    expect(Angle.RIGHT.toHourString(null, 2)).toEqual('6.00h');
    expect(new Angle(42.75, Unit.DEGREES).toString(FMT_SECS)).toEqual('42°45\'00"');
  });
});
