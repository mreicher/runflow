import React, { useState } from 'react';
import { signUp, signIn, signInAsGuest, type User } from '../services/firebaseService';
import type { UserType } from '../App';
import InfoModal from './InfoModal';

interface AuthPageProps {
  onAuthSuccess: (user: UserType) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInfoModalOpen, setInfoModalOpen] = useState(false);

  const handleAuthAction = async (action: 'signin' | 'signup') => {
    if (!email || !password) {
        setError("Please enter both email and password.");
        return;
    }
    setError(null);
    setLoading(true);

    try {
      let user: User | null = null;
      if (action === 'signin') {
        user = await signIn(email, password);
      } else {
        user = await signUp(email, password);
      }
      onAuthSuccess(user);
    } catch (err: any) {
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists.');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters.');
          break;
        default:
          setError(err.message || 'An unknown error occurred.');
      }
    } finally {
        setLoading(false);
    }
  };

  const handleGuest = async () => {
    setLoading(true);
    try {
        const user = await signInAsGuest();
        onAuthSuccess(user);
    } catch(err: any) {
        setError(err.message || 'Could not sign in as guest.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
        <div 
            className="w-full h-full flex flex-col items-center justify-center bg-cover bg-center p-4 text-white"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2070&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black/60"></div>

            <button 
                onClick={() => setInfoModalOpen(true)}
                className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition"
                aria-label="Show app information"
            >
                <i className="fas fa-info-circle text-xl"></i>
            </button>
            
            <div className="relative z-10 w-full max-w-sm flex flex-col justify-center text-center h-full">
                <div className="flex-grow flex flex-col justify-center items-center">
                    <div className="text-5xl text-blue-300 mb-4">
                        <i className="fas fa-running"></i>
                    </div>
                    <h1 className="text-4xl font-bold">Welcome to RunFlow</h1>
                    <p className="text-slate-300 text-lg mt-1">Your journey starts here</p>
                </div>
                
                <div className="flex-shrink-0 w-full pb-4">
                    <div className="space-y-4">
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                            <input 
                                type="email" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email" 
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-slate-300"
                            />
                        </div>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"></i>
                            <input 
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="Password" 
                                required
                                className="w-full bg-white/10 border border-white/20 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 transition placeholder-slate-300"
                            />
                        </div>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center pt-4">{error}</p>}
                    
                    <div className="mt-6 space-y-3">
                        <button onClick={() => handleAuthAction('signin')} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-blue-400 disabled:cursor-not-allowed">
                            {loading ? <i className="fas fa-spinner animate-spin"></i> : 'Sign In'}
                        </button>
                        <button onClick={() => handleAuthAction('signup')} disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-emerald-400 disabled:cursor-not-allowed">
                            {loading ? <i className="fas fa-spinner animate-spin"></i> : 'Sign Up'}
                        </button>
                    </div>
                    
                    <div className="flex items-center my-6">
                        <div className="flex-grow border-t border-white/20"></div>
                        <span className="mx-4 text-slate-300">or</span>
                        <div className="flex-grow border-t border-white/20"></div>
                    </div>

                    <button onClick={handleGuest} disabled={loading} className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 rounded-lg transition-transform duration-200 ease-in-out hover:scale-105 disabled:bg-slate-400">
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
        <InfoModal isOpen={isInfoModalOpen} onClose={() => setInfoModalOpen(false)} />
    </>
  );
};

export default AuthPage;
