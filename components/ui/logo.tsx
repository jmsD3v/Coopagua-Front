import React from 'react';

export function Logo() {
  return (
    <div
      role='img'
      aria-label='Coopagua'
      style={{
        width: 32,
        height: 32,
        backgroundColor: 'var(--background)',
        WebkitMaskImage: 'url(/img/pinoVerde.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: 'url(/img/pinoVerde.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );
}
