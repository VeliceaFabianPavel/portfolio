import { useState, useEffect } from 'react';

export function BlueScreen() {
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    const blink = setInterval(() => setCursor(prev => !prev), 530);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    const reload = () => window.location.reload();
    window.addEventListener('keydown', reload);
    return () => window.removeEventListener('keydown', reload);
  }, []);

  // Match the exact BSOD layout from the reference image
  return (
    <div
      onClick={() => window.location.reload()}
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0000AA',
        color: '#FFFFFF',
        fontFamily: '"Perfect DOS VGA 437", "Courier New", "Lucida Console", monospace',
        fontSize: 'clamp(11px, 2.2vw, 16px)',
        lineHeight: '1.5',
        padding: '15vh 10vw',
        boxSizing: 'border-box',
        cursor: 'none',
        overflow: 'hidden',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5em' }}>
        <span style={{
          backgroundColor: '#AAAAAA',
          color: '#0000AA',
          padding: '0 6px',
        fontWeight: 'bold',
        fontSize: 'clamp(14px, 3vw, 20px)',
        }}> Windows </span>
      </div>

      <pre style={{
        margin: 0,
        fontFamily: 'inherit',
        fontSize: 'inherit',
        lineHeight: 'inherit',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      }}>{`An error has occurred. To continue:

Press Enter to return to Windows, or

Press CTRL+ALT+DEL to restart your computer. If you do this,
you will lose any unsaved information in all open applications.

This device does not meet the minimum display requirements.
A resolution of 800x600 or higher is required. Please visit
this site from a desktop computer.

Error: 0E : 016F : BFF9B3D4`}
      </pre>

      <p style={{
        textAlign: 'center',
        margin: '3em 0 0',
      }}>
        {'Press any key to continue '}
        {cursor ? '_' : '\u00A0'}
      </p>
    </div>
  );
}
