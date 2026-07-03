import React, { useState, useEffect } from 'react';
import { EmulatorProvider, useEmulator, ScreenType } from './context/EmulatorContext';
import { 
  EmulatorLogin, EmulatorRegister, EmulatorHome, EmulatorAddTask, 
  EmulatorEditTask, EmulatorTaskDetails, EmulatorCompletedTasks, EmulatorProfile 
} from './components/EmulatorScreens';
import { DeveloperWorkspace } from './components/DeveloperWorkspace';
import { 
  Wifi, Battery, Smartphone, Terminal, HelpCircle, Code2, 
  ExternalLink, Globe, WifiOff, FileCode, CheckCircle2, ListTodo, User, Info, Check, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MobileEmulator: React.FC = () => {
  const { 
    currentScreen, theme, user, toast, apiMode, setApiMode, navigate, showToast 
  } = useEmulator();

  const [timeString, setTimeString] = useState("09:41");
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Live updating clock on phone Status Bar
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTimeString(`${hrs}:${mins}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Simulating small battery drain for fidelity
  useEffect(() => {
    const drain = setInterval(() => {
      setBatteryLevel(prev => (prev > 10 ? prev - 1 : 100));
    }, 180000);
    return () => clearInterval(drain);
  }, []);

  // Determine which component screen to display
  const renderScreen = () => {
    switch (currentScreen) {
      case 'LOGIN': return <EmulatorLogin />;
      case 'REGISTER': return <EmulatorRegister />;
      case 'HOME': return <EmulatorHome />;
      case 'ADD_TASK': return <EmulatorAddTask />;
      case 'EDIT_TASK': return <EmulatorEditTask />;
      case 'DETAILS': return <EmulatorTaskDetails />;
      case 'COMPLETED': return <EmulatorCompletedTasks />;
      case 'PROFILE': return <EmulatorProfile />;
      default: return <EmulatorHome />;
    }
  };

  // Check if current view is a tab view (where bottom tab navigations must render)
  const isTabView = ['HOME', 'COMPLETED', 'PROFILE'].includes(currentScreen);

  return (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      {/* Device Connection Settings Controller */}
      <div className="mb-4 w-full max-w-[360px] flex items-center justify-between px-2 py-1 text-[9px] font-black tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${apiMode === 'online' ? 'bg-zinc-950 dark:bg-white animate-pulse' : 'bg-zinc-300'}`}></span>
          <span>{apiMode === 'online' ? 'REST API' : 'OFFLINE CACHE'}</span>
        </div>

        <button
          onClick={() => {
            const nextMode = apiMode === 'online' ? 'offline' : 'online';
            setApiMode(nextMode);
            showToast(
              nextMode === 'online' 
                ? 'REST API Mode Activated: Syncs with JSONPlaceholder' 
                : 'Offline Caching Active: AsyncStorage mock database',
              'info'
            );
          }}
          className="text-zinc-950 dark:text-zinc-300 hover:underline transition-all lowercase"
          id="network-toggle-btn"
        >
          {apiMode === 'online' ? 'go offline' : 'go online'}
        </button>
      </div>

      {/* Outer Phone Mockup Case Frame */}
      <div className="relative mx-auto w-[360px] h-[740px] bg-zinc-950 rounded-[48px] p-3 shadow-2xl shadow-zinc-950/10 ring-12 ring-zinc-900 border-4 border-zinc-800 flex flex-col overflow-hidden">
        
        {/* Dynamic Mobile Push Notification Toast (Slide down banner) */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 15 }}
              className="absolute top-14 left-6 right-6 z-50 pointer-events-none"
            >
              <div className={`p-3 rounded-2xl flex items-start gap-2.5 shadow-xl border ${
                toast.type === 'error' 
                  ? 'bg-rose-950/95 border-rose-800 text-rose-200' 
                  : toast.type === 'info'
                    ? 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
                    : 'bg-zinc-900/95 border-zinc-800 text-zinc-100'
              }`}>
                <Info size={15} className="mt-0.5 shrink-0 text-orange-400" />
                <div className="min-w-0">
                  <p className="text-[9px] uppercase font-black tracking-widest text-zinc-400 leading-none">TaskFlow Alert</p>
                  <p className="text-xs font-semibold leading-normal mt-1">{toast.text}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Notch Dynamic Island */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
          <div className="w-12 h-1 bg-zinc-900 rounded-full"></div>
        </div>

        {/* Physical volume/power buttons representation shadows */}
        <div className="absolute top-24 -left-1 w-1 h-12 bg-zinc-800 rounded-r-md"></div>
        <div className="absolute top-40 -left-1 w-1 h-12 bg-zinc-800 rounded-r-md"></div>
        <div className="absolute top-32 -right-1 w-1 h-16 bg-zinc-800 rounded-l-md"></div>

        {/* Inner Mobile Operating System (Screen) */}
        <div className={`flex-1 flex flex-col rounded-[38px] overflow-hidden relative ${
          theme === 'dark' ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
        }`}>
          
          {/* Custom Status Bar */}
          <div className={`h-11 px-6 flex items-center justify-between text-xs font-semibold z-30 select-none shrink-0 ${
            theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-zinc-50 text-zinc-900'
          }`}>
            <span className="font-bold tracking-tight text-[11px]">{timeString}</span>
            <div className="flex items-center gap-1.5">
              {apiMode === 'online' ? <Wifi size={13} /> : <WifiOff size={13} className="text-zinc-400" />}
              <span className="text-[10px] font-bold">5G</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">{batteryLevel}%</span>
                <Battery size={13} />
              </div>
            </div>
          </div>

          {/* Core Content Screen Viewer */}
          <div className="flex-1 overflow-hidden relative">
            {renderScreen()}
          </div>

          {/* Simulated Bottom Tab Navigator (React Navigation) */}
          {user && isTabView && (
            <div className={`h-16 border-t flex items-center justify-around px-4 select-none shrink-0 z-30 ${
              theme === 'dark' ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-100 shadow-xs'
            }`}>
              <button
                onClick={() => navigate('HOME')}
                className={`flex flex-col items-center transition-colors ${
                  currentScreen === 'HOME' 
                    ? theme === 'dark' ? 'text-white font-black' : 'text-zinc-950 font-black'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                id="tab-home-btn"
              >
                <ListTodo size={18} />
                <span className="text-[9px] mt-1 uppercase tracking-wider font-bold">My Tasks</span>
              </button>

              <button
                onClick={() => navigate('COMPLETED')}
                className={`flex flex-col items-center transition-colors ${
                  currentScreen === 'COMPLETED' 
                    ? theme === 'dark' ? 'text-white font-black' : 'text-zinc-950 font-black'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                id="tab-completed-btn"
              >
                <CheckCircle2 size={18} />
                <span className="text-[9px] mt-1 uppercase tracking-wider font-bold">Archive</span>
              </button>

              <button
                onClick={() => navigate('PROFILE')}
                className={`flex flex-col items-center transition-colors ${
                  currentScreen === 'PROFILE' 
                    ? theme === 'dark' ? 'text-white font-black' : 'text-zinc-950 font-black'
                    : 'text-zinc-400 hover:text-zinc-600'
                }`}
                id="tab-profile-btn"
              >
                <User size={18} />
                <span className="text-[9px] mt-1 uppercase tracking-wider font-bold">Profile</span>
              </button>
            </div>
          )}

          {/* Bottom Native Home Indicator Pill */}
          <div className={`h-5 flex items-center justify-center shrink-0 w-full ${
            theme === 'dark' ? 'bg-zinc-950' : 'bg-white'
          }`}>
            <div className="w-24 h-1 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <EmulatorProvider>
      <div className="min-h-screen bg-[#FAFAFA] font-sans flex flex-col">
        {/* Workspace Top Header Bar */}
        <header className="bg-white border-b border-zinc-150 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center">
              <Smartphone className="text-white" size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xs font-black uppercase tracking-widest text-zinc-950">TaskFlow</h1>
                <span className="bg-zinc-100 text-zinc-800 border border-zinc-150 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                  Portfolio Suite
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="https://expo.dev/" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-950 font-black uppercase tracking-wider transition-all border border-zinc-150 px-3 py-1.5 rounded-xl hover:bg-zinc-50"
            >
              <Globe size={11} />
              <span>Expo Dev</span>
            </a>
            
            <a 
              href="https://reactnavigation.org/" 
              target="_blank" 
              rel="noreferrer"
              className="hidden lg:flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-950 font-black uppercase tracking-wider transition-all border border-zinc-150 px-3 py-1.5 rounded-xl hover:bg-zinc-50"
            >
              <FileCode size={11} />
              <span>React Navigation</span>
            </a>
          </div>
        </header>

        {/* Core Layout Split Panes */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-[#FAFAFA]">
          {/* Left Panel: Mobile Device Mockup */}
          <section className="lg:col-span-5 bg-[#FAFAFA] border-r border-zinc-150 overflow-y-auto flex items-center justify-center py-6">
            <MobileEmulator />
          </section>

          {/* Right Panel: Developer Workstation */}
          <section className="lg:col-span-7 overflow-hidden flex flex-col bg-white">
            <DeveloperWorkspace />
          </section>
        </main>
      </div>
    </EmulatorProvider>
  );
}
