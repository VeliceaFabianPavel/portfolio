import { useState, useEffect, useRef, useCallback } from 'react';

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
  const hiddenInputRef = useRef<HTMLInputElement>(null);

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
        setTimeout(() => hiddenInputRef.current?.focus(), 100);
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

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    if (trimmed === 'win') {
      setLines(prev => [...prev, `C:\\>${cmd}`, '', 'Starting Microsoft Windows 95...', '']);
      setInput('');
      setWinTriggered(true);
      setTimeout(onComplete, 1500);
    } else if (trimmed === '') {
      setLines(prev => [...prev, 'C:\\>']);
    } else if (trimmed === 'help' || trimmed === 'help /?' || trimmed === '?') {
      setLines(prev => [...prev, `C:\\>${cmd}`, '',
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
    } else if (trimmed === 'ver') {
      setLines(prev => [...prev, `C:\\>${cmd}`, '', 'MS-DOS Version 6.22', '']);
      setInput('');
    } else if (trimmed === 'cls') {
      setLines([]);
      setInput('');
    } else if (trimmed === 'mem') {
      setLines(prev => [...prev, `C:\\>${cmd}`, '',
        '  655360 bytes total conventional memory',
        '  655360 bytes available to MS-DOS',
        '  589824 largest executable program size',
        '',
        '  67108864 bytes total contiguous extended memory',
        '  67043328 bytes available contiguous extended memory',
        '',
      ]);
      setInput('');
    } else if (trimmed === 'date') {
      const d = new Date();
      const dateStr = `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${d.getFullYear()}`;
      setLines(prev => [...prev, `C:\\>${cmd}`, `Current date is ${dateStr}`, '']);
      setInput('');
    } else if (trimmed === 'time') {
      const d = new Date();
      const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
      setLines(prev => [...prev, `C:\\>${cmd}`, `Current time is ${timeStr}`, '']);
      setInput('');
    } else {
      setLines(prev => [...prev, `C:\\>${cmd}`, 'Bad command or file name', '']);
      setInput('');
    }
  }, [onComplete]);

  // Handle input from hidden input (works on both desktop and mobile)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (winTriggered) return;
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (winTriggered) return;
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      if (hiddenInputRef.current) hiddenInputRef.current.value = '';
    }
  };

  return (
    <div ref={containerRef} onClick={() => hiddenInputRef.current?.focus()} style={{
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
        <div
          style={{ whiteSpace: 'pre', minHeight: '22px' }}
          onClick={() => hiddenInputRef.current?.focus()}
        >
          C:\&gt;{input}{cursor ? '_' : '\u00A0'}
        </div>
      )}
      {/* Hidden input to capture typing on both desktop and mobile */}
      <input
        ref={hiddenInputRef}
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        style={{
          position: 'absolute',
          opacity: 0,
          height: 0,
          width: 0,
          border: 'none',
          padding: 0,
        }}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}
