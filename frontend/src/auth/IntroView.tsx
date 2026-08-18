import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetallicCard3D } from '../components/3d/MetallicCard3D';

interface IntroViewProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onContinue, onSkip }) => {
  const [showParticles, setShowParticles] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowParticles(true), 150),
      setTimeout(() => setShowLogo(true), 700),
      setTimeout(() => setShowText(true), 1300),
      setTimeout(() => onContinue(), 3600),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onContinue]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] text-white">
      <button
        type="button"
        onClick={onSkip}
        className="absolute right-6 top-6 z-30 rounded-full border border-[#FFFFFF22] bg-[#121216]/80 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E8E8E8] backdrop-blur transition hover:border-[#E50914]/70 hover:text-white"
      >
        Skip
      </button>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(229,9,20,0.18),_rgba(13,10,12,0.32)_30%,_rgba(0,0,0,0.96)_72%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-80" style={{ background: 'radial-gradient(circle at 50% 41%, rgba(229,9,20,0.12), transparent 30%), linear-gradient(180deg, rgba(7,8,10,0.92) 0%, rgba(4,4,6,1) 100%)' }} />

      <AnimatePresence>
        {showParticles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="pointer-events-none absolute inset-0"
          >
            {Array.from({ length: 22 }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0.15, 0.7, 0.2], scale: [0.5, 1.1, 0.5] }}
                transition={{
                  duration: 2.8 + index * 0.2,
                  repeat: Infinity,
                  delay: index * 0.14,
                  ease: 'easeInOut',
                }}
                className="absolute block rounded-full bg-[#E50914]/90"
                style={{
                  width: `${8 + (index % 4) * 6}px`,
                  height: `${8 + (index % 4) * 6}px`,
                  left: `${(index * 11 + 7) % 100}%`,
                  top: `${(index * 17 + 12) % 82}%`,
                  boxShadow: '0 0 18px rgba(229,9,20,0.8), 0 0 30px rgba(229,9,20,0.45)',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-5 py-10 text-center">
        <div className="pointer-events-none absolute left-1/2 top-[22%] h-64 w-64 -translate-x-1/2 rounded-full bg-[#E50914]/10 blur-3xl" />

        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E50914]/55 bg-[#121216] text-2xl font-black text-[#E50914] shadow-[0_0_26px_rgba(229,9,20,0.45)]">
                S
              </div>
              <div className="text-4xl font-black tracking-[0.22em] text-white sm:text-5xl">SPENDR</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-4 space-y-4"
            >
              <div className="text-[11px] uppercase tracking-[0.32em] text-[#E7E7E8] sm:text-sm">
                KNOW WHERE YOUR MONEY GOES.
              </div>
              <div className="mx-auto h-px w-20 bg-[#E50914]/75" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2 }}
          className="relative mt-10 flex w-full items-center justify-center"
        >
          <div className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-[#E50914]/12 blur-3xl" />
          <MetallicCard3D className="h-[220px] w-[360px] sm:h-[260px] sm:w-[420px]" />
        </motion.div>
      </div>
    </div>
  );
};
