'use client';

import * as stylex from '@stylexjs/stylex';
import { colors, spacing, typography } from '../utils/tokens.stylex';

const styles = stylex.create({
  button: {
    padding: `${spacing.xs} ${spacing.md}`,
    fontSize: typography.fontSizeMedium,
    backgroundColor: colors.primary,
    color: colors.textInverse,
    border: 'none',
    borderRadius: spacing.sm,
    cursor: 'pointer',
  },
});

export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button {...stylex.props(styles.button)} onClick={onClick}>
      {children}
    </button>
  );
}
// export function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
//   return (
//     <button {...stylex.props(styles.base)} onClick={onClick}>
//       {children}
//     </button>
//   );
// }
