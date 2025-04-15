'use client';

import { Button } from '@/components/Button';
import * as stylex from '@stylexjs/stylex';

const pageStyles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--size-3)',
    padding: 'var(--size-4)',
    fontFamily: 'system-ui, sans-serif',
  },
  heading: {
    fontSize: 'var(--font-size-4)',
    color: 'var(--color-indigo-7)',
  },
});

export default function TestPage() {
  return (
    <div {...stylex.props(pageStyles.container)}>
      <h1 {...stylex.props(pageStyles.heading)}>Test Page</h1>
      <Button onClick={() => alert('StyleX works!')}>Click Me</Button>
    </div>
  );
}
