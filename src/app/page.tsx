'use client';

import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  redText: {
    color: 'red',
    fontSize: '24px',
  },
});

export default function Home() {
  return (
    <div className="bg-blue-100 p-4">
      <p className="text-lg text-red-700">Tailwind is working</p>
      <p {...stylex.props(styles.redText)}>StyleX is working</p>
    </div>
  );
}
