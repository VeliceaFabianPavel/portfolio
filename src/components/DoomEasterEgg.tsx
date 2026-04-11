import { useEffect, useRef, useState } from 'react';

// Dwasm is a direct WebAssembly port of the PrBoom+ Doom engine.
// Files live in /public/dwasm/ and are loaded via a dedicated host page
// (doom.html) that we embed in an iframe. Using an iframe means that
// closing the easter egg tears down the WASM heap *and* SDL_mixer's
// Web Audio context in one go — which is the only reliable way to stop
// the soundtrack and avoid stacking engines when the egg is reopened.
//
// https://github.com/GMH-Code/Dwasm (GPL-2.0)

interface DoomEasterEggProps {
  onClose: () => void;
}

export function DoomEasterEgg({ onClose }: DoomEasterEggProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [progress, setProgress] = useState('Loading DOOM...');

  const src = `${import.meta.env.BASE_URL}dwasm/doom.html`;

  // Parent-side Shift+Escape fallback in case the iframe doesn't have
  // focus yet (e.g. before the first click). The iframe itself also
  // handles Shift+Escape and forwards it, so either path works.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onClose]);

  // Listen for postMessage traffic from the Dwasm host iframe.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      switch (data.type) {
        case 'doom-ready':
          setStatus('ready');
          break;
        case 'doom-progress':
          if (typeof data.text === 'string') {
            // Emscripten status strings look like "Downloading... (12345/67890)".
            // Strip the parenthesised byte counter for a cleaner label.
            const cleaned = data.text.replace(/\s*\([^)]*\)\s*$/, '');
            setProgress(cleaned || 'Loading...');
          }
          break;
        case 'doom-error':
          // eslint-disable-next-line no-console
          console.error('[doom] aborted:', data.reason);
          setStatus('error');
          break;
        case 'doom-close-request':
          onClose();
          break;
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [onClose]);

  // Focus the iframe on mount so keyboard events flow into the game
  // immediately without requiring an initial click.
  useEffect(() => {
    iframeRef.current?.focus();
  }, []);

  return (
    <div
      className="doom-egg-host"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <iframe
        ref={iframeRef}
        src={src}
        title="DOOM"
        // Needed so SDL_mixer's AudioContext can start (autoplay) and
        // Dwasm can go fullscreen. Pointer lock is NOT in the Permissions
        // Policy spec — same-origin iframes already get it by default,
        // and listing it here just triggers an "Unrecognized feature"
        // warning in the console, so we omit it.
        allow="autoplay; fullscreen"
        style={{
          // 4:3 aspect ratio fit, matching Dwasm's upstream CSS.
          width: 'min(100vw, 133.333vh)',
          height: 'min(75vw, 100vh)',
          border: 'none',
          background: '#000',
          display: 'block',
        }}
      />

      {status === 'loading' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff2a00',
            fontFamily: '"Perfect DOS VGA 437", "Courier New", monospace',
            fontSize: 24,
            letterSpacing: 2,
            textShadow: '0 0 8px #ff2a00',
            pointerEvents: 'none',
            gap: 12,
          }}
        >
          <div>LOADING DOOM...</div>
          <div style={{ fontSize: 14, color: '#c0c0c0', textShadow: 'none' }}>
            {progress}
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ff2a00',
            fontFamily: '"Perfect DOS VGA 437", "Courier New", monospace',
            fontSize: 20,
            textAlign: 'center',
            padding: 24,
          }}
        >
          Failed to load DOOM.
          <br />
          Check the browser console for details.
        </div>
      )}

      {/* Close button — Win95-style to match the desktop aesthetic.
          Sits above the iframe with a higher z-index. Shift+Esc is the
          keyboard alternative so the in-game Esc menu still works. */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close Doom (Shift+Esc)"
        title="Close (Shift+Esc)"
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 32,
          height: 28,
          background: '#c0c0c0',
          border: '2px solid',
          borderColor: '#ffffff #808080 #808080 #ffffff',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: 14,
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 2,
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

export default DoomEasterEgg;
