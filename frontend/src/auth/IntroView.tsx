import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="min-h-screen bg-[#000000] text-white relative overflow-hidden flex items-center justify-center">
      <button
        type="button"
        onClick={onSkip}
        className="absolute top-6 right-6 z-20 rounded-full border border-[#FFFFFF33] bg-[#121216]/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#E0E0E0] transition hover:border-[#E50914]/60 hover:text-white"
      >
        Skip
      </button>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(229,9,20,0.14),_transparent_55%)]" />

      <AnimatePresence>
        {showParticles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 18 }).map((_, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0.2, 0.65, 0.2], scale: [0.5, 1, 0.5] }}
                transition={{
                  duration: 2.5 + index * 0.2,
                  repeat: Infinity,
                  delay: index * 0.12,
                  ease: 'easeInOut',
                }}
                className="absolute block rounded-full bg-[#E50914]/80"
                style={{
                  width: `${8 + (index % 4) * 6}px`,
                  height: `${8 + (index % 4) * 6}px`,
                  left: `${(index * 13) % 100}%`,
                  top: `${(index * 17) % 80}%`,
                  boxShadow: '0 0 18px rgba(229,9,20,0.8)',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center">
        <AnimatePresence>
          {showLogo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.86, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E50914]/50 bg-[#121216] text-2xl font-black text-[#E50914] shadow-[0_0_25px_rgba(229,9,20,0.5)]">
                S
              </div>
              <div className="text-5xl font-black tracking-[0.22em] text-white">SPENDR</div>
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
              className="space-y-4"
            >
              <div className="text-xl uppercase tracking-[0.18em] text-[#E0E0E0]">Know where your money goes.</div>
              <div className="mx-auto h-px w-24 bg-[#E50914]/70" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="relative mt-8 h-48 w-[340px] rounded-[28px] border border-[#FFFFFF1A] bg-[#121216] shadow-[0_25px_60px_rgba(0,0,0,0.9)]"
        >
          <div className="absolute inset-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.015),rgba(229,9,20,0.18))]" />
          <div className="absolute left-6 top-6 h-20 w-20 rounded-2xl border border-[#FFFFFF1A] bg-[#0A0A0C]" />
          <div className="absolute right-10 top-10 h-24 w-24 rounded-full border border-[#E50914]/40 bg-[#1A1A22]" />
          <div className="absolute inset-x-8 bottom-7 h-16 rounded-lg border border-[#FFFFFF1A] bg-[#0A0A0C]" />
        </motion.div>
      </div>
    </div>
  );
};
