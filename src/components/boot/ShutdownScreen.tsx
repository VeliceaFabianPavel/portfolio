import { useEffect, useState } from 'react';
import shutdownImg from '../../assets/shutdown.webp';
import shutdownScreen from '../../assets/shutfown0.webp';

interface ShutdownScreenProps {
  mode: 'shutdown' | 'restart';
  onReboot?: () => void;
}

export function ShutdownScreen({ mode, onReboot }: ShutdownScreenProps) {
  const [phase, setPhase] = useState<'shutting-down' | 'safe'>('shutting-down');

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'restart') {
        window.location.reload();
      } else {
        setPhase('safe');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [mode, onReboot]);

  if (phase === 'safe') {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <img
          src={shutdownImg}
          alt="It's now safe to turn off your computer"
        />
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      overflow: 'hidden',
    }}>
      <img
        src={shutdownScreen}
        alt="Windows is shutting down"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
        }}
      />
    </div>
  );
}
