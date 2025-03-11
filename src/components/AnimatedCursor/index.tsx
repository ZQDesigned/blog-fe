import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const CLICK_PARTICLES_COUNT = 8;

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
}

const ClickParticleEmoji = styled(motion.div)`
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  font-size: 24px;
  line-height: 1;
  transform-origin: center;
`;

const CLICK_EMOJIS = ['🎉', '🎨', '🎭', '🎪', '🎢', '🎡', '🎠', '🎮', '🎲', '🎯', '🎳', '🎸', '🎹', '🎺', '🎻'];

const getRandomEmoji = (emojis: string[]) => {
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const getRandomNumber = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const AnimatedCursor: React.FC = () => {
  const [clickParticles, setClickParticles] = useState<ClickParticle[]>([]);

  useEffect(() => {
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

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
    };
  }, []);

  return (
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
  );
};

export default AnimatedCursor;
