import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <div
      role='img'
      aria-label='Coopagua'
      className={cn('bg-green-800', className)}
      style={{
        width: 32,
        height: 32,
        backgroundColor: 'var(--background)',
        WebkitMaskImage: 'url(/img/pino.svg)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: 'url(/img/pino.svg)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  );
}
