
import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthPage from './components/AuthPage';
import MainPage from './components/MainPage';
import RunSummary from './components/RunSummary';
import { onAuthStateChanged, signOutUser, type User } from './services/firebaseService';
import useLocalStorage from './hooks/useLocalStorage';
import type { Run } from './types';

export type UserType = User | null;

type View = 'splash' | 'auth' | 'main' | 'summary';

const App: React.FC = () => {
  const [view, setView] = useState<View>('splash');
  const [user, setUser] = useState<UserType>(null);
  const [activeRun, setActiveRun] = useState<Run | null>(null);
  const [runs, setRuns] = useLocalStorage<Run[]>('runHistory', []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      // Let splash screen show for a minimum duration for a better UX
      setTimeout(() => setView(firebaseUser ? 'main' : 'auth'), 2000); 
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (authedUser: UserType) => {
    setUser(authedUser);
    setView('main');
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    setView('auth');
  }

  const handleRunComplete = (runData: Run) => {
    setActiveRun(runData);
    setView('summary');
  };

  const handleSaveRun = (runData: Run) => {
    setRuns(prevRuns => [runData, ...prevRuns]);
    setActiveRun(null);
    setView('main');
  };

  const handleDiscardRun = () => {
    setActiveRun(null);
    setView('main');
  };

  const renderContent = () => {
    switch (view) {
      case 'splash':
        return <SplashScreen />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'summary':
        if (!activeRun) {
          setView('main'); // Should not happen, but as a fallback
          return null;
        }
        return <RunSummary run={activeRun} onSave={handleSaveRun} onDiscard={handleDiscardRun} />;
      case 'main':
      default:
        return user ? <MainPage user={user} onSignOut={handleSignOut} onRunComplete={handleRunComplete} runs={runs} /> : <AuthPage onAuthSuccess={handleAuthSuccess} />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden fixed bg-slate-100">
      {renderContent()}
    </div>
  );
};

export default App;
