import * as stylex from '@stylexjs/stylex';
import { colors } from './tokens.stylex';
import { colors as openPropsColors } from '@derekjwilliams/stylextras-open-props-pr/colors.stylex';

// Light theme (default)
export const lightTheme = stylex.createTheme(colors, {
  // Core colors remain the same as defaults

  // Background colors
  backgroundPrimary: openPropsColors.gray0,
  backgroundSecondary: openPropsColors.gray1,
  backgroundTertiary: openPropsColors.gray2,

  // Text colors
  textPrimary: openPropsColors.gray9,
  textSecondary: openPropsColors.gray7,
});

// Dark theme
export const darkTheme = stylex.createTheme(colors, {
  // Core colors with adjusted brightness for dark mode
  primary: openPropsColors.blue5,
  secondary: openPropsColors.purple5,
  accent: openPropsColors.orange5,

  // Background colors
  backgroundPrimary: openPropsColors.gray9,
  backgroundSecondary: openPropsColors.gray8,
  backgroundTertiary: openPropsColors.gray7,

  // Text colors
  textPrimary: openPropsColors.gray0,
  textSecondary: openPropsColors.gray2,
  textInverse: openPropsColors.gray9,
});

// Brand theme example
export const brandTheme = stylex.createTheme(colors, {
  primary: '#ff0066', // Custom brand color
  secondary: '#6600cc',
  accent: '#00ccff',

  // Other colors adjusted for brand
  success: '#00cc66',
  warning: '#ffcc00',
  error: '#ff3300',
});
