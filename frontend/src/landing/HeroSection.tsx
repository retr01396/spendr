import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import coinImage from '../assets/spendr-coin.png';

interface HeroSectionProps {
  onEnterApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onEnterApp }) => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);
    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const handleScroll = () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReduced]);

  /* Parallax offsets — very subtle */
  const coinParallax = prefersReduced ? 0 : scrollY * 0.18;
  const textParallax = prefersReduced ? 0 : scrollY * 0.07;

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-24"
      aria-label="Hero"
    >
      {/* ── Background atmosphere ── */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 42%, rgba(229,9,20,0.13) 0%, rgba(100,0,0,0.07) 38%, transparent 72%), #050507',
        }}
      />
      {/* Deep red vignette bottom */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: 'linear-gradient(to top, rgba(229,9,20,0.04), transparent)',
        }}
      />

      {/* ── Particles ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute block rounded-full"
            style={{
              width: `${4 + (i % 3) * 4}px`,
              height: `${4 + (i % 3) * 4}px`,
              left: `${(i * 13 + 5) % 100}%`,
              top: `${(i * 19 + 8) % 90}%`,
              background: 'rgba(229,9,20,0.7)',
              boxShadow: '0 0 10px rgba(229,9,20,0.6)',
              animation: `particleDrift ${7 + i * 0.6}s ease-in-out ${i * 0.4}s infinite`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* ── Main content wrapper ── */}
      <div
        className="relative z-10 flex w-full max-w-7xl flex-col items-center"
        style={{ transform: `translateY(${-textParallax}px)` }}
      >
        {/* SPENDR wordmark entrance */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="mb-6 flex items-center gap-3"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl font-black text-xl"
            style={{
              border: '1px solid rgba(229,9,20,0.55)',
              background: '#0A0A0C',
              color: '#E50914',
              boxShadow: '0 0 22px rgba(229,9,20,0.4)',
            }}
          >
            S
          </div>
          <span
            className="text-2xl font-black tracking-[0.3em] text-white sm:text-3xl"
          >
            SPENDR
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
          className="heading-metallic text-center text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
        >
          KNOW WHERE YOUR
          <br />
          <span className="text-white">MONEY GOES.</span>
        </motion.h1>

        {/* Supporting text */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.65 }}
          className="mt-6 max-w-xl text-center text-base leading-relaxed text-[#8888A0] sm:text-lg"
        >
          Take control of your subscriptions, spending, and recurring expenses with SPENDR.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          className="mt-10"
        >
          <button type="button" onClick={onEnterApp} className="cta-btn">
            JOIN SPENDR PRO FOR FREE
          </button>
        </motion.div>

        {/* Coin hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          className="relative mt-16 flex items-center justify-center"
          style={{ transform: `translateY(${coinParallax}px)` }}
          aria-hidden="true"
        >
          {/* Outer ambient glow */}
          <div
            className="coin-glow pointer-events-none absolute rounded-full"
            style={{
              width: '520px',
              height: '520px',
              background: 'radial-gradient(circle, rgba(229,9,20,0.22) 0%, rgba(229,9,20,0.08) 40%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: 0,
            }}
          />
          {/* Inner tighter glow */}
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: '340px',
              height: '340px',
              background: 'radial-gradient(circle, rgba(229,9,20,0.18) 0%, transparent 65%)',
              filter: 'blur(20px)',
              zIndex: 0,
            }}
          />

          {/* Coin shadow beneath */}
          <div
            className="pointer-events-none absolute bottom-[-28px] rounded-full"
            style={{
              width: '320px',
              height: '40px',
              background: 'radial-gradient(ellipse, rgba(229,9,20,0.2) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
              filter: 'blur(18px)',
            }}
          />

          {/* The coin */}
          <img
            src={coinImage}
            alt="SPENDR coin — Know Where Your Money Goes"
            className="coin-float relative z-10 select-none"
            style={{
              width: 'clamp(280px, 40vw, 480px)',
              height: 'clamp(280px, 40vw, 480px)',
              objectFit: 'contain',
              objectPosition: 'center',
              filter: 'drop-shadow(0 0 40px rgba(229,9,20,0.45)) drop-shadow(0 20px 60px rgba(0,0,0,0.85))',
              borderRadius: '50%',
            }}
            draggable={false}
          />

          {/* Top specular highlight on coin */}
          <div
            className="pointer-events-none absolute top-[12%] left-[22%] rounded-full"
            style={{
              width: '28%',
              height: '12%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.16) 0%, transparent 80%)',
              filter: 'blur(6px)',
              zIndex: 20,
            }}
          />
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="mt-12 mb-4 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#444454]">Scroll</span>
          <div className="flex flex-col gap-[3px] items-center">
            <div
              className="h-[6px] w-[1px] rounded-full bg-[#E50914]"
              style={{ animation: 'glowPulse 1.6s ease-in-out 0s infinite' }}
            />
            <div
              className="h-[6px] w-[1px] rounded-full bg-[#E50914]"
              style={{ animation: 'glowPulse 1.6s ease-in-out 0.2s infinite' }}
            />
            <div
              className="h-[6px] w-[1px] rounded-full bg-[#E50914]/40"
              style={{ animation: 'glowPulse 1.6s ease-in-out 0.4s infinite' }}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
