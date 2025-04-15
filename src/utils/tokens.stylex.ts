
// src/utils/tokens.stylex.ts
import { defineVars } from '@stylexjs/stylex';
import { colors as openPropsColors } from '@derekjwilliams/stylextras-open-props-pr/colors.stylex';
import { sizes as openPropsSizes } from '@derekjwilliams/stylextras-open-props-pr/sizes.stylex';
import { fonts as openPropsFonts } from '@derekjwilliams/stylextras-open-props-pr/fonts.stylex';
import { shadows as openPropsShadows } from '@derekjwilliams/stylextras-open-props-pr/shadows.stylex';

// Define your color tokens
export const colors = defineVars({
  // Core colors
  primary: openPropsColors.blue6,
  secondary: openPropsColors.purple6,
  accent: openPropsColors.orange6,

  // Text colors
  textPrimary: openPropsColors.gray9,
  textSecondary: openPropsColors.gray7,
  textInverse: openPropsColors.gray0,

  // Background colors
  backgroundPrimary: openPropsColors.gray0,
  backgroundSecondary: openPropsColors.gray1,
  backgroundTertiary: openPropsColors.gray2,

  // Status colors
  success: openPropsColors.green6,
  warning: openPropsColors.yellow6,
  error: openPropsColors.red6,
  info: openPropsColors.blue5,

  // Direct mappings for backward compatibility
  blue2: openPropsColors.blue2,
  blue6: openPropsColors.blue6,
  gray10: openPropsColors.gray10,
  // Add other mappings as needed
});

// Define your spacing tokens
export const spacing = defineVars({
  xs: openPropsSizes.spacing1,
  sm: openPropsSizes.spacing2,
  md: openPropsSizes.spacing3,
  lg: openPropsSizes.spacing4,
  xl: openPropsSizes.spacing5,

  // Direct mappings
  spacing1: openPropsSizes.spacing1,
  spacing2: openPropsSizes.spacing2,
  // Add other mappings as needed
});

// Define your typography tokens
export const typography = defineVars({
  fontSizeSmall: openPropsFonts.size2,
  fontSizeMedium: openPropsFonts.size3,
  fontSizeLarge: openPropsFonts.size4,

  fontWeightRegular: openPropsFonts.weight4,
  fontWeightMedium: openPropsFonts.weight5,
  fontWeightBold: openPropsFonts.weight7,

  // Direct mappings
  size3: openPropsFonts.size3,
  // Add other mappings as needed
});

// Define your elevation tokens
export const elevation = defineVars({
  low: openPropsShadows.shadow1,
  medium: openPropsShadows.shadow2,
  high: openPropsShadows.shadow3,

  // Direct mappings
  shadow1: openPropsShadows.shadow1,
  shadow2: openPropsShadows.shadow2,
  // Add other mappings as needed
});
