import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ViewType } from '../../types/subscription';

interface PageTransitionProps {
  activeView: ViewType;
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ activeView, children }) => {
  const [displayedTitle, setDisplayedTitle] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Trigger brief RED page title flash (< 250ms)
    const viewNameMap: Record<ViewType, string> = {
      dashboard: 'OVERVIEW',
      subscriptions: 'SUBSCRIPTIONS',
      analytics: 'ANALYTICS',
      calendar: 'BILLING CALENDAR',
      settings: 'SETTINGS',
    };

    setDisplayedTitle(viewNameMap[activeView]);

    const timer = setTimeout(() => {
      setDisplayedTitle(null);
    }, 220); // strictly < 250ms flash

    return () => clearTimeout(timer);
  }, [activeView]);

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Temporary RED Page Title Overlay (< 250ms) */}
      <AnimatePresence>
        {displayedTitle && (
          <motion.div
            key={displayedTitle}
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(6px)' }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <h1 className="text-3xl sm:text-5xl font-black tracking-[0.2em] text-[#E50914] drop-shadow-[0_0_25px_rgba(229,9,20,0.8)] font-mono uppercase">
              {displayedTitle}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Page View Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, scale: 0.98, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="p-8 max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
