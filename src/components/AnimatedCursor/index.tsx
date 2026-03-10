import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useCursor } from '../../cursor';
import { useTheme } from '../../theme';

const INTERACTIVE_SELECTOR = [
  'a',
  'button',
  '[role="button"]',
  'input',
  'textarea',
  'select',
  'label',
  '.ant-btn',
  '.ant-menu-item',
  '[data-cursor="interactive"]',
].join(', ');

const CLICK_EMOJIS = ['🎉', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎮', '🎲', '🎯', '🎳', '🎸', '🎹', '🎺', '🎻'] as const;

interface Position {
  x: number;
  y: number;
}

interface ClickParticle extends Position {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  scale: number;
  durationSeconds: number;
}

const CursorDot = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: var(--theme-cursor-dot-size);
  height: var(--theme-cursor-dot-size);
  border-radius: 50%;
  background: var(--theme-component-cursor-dot-background);
  opacity: 0;
  pointer-events: none;
  z-index: var(--theme-zindex-cursor);
  transform: translate(-50%, -50%);
  will-change: left, top, transform, opacity;
  transition: opacity var(--theme-motion-fast);
`;

const CursorRing = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: var(--theme-cursor-ring-size);
  height: var(--theme-cursor-ring-size);
  border-radius: 50%;
  border: var(--theme-cursor-ring-border-width) solid var(--theme-component-cursor-ring-border);
  opacity: 0;
  pointer-events: none;
  z-index: var(--theme-zindex-cursor);
  transform: translate(-50%, -50%);
  will-change: left, top, transform, opacity, border-color;
  transition: opacity var(--theme-motion-fast), border-color var(--theme-motion-fast);
`;

const ClickParticleEmoji = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: var(--theme-zindex-cursor);
  font-size: var(--theme-cursor-particle-size);
  line-height: 1;
  transform-origin: center;
`;

const getRandomEmoji = (emojis: readonly string[]) => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

const AnimatedCursor: React.FC = () => {
  const { enabled, active, isSupported } = useCursor();
  const { tokens } = useTheme();
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const rafIdRef = useRef<number>();
  const clearParticlesTimerRef = useRef<number>();
  const targetPositionRef = useRef<Position>({ x: 0, y: 0 });
  const ringPositionRef = useRef<Position>({ x: 0, y: 0 });
  const hasPointerRef = useRef(false);
  const isCursorVisibleRef = useRef(false);
  const isInteractiveRef = useRef(false);

  const cursorEnabled = enabled && isSupported;
  const cursorDynamics = useMemo(() => {
    const { cursor } = tokens;
    const followEase = clamp(cursor.followEase, 0.05, 1);
    const hoverScale = Math.max(cursor.hoverScale, 1);
    const activeScale = clamp(cursor.activeScale, 0.4, 1);
    const dotActiveScale = Math.max(cursor.dotActiveScale, 1);
    const clickParticles = Math.max(0, Math.floor(cursor.clickParticles));
    const clickParticleMinDistance = Math.max(0, cursor.clickParticleMinDistance);
    const clickParticleMaxDistance = Math.max(clickParticleMinDistance, cursor.clickParticleMaxDistance);
    const clickParticleDurationMs = Math.max(120, cursor.clickParticleDurationMs);

    return {
      followEase,
      hoverScale,
      activeScale,
      dotActiveScale,
      clickParticles,
      clickParticleMinDistance,
      clickParticleMaxDistance,
      clickParticleDurationMs,
    };
  }, [tokens]);

  useEffect(() => {
    return () => {
      if (clearParticlesTimerRef.current !== undefined) {
        window.clearTimeout(clearParticlesTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!cursorEnabled) {
      hasPointerRef.current = false;
      isCursorVisibleRef.current = false;
      isInteractiveRef.current = false;
      setClickParticles([]);
    }
  }, [cursorEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined' || !cursorEnabled) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== 'mouse') {
        return;
      }

      const { clientX, clientY } = event;
      targetPositionRef.current = { x: clientX, y: clientY };

      if (!hasPointerRef.current) {
        ringPositionRef.current = { x: clientX, y: clientY };
        hasPointerRef.current = true;
      }

      isCursorVisibleRef.current = true;
      const eventTarget =
        event.target instanceof Element
          ? event.target
          : document.elementFromPoint(clientX, clientY);
      isInteractiveRef.current = Boolean(
        eventTarget?.closest(INTERACTIVE_SELECTOR),
      );
    };

    const handlePointerLeave = () => {
      isCursorVisibleRef.current = false;
      isInteractiveRef.current = false;
    };

    const handleBlur = () => {
      isCursorVisibleRef.current = false;
      isInteractiveRef.current = false;
    };

    const handleClick = (event: MouseEvent) => {
      if (!isCursorVisibleRef.current || cursorDynamics.clickParticles === 0) {
        return;
      }

      const particles: ClickParticle[] = [];

      for (let index = 0; index < cursorDynamics.clickParticles; index += 1) {
        particles.push({
          id: Date.now() + index + Math.random(),
          x: event.clientX,
          y: event.clientY,
          emoji: getRandomEmoji(CLICK_EMOJIS),
          angle: getRandomNumber(0, 360),
          distance: getRandomNumber(
            cursorDynamics.clickParticleMinDistance,
            cursorDynamics.clickParticleMaxDistance,
          ),
          scale: getRandomNumber(0.8, 1.2),
          durationSeconds: getRandomNumber(
            cursorDynamics.clickParticleDurationMs * 0.0007,
            cursorDynamics.clickParticleDurationMs * 0.0012,
          ),
        });
      }

      setClickParticles(particles);
      if (clearParticlesTimerRef.current !== undefined) {
        window.clearTimeout(clearParticlesTimerRef.current);
      }

      clearParticlesTimerRef.current = window.setTimeout(() => {
        setClickParticles([]);
      }, cursorDynamics.clickParticleDurationMs);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('click', handleClick);
    };
  }, [cursorDynamics, cursorEnabled]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!cursorEnabled) {
      if (dotRef.current) {
        dotRef.current.style.opacity = '0';
      }
      if (ringRef.current) {
        ringRef.current.style.opacity = '0';
      }
      return;
    }

    const renderFrame = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const hasPointer = hasPointerRef.current;
      const isCursorVisible = isCursorVisibleRef.current && hasPointer;

      if (!dot || !ring) {
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
        return;
      }

      if (!isCursorVisible) {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
        return;
      }

      const target = targetPositionRef.current;
      const ringPosition = ringPositionRef.current;
      ringPosition.x += (target.x - ringPosition.x) * cursorDynamics.followEase;
      ringPosition.y += (target.y - ringPosition.y) * cursorDynamics.followEase;

      const ringScale = active
        ? cursorDynamics.activeScale
        : isInteractiveRef.current
          ? cursorDynamics.hoverScale
          : 1;
      const dotScale = active ? cursorDynamics.dotActiveScale : 1;

      dot.style.left = `${target.x}px`;
      dot.style.top = `${target.y}px`;
      dot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
      dot.style.opacity = '1';

      ring.style.left = `${ringPosition.x}px`;
      ring.style.top = `${ringPosition.y}px`;
      ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
      ring.style.borderColor = active
        ? 'var(--theme-component-cursor-ring-active-border)'
        : isInteractiveRef.current
          ? 'var(--theme-component-cursor-ring-hover-border)'
          : 'var(--theme-component-cursor-ring-border)';
      ring.style.opacity = '1';

      rafIdRef.current = window.requestAnimationFrame(renderFrame);
    };

    rafIdRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      if (rafIdRef.current !== undefined) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [active, cursorDynamics, cursorEnabled]);

  if (!cursorEnabled) {
    return null;
  }

  return (
    <>
      <CursorDot ref={dotRef} />
      <CursorRing ref={ringRef} />
      <AnimatePresence>
        {clickParticles.map((particle) => (
          <ClickParticleEmoji
            key={particle.id}
            initial={{
              opacity: 1,
              scale: particle.scale,
              x: particle.x,
              y: particle.y,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 0,
              x:
                particle.x +
                Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
              y:
                particle.y +
                Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
              rotate: getRandomNumber(-180, 180),
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: particle.durationSeconds,
              ease: 'easeOut',
            }}
          >
            {particle.emoji}
          </ClickParticleEmoji>
        ))}
      </AnimatePresence>
    </>
  );
};

export default AnimatedCursor;
