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
const DIAMOND_SWORD_PIXELS: ReadonlyArray<readonly [number, number, string]> = [
  [2, 0, '#0e4036'],
  [1, 0, '#0e4036'],
  [0, 0, '#0e4036'],
  [3, 1, '#0e4036'],
  [2, 1, '#a4fdef'],
  [1, 1, '#a4fdef'],
  [0, 1, '#092e2f'],
  [4, 2, '#0e4036'],
  [3, 2, '#a4fdef'],
  [2, 2, '#2ac7ab'],
  [1, 2, '#a4fdef'],
  [0, 2, '#092e2f'],
  [5, 3, '#0e4036'],
  [4, 3, '#a4fdef'],
  [3, 3, '#2ac7ab'],
  [2, 3, '#a4fdef'],
  [1, 3, '#092e2f'],
  [6, 4, '#0e4036'],
  [5, 4, '#a4fdef'],
  [4, 4, '#2ac7ab'],
  [3, 4, '#32ebca'],
  [2, 4, '#092e2f'],
  [7, 5, '#0e4036'],
  [6, 5, '#a4fdef'],
  [5, 5, '#2ac7ab'],
  [4, 5, '#32ebca'],
  [3, 5, '#092e2f'],
  [13, 6, '#0e4036'],
  [12, 6, '#0e4036'],
  [8, 6, '#0e4036'],
  [7, 6, '#32ebca'],
  [6, 6, '#2ac7ab'],
  [5, 6, '#32ebca'],
  [4, 6, '#092e2f'],
  [13, 7, '#0e4036'],
  [12, 7, '#166355'],
  [11, 7, '#0e4036'],
  [9, 7, '#0e4036'],
  [8, 7, '#32ebca'],
  [7, 7, '#2ac7ab'],
  [6, 7, '#32ebca'],
  [5, 7, '#092e2f'],
  [12, 8, '#0e4036'],
  [11, 8, '#1e8a78'],
  [10, 8, '#092e2f'],
  [9, 8, '#32ebca'],
  [8, 8, '#1e8a78'],
  [7, 8, '#32ebca'],
  [6, 8, '#092e2f'],
  [12, 9, '#0e4036'],
  [11, 9, '#1e8a78'],
  [10, 9, '#1e8a78'],
  [9, 9, '#166355'],
  [8, 9, '#32ebca'],
  [7, 9, '#092e2f'],
  [11, 10, '#0e4036'],
  [10, 10, '#166355'],
  [9, 10, '#0e4036'],
  [8, 10, '#092e2f'],
  [12, 11, '#493616'],
  [11, 11, '#684e1e'],
  [10, 11, '#092e2f'],
  [9, 11, '#0e4036'],
  [8, 11, '#0e4036'],
  [7, 11, '#092e2f'],
  [13, 12, '#493616'],
  [12, 12, '#886727'],
  [11, 12, '#281d0a'],
  [9, 12, '#092e2f'],
  [8, 12, '#092e2f'],
  [7, 12, '#0e4036'],
  [6, 12, '#092e2f'],
  [15, 13, '#0e4036'],
  [14, 13, '#0e4036'],
  [13, 13, '#684e1e'],
  [12, 13, '#281d0a'],
  [7, 13, '#092e2f'],
  [6, 13, '#092e2f'],
  [15, 14, '#0e4036'],
  [14, 14, '#166355'],
  [13, 14, '#092e2f'],
  [15, 15, '#092e2f'],
  [14, 15, '#092e2f'],
  [13, 15, '#092e2f'],
] as const;

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
  background: var(--theme-custom-cursor-dot-background, var(--theme-component-cursor-dot-background));
  border: 1px solid var(--theme-custom-cursor-dot-border, var(--theme-component-cursor-dot-border));
  box-shadow: var(--theme-component-cursor-dot-shadow);
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
  border: var(--theme-cursor-ring-border-width) solid var(--theme-custom-cursor-ring-border, var(--theme-component-cursor-ring-border));
  background: var(--theme-custom-cursor-ring-background, var(--theme-component-cursor-ring-background));
  box-shadow: var(--theme-component-cursor-ring-shadow);
  opacity: 0;
  pointer-events: none;
  z-index: var(--theme-zindex-cursor);
  transform: translate(-50%, -50%);
  will-change: left, top, transform, opacity, border-color;
  transition: opacity var(--theme-motion-fast), border-color var(--theme-motion-fast);
`;

const CursorSword = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: calc(var(--theme-cursor-ring-size) * 1.4);
  height: calc(var(--theme-cursor-ring-size) * 1.4);
  opacity: 0;
  pointer-events: none;
  z-index: var(--theme-zindex-cursor);
  will-change: left, top, transform, opacity;
  transition: opacity var(--theme-motion-fast);
  filter: drop-shadow(0 3px 7px rgba(15, 23, 42, 0.26));
  image-rendering: pixelated;

  svg {
    display: block;
    width: 100%;
    height: 100%;
    shape-rendering: crispEdges;
  }
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
  const { enabled, active, isSupported, style } = useCursor();
  const { tokens } = useTheme();
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);

  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const swordRef = useRef<HTMLDivElement | null>(null);
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
      if (swordRef.current) {
        swordRef.current.style.opacity = '0';
      }
      return;
    }

    const renderFrame = () => {
      const dot = dotRef.current;
      const ring = ringRef.current;
      const sword = swordRef.current;
      const hasPointer = hasPointerRef.current;
      const isCursorVisible = isCursorVisibleRef.current && hasPointer;

      if (!dot || !ring) {
        if (style !== 'diamondSword') {
          rafIdRef.current = window.requestAnimationFrame(renderFrame);
          return;
        }
      }

      if (style === 'diamondSword' && !sword) {
        rafIdRef.current = window.requestAnimationFrame(renderFrame);
        return;
      }

      if (!isCursorVisible) {
        if (dot) {
          dot.style.opacity = '0';
        }
        if (ring) {
          ring.style.opacity = '0';
        }
        if (sword) {
          sword.style.opacity = '0';
        }
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

      if (style === 'diamondSword' && sword) {
        if (dot) {
          dot.style.opacity = '0';
        }
        if (ring) {
          ring.style.opacity = '0';
        }

        sword.style.left = `${target.x}px`;
        sword.style.top = `${target.y}px`;
        sword.style.transform = 'translate(0, -7%) scale(1)';
        sword.style.opacity = '1';
      } else if (dot && ring) {
        if (sword) {
          sword.style.opacity = '0';
        }
        dot.style.left = `${target.x}px`;
        dot.style.top = `${target.y}px`;
        dot.style.transform = `translate(-50%, -50%) scale(${dotScale})`;
        dot.style.opacity = '1';

        ring.style.left = `${ringPosition.x}px`;
        ring.style.top = `${ringPosition.y}px`;
        ring.style.transform = `translate(-50%, -50%) scale(${ringScale})`;
        ring.style.borderColor = active
          ? 'var(--theme-custom-cursor-ring-active-border, var(--theme-component-cursor-ring-active-border))'
          : isInteractiveRef.current
            ? 'var(--theme-custom-cursor-ring-hover-border, var(--theme-component-cursor-ring-hover-border))'
            : 'var(--theme-custom-cursor-ring-border, var(--theme-component-cursor-ring-border))';
        ring.style.opacity = '1';
      }

      rafIdRef.current = window.requestAnimationFrame(renderFrame);
    };

    rafIdRef.current = window.requestAnimationFrame(renderFrame);

    return () => {
      if (rafIdRef.current !== undefined) {
        window.cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [active, cursorDynamics, cursorEnabled, style]);

  if (!cursorEnabled) {
    return null;
  }

  return (
    <>
      <CursorDot ref={dotRef} />
      <CursorRing ref={ringRef} />
      <CursorSword ref={swordRef}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          {DIAMOND_SWORD_PIXELS.map(([x, y, fill]) => (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={fill} />
          ))}
        </svg>
      </CursorSword>
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
              ease: 'easeOut' as const,
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
