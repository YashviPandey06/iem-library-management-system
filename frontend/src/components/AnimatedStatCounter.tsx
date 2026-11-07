import React, { useEffect, useState, useRef } from 'react';

interface AnimatedStatCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  durationMs?: number;
  className?: string;
}

export const AnimatedStatCounter: React.FC<AnimatedStatCounterProps> = ({
  value,
  suffix = '',
  prefix = '',
  durationMs = 800,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);

  useEffect(() => {
    // If IntersectionObserver is not available or element is in viewport, trigger immediately
    if (typeof IntersectionObserver === 'undefined') {
      setHasAnimated(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
        }
      },
      { threshold: 0.05 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    // Safety fallback: if after 400ms it hasn't triggered, start animating
    const timer = setTimeout(() => {
      setHasAnimated(true);
    }, 400);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const easedProgress = easeOutCubic(progress);

      const current = Math.floor(easedProgress * value);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasAnimated, value, durationMs]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};
