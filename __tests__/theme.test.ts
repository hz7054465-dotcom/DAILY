import { buildColors, darkColors, lightColors } from '@/constants/theme';

describe('theme', () => {
  it('uses the approved dark palette by default', () => {
    expect(buildColors(true, '#8B5CF6')).toEqual(darkColors);
  });

  it('only swaps the primary color for a custom accent', () => {
    const c = buildColors(true, '#3B82F6');
    expect(c.primary).toBe('#3B82F6');
    expect(c.background).toBe(darkColors.background);
  });

  it('light palette has a light background and dark text', () => {
    const c = buildColors(false, '#8B5CF6');
    expect(c.background).toBe(lightColors.background);
    expect(c.background).not.toBe(darkColors.background);
    expect(c.text).not.toBe(darkColors.text);
  });
});
