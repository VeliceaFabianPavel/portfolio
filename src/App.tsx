import { useState, useCallback, useEffect } from 'react';
import '@react95/core/GlobalStyle';
import '@react95/core/themes/win95.css';
import { BiosScreen } from './components/boot/BiosScreen';
import { LoadingScreen } from './components/boot/LoadingScreen';
import { DosBootScreen } from './components/boot/DosBootScreen';
import { WelcomeScreen } from './components/boot/WelcomeScreen';
import { ShutdownScreen } from './components/boot/ShutdownScreen';
import { Desktop } from './components/desktop/Desktop';
import { BlueScreen } from './components/BlueScreen';
import type { BootPhase } from './types';

type Phase = BootPhase | 'dos' | 'bsod' | 'shutdown' | 'restart';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

function App() {
  const [phase, setPhase] = useState<Phase>('bios');
  const isMobile = useIsMobile();

  const handleShutDown = useCallback(() => {
    setPhase('shutdown');
  }, []);

  const handleRestart = useCallback(() => {
    setPhase('restart');
  }, []);

  return (
    <>
      {phase === 'bios' && (
        <BiosScreen onComplete={() => setPhase(isMobile ? 'bsod' : 'dos')} />
      )}
      {phase === 'bsod' && (
        <BlueScreen />
      )}
      {phase === 'dos' && (
        <DosBootScreen onComplete={() => setPhase('loading')} />
      )}
      {phase === 'loading' && (
        <LoadingScreen onComplete={() => setPhase('welcome')} />
      )}
      {phase === 'welcome' && (
        <WelcomeScreen onComplete={() => setPhase('desktop')} />
      )}
      {phase === 'desktop' && (
        <Desktop onShutDown={handleShutDown} onRestart={handleRestart} />
      )}
      {phase === 'shutdown' && (
        <ShutdownScreen mode="shutdown" />
      )}
      {phase === 'restart' && (
        <ShutdownScreen mode="restart" onReboot={() => window.location.reload()} />
      )}
    </>
  );
}

export default App;
