import React from 'react';

export function Logo() {
  return (
    <div
      role='img'
      aria-label='Coopagua'
      style={{
        width: 32,
        height: 32,
        backgroundColor: 'var(--foreground)',
        WebkitMaskImage: 'url(/img/pino.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: 'url(/img/pino.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );
}
