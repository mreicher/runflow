import React from 'react';

const SplashScreen: React.FC = () => {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=2070&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 text-center animate-fade-in">
        <div className="text-6xl mb-4 animate-bounce">
          <i className="fas fa-running"></i>
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-2">RunFlow</h1>
        <p className="text-xl text-slate-200">Your personal running companion</p>
        <div className="mt-8">
            <div className="w-16 h-16 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
