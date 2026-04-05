import { useState, useEffect, useRef } from 'react';

interface DosBootScreenProps {
  onComplete: () => void;
}

const infoLines = [
  'Microsoft(R) MS-DOS(R) Version 6.22',
  '(C)Copyright Microsoft Corp 1981-1994.',
  '',
  'C:\\>HIMEM.SYS',
  'HIMEM is testing extended memory...done.',
  'HIMEM: 64MB of extended memory available.',
  '',
  'C:\\>AUTOEXEC.BAT',
  'MSCDEX Version 2.25',
  'Copyright (C) Microsoft Corp. 1986-1995. All rights reserved.',
  '  Drive E: = Driver OEMCD001 unit 0',
  '',
  'C:\\>DIAGNOSE /S',
  '  Sound Blaster 16 detected at port 220, IRQ 5, DMA 1',
  '',
  'C:\\>MOUSE.COM',
  '  Mouse driver installed.',
  '',
  'C:\\>MEM',
  '  655360 bytes total conventional memory',
  '  655360 bytes available to MS-DOS',
  '  589824 largest executable program size',
  '',
  '  67108864 bytes total contiguous extended memory',
  '  67043328 bytes available contiguous extended memory',
  '',
  'Type HELP for a list of commands.',
  'Type WIN to start Windows 95.',
  '',
];

export function DosBootScreen({ onComplete }: DosBootScreenProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [bootDone, setBootDone] = useState(false);
  const [input, setInput] = useState('');
  const [cursor, setCursor] = useState(true);
  const [winTriggered, setWinTriggered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Boot info sequence
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < infoLines.length) {
        setLines(prev => [...prev, infoLines[i]]);
        i++;
      } else {
        clearInterval(timer);
        setBootDone(true);
      }
    }, 40);
    return () => clearInterval(timer);
  }, []);

  // Cursor blink
  useEffect(() => {
    const blink = setInterval(() => setCursor(prev => !prev), 530);
    return () => clearInterval(blink);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Keyboard input
  useEffect(() => {
    if (!bootDone || winTriggered) return;

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'Enter') {
        const cmd = input.trim().toLowerCase();
        if (cmd === 'win') {
          setLines(prev => [...prev, `C:\\>${input}`, '', 'Starting Microsoft Windows 95...', '']);
          setInput('');
          setWinTriggered(true);
          setTimeout(onComplete, 1500);
        } else if (cmd === '') {
          setLines(prev => [...prev, 'C:\\>']);
        } else if (cmd === 'help' || cmd === 'help /?' || cmd === '?') {
          setLines(prev => [...prev, `C:\\>${input}`, '',
            'Available commands:',
            '  WIN      Start Windows 95',
            '  VER      Display MS-DOS version',
            '  HELP     Show this help',
            '  CLS      Clear screen',
            '  MEM      Display memory usage',
            '  DATE     Display current date',
            '  TIME     Display current time',
            '',
          ]);
          setInput('');
        } else if (cmd === 'ver') {
          setLines(prev => [...prev, `C:\\>${input}`, '', 'MS-DOS Version 6.22', '']);
          setInput('');
        } else if (cmd === 'cls') {
          setLines([]);
          setInput('');
        } else if (cmd === 'mem') {
          setLines(prev => [...prev, `C:\\>${input}`, '',
            '  655360 bytes total conventional memory',
            '  655360 bytes available to MS-DOS',
            '  589824 largest executable program size',
            '',
            '  67108864 bytes total contiguous extended memory',
            '  67043328 bytes available contiguous extended memory',
            '',
          ]);
          setInput('');
        } else if (cmd === 'date') {
          const d = new Date();
          const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
          setLines(prev => [...prev, `C:\\>${input}`, `Current date is ${dateStr}`, '']);
          setInput('');
        } else if (cmd === 'time') {
          const d = new Date();
          const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
          setLines(prev => [...prev, `C:\\>${input}`, `Current time is ${timeStr}`, '']);
          setInput('');
        } else {
          setLines(prev => [...prev, `C:\\>${input}`, 'Bad command or file name', '']);
          setInput('');
        }
      } else if (e.key === 'Backspace') {
        setInput(prev => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        setInput(prev => prev + e.key);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [bootDone, winTriggered, input, onComplete]);

  return (
    <div ref={containerRef} style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#aaa',
      fontFamily: '"Perfect DOS VGA 437", "Courier New", monospace',
      fontSize: '16px',
      fontWeight: 'bold',
      lineHeight: '1.4',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      cursor: 'none',
    }}>
      {lines.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre', minHeight: '22px' }}>{line}</div>
      ))}
      {bootDone && !winTriggered && (
        <div style={{ whiteSpace: 'pre', minHeight: '22px' }}>
          C:\&gt;{input}{cursor ? '_' : '\u00A0'}
        </div>
      )}
    </div>
  );
}
