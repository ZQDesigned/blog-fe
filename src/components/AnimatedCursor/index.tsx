import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const TRAIL_LENGTH = 10;
const TRAIL_FADE_TIME = 0.5;
const CLICK_PARTICLES_COUNT = 8;

interface Position {
  x: number;
  y: number;
}

interface TrailDot extends Position {
  id: number;
}

interface ClickParticle extends Position {
  id: number;
  emoji: string;
  angle: number;
  distance: number;
  scale: number;
}

const TrailEmoji = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 20px;
  line-height: 1;
  transform-origin: center;
`;

const ClickParticleEmoji = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 24px;
  line-height: 1;
  transform-origin: center;
`;

const EMOJIS = ['✨', '⭐️', '🌟'];
const CLICK_EMOJIS = ['🎉', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎮', '🎲', '🎯', '🎳', '🎸', '🎹', '🎺', '🎻'];

const getRandomEmoji = (emojis: string[]) => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const AnimatedCursor: React.FC = () => {
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);
  const [, setMousePosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    let timeoutId: number;
    let lastTrailId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // 添加新的轨迹点
      setTrail(prevTrail => {
        const newDot = {
          id: lastTrailId++,
          x: e.clientX,
          y: e.clientY,
        };
        const updatedTrail = [...prevTrail, newDot];
        if (updatedTrail.length > TRAIL_LENGTH) {
          updatedTrail.shift();
        }
        return updatedTrail;
      });

      // 清除之前的定时器
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }

      // 设置新的定时器来清除轨迹
      timeoutId = window.setTimeout(() => {
        setTrail([]);
      }, TRAIL_FADE_TIME * 1000);
    };

    const handleClick = (e: MouseEvent) => {
      const particles: ClickParticle[] = [];
      for (let i = 0; i < CLICK_PARTICLES_COUNT; i++) {
        particles.push({
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          emoji: getRandomEmoji(CLICK_EMOJIS),
          angle: getRandomNumber(0, 360),
          distance: getRandomNumber(80, 150),
          scale: getRandomNumber(0.8, 1.2),
        });
      }
      setClickParticles(particles);

      // 清除粒子效果
      setTimeout(() => {
        setClickParticles([]);
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {trail.map((dot) => (
          <TrailEmoji
            key={dot.id}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: TRAIL_FADE_TIME }}
            style={{
              left: dot.x - 10,
              top: dot.y - 10,
            }}
          >
            {getRandomEmoji(EMOJIS)}
          </TrailEmoji>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {clickParticles.map((particle) => (
          <ClickParticleEmoji
            key={particle.id}
            initial={{
              opacity: 1,
              scale: particle.scale,
              x: particle.x - 12,
              y: particle.y - 12,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              scale: 0,
              x: particle.x - 12 + Math.cos(particle.angle * Math.PI / 180) * particle.distance,
              y: particle.y - 12 + Math.sin(particle.angle * Math.PI / 180) * particle.distance,
              rotate: getRandomNumber(-180, 180),
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: getRandomNumber(0.6, 1),
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
