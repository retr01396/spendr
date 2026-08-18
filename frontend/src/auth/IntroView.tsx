import React from 'react';
import { LandingPage } from '../landing/LandingPage';

interface IntroViewProps {
  onContinue: () => void;
  onSkip: () => void;
}

/**
 * IntroView — entry point from App.tsx.
 *
 * Props are preserved exactly so App.tsx requires zero changes:
 *   onContinue  →  called when user clicks any CTA ("JOIN SPENDR PRO FOR FREE")
 *   onSkip      →  also wired to enter the app (same destination as onContinue)
 *
 * Both callbacks advance the AuthGate screen to 'login' (existing behaviour).
 */
export const IntroView: React.FC<IntroViewProps> = ({ onContinue }) => {
  return <LandingPage onEnterApp={onContinue} />;
};
