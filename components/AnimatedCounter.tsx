'use client';

import React, { useState, useEffect } from 'react';

type AnimatedCounterProps = {
  target: number;
};

export const AnimatedCounter = ({ target }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count < target) {
      const timer = setTimeout(() => {
        setCount(Math.min(count + 150, target));
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [count, target]);

  return <span className='text-[#4caf50]'>{count.toLocaleString()}</span>;
};
