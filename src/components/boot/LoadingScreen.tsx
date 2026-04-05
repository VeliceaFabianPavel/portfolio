import { useEffect } from 'react';
import bootGif from '../../assets/feature.gif';

interface LoadingScreenProps {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      <img
        src={bootGif}
        alt="Windows 95 Boot"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill',
        }}
      />
    </div>
  );
}
