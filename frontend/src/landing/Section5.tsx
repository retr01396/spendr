import React from 'react';
import { useScrollAnimation } from './useScrollAnimation';
import coinImage from '../assets/spendr-coin.png';

interface Section5Props {
  onEnterApp: () => void;
}

export const Section5: React.FC<Section5Props> = ({ onEnterApp }) => {
  const heading = useScrollAnimation(0.14);
  const coin = useScrollAnimation(0.1);
  const cta = useScrollAnimation(0.1);

  return (
    <section
      className="relative overflow-hidden px-6 py-36"
      aria-label="Your money, your control"
    >
      {/* Strong centered atmospheric glow for the finale */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(229,9,20,0.1) 0%, rgba(229,9,20,0.04) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center text-center">
        {/* Coin returns */}
        <div
          ref={coin.ref}
          className={`scroll-hidden relative mb-14 flex items-center justify-center ${coin.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '0ms' }}
          aria-hidden="true"
        >
          {/* Outer ambient glow */}
          <div
            className="coin-glow pointer-events-none absolute rounded-full"
            style={{
              width: '420px',
              height: '420px',
              background: 'radial-gradient(circle, rgba(229,9,20,0.2) 0%, rgba(229,9,20,0.06) 45%, transparent 70%)',
              filter: 'blur(36px)',
            }}
          />
          {/* Shadow */}
          <div
            className="pointer-events-none absolute bottom-[-20px] rounded-full"
            style={{
              width: '260px',
              height: '32px',
              background: 'radial-gradient(ellipse, rgba(229,9,20,0.18) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
              filter: 'blur(14px)',
            }}
          />
          {/* Coin */}
          <img
            src={coinImage}
            alt="SPENDR coin"
            className="coin-float relative z-10 select-none"
            style={{
              width: 'clamp(220px, 28vw, 360px)',
              height: 'clamp(220px, 28vw, 360px)',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 32px rgba(229,9,20,0.4)) drop-shadow(0 16px 48px rgba(0,0,0,0.8))',
              borderRadius: '50%',
            }}
            draggable={false}
          />
        </div>

        {/* Overline */}
        <div
          ref={heading.ref}
          className={`scroll-hidden mb-4 flex items-center gap-4 ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '80ms' }}
        >
          <div className="h-px w-8 bg-[#E50914]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#E50914]">
            Take Control
          </span>
          <div className="h-px w-8 bg-[#E50914]" />
        </div>

        {/* Headline */}
        <h2
          className={`scroll-hidden heading-metallic text-5xl font-black leading-[1.06] tracking-tight sm:text-6xl lg:text-7xl ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '140ms' }}
        >
          YOUR MONEY.
          <br />
          YOUR CONTROL.
        </h2>

        {/* Body */}
        <p
          className={`scroll-hidden mt-7 max-w-lg text-lg leading-relaxed text-[#8888A0] ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '200ms' }}
        >
          Stop guessing where your money goes. SPENDR gives you complete clarity over every
          subscription and recurring charge — all in one place.
        </p>

        {/* Red separator */}
        <div
          className={`scroll-hidden mt-8 ${heading.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '250ms' }}
        >
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-[#E50914] to-transparent" />
        </div>

        {/* Final CTA */}
        <div
          ref={cta.ref}
          className={`scroll-hidden mt-12 ${cta.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '320ms' }}
        >
          <button type="button" onClick={onEnterApp} className="cta-btn text-sm">
            JOIN SPENDR PRO FOR FREE
          </button>
        </div>

        {/* Fine print */}
        <p
          className={`scroll-hidden mt-6 text-[10px] uppercase tracking-[0.22em] text-[#333344] ${cta.isVisible ? 'scroll-visible' : ''}`}
          style={{ transitionDelay: '400ms' }}
        >
          No credit card required
        </p>
      </div>
    </section>
  );
};
