// src/components/theme/ThemeProvider.tsx

'use client';

import * as stylex from '@stylexjs/stylex';
import { lightTheme, darkTheme } from '../../utils/themes.stylex';
import { useState } from 'react';
import { colors as colors } from '@derekjwilliams/stylextras-open-props-pr/colors.stylex'
import { sizes as sizes } from '@derekjwilliams/stylextras-open-props-pr/sizes.stylex';
import { fonts } from '@derekjwilliams/stylextras-open-props-pr/fonts.stylex';
import { borders } from '@derekjwilliams/stylextras-open-props-pr/borders.stylex';
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div {...stylex.props(isDarkMode ? darkTheme : lightTheme)}>
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        {...stylex.props(styles.button)}
      >
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      {children}
    </div>
  );
}

const styles = stylex.create({
  button: {
    position: 'fixed',
    top: sizes.spacing3,
    right: sizes.spacing3,
    padding: `${sizes.spacing2} ${sizes.spacing3}`,
    borderRadius: borders.radius2,
    borderWidth: borders.size1,
    borderStyle: 'solid',
    borderColor: colors.gray7,
    backgroundColor: colors.gray7,
    color: colors.gray0,
    fontSize: fonts.size1,
    cursor: 'pointer',
    boxShadow: colors.gray8,
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    transitionTimingFunction: 'ease',
    ':hover': {
      backgroundColor: colors.gray5,
      boxShadow: colors.gray4,
    },
    ':active': {
      transform: 'scale(0.98)',
    },
  },
});
