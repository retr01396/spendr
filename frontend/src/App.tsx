import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { IntroView } from './auth/IntroView';
import { LoginView } from './auth/LoginView';
import { RegisterView } from './auth/RegisterView';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { PageTransition } from './components/layout/PageTransition';

import { DashboardView } from './components/views/DashboardView';
import { SubscriptionsView } from './components/views/SubscriptionsView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { CalendarView } from './components/views/CalendarView';
import { SettingsView } from './components/views/SettingsView';

import { AddSubscriptionModal } from './components/views/AddSubscriptionModal';
import { DeleteConfirmModal } from './components/ui/DeleteConfirmModal';

type AuthScreen = 'intro' | 'login' | 'register';

const MainContent: React.FC = () => {
  const { activeView } = useSubscription();

  return (
    <div className="min-h-screen bg-[#000000] text-white flex">
      <Sidebar />

      <div className="flex-1 ml-[260px] min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 bg-[#050507]">
          <PageTransition activeView={activeView}>
            {activeView === 'dashboard' && <DashboardView />}
            {activeView === 'subscriptions' && <SubscriptionsView />}
            {activeView === 'analytics' && <AnalyticsView />}
            {activeView === 'calendar' && <CalendarView />}
            {activeView === 'settings' && <SettingsView />}
          </PageTransition>
        </main>
      </div>

      <AddSubscriptionModal />
      <DeleteConfirmModal />
    </div>
  );
};

const AuthGate: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [screen, setScreen] = useState<AuthScreen>('intro');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setScreen((current) => (current === 'intro' ? 'intro' : current));
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return (
      <SubscriptionProvider>
        <MainContent />
      </SubscriptionProvider>
    );
  }

  if (screen === 'intro') {
    return <IntroView onContinue={() => setScreen('login')} onSkip={() => setScreen('login')} />;
  }

  if (screen === 'register') {
    return <RegisterView onSwitchToLogin={() => setScreen('login')} />;
  }

  return <LoginView onSwitchToRegister={() => setScreen('register')} />;
};

export function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}

export default App;
