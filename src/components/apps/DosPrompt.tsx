import { useState, useRef, useEffect } from 'react';
import { personalInfo, workExperience, education, publications, skills } from '../../data/portfolio';

const WELCOME = [
  'Microsoft(R) Windows 95',
  '   (C)Copyright Microsoft Corp 1981-1996.',
  '',
  "C:\\WINDOWS> Type 'help' for available commands.",
  '',
];

function processCommand(cmd: string): string[] {
  const c = cmd.trim().toLowerCase();
  const args = c.split(/\s+/);

  switch (args[0]) {
    case 'help':
      return [
        'Available commands:',
        '',
        '  about      - Display personal information',
        '  skills     - List technical skills',
        '  experience - Show work experience',
        '  education  - Show education history',
        '  projects   - List projects',
        '  publications - Show publications',
        '  contact    - Display contact info',
        '  github     - Open GitHub profile',
        '  clear      - Clear the screen',
        '  ver        - Display version',
        '  dir        - List directory',
        '  echo [msg] - Echo a message',
        '  help       - Show this help',
        '',
      ];
    case 'about':
      return [
        `Name:        ${personalInfo.name}`,
        `Title:       ${personalInfo.title}`,
        `Location:    ${personalInfo.location}`,
        `Nationality: ${personalInfo.nationality}`,
        `Email:       ${personalInfo.email}`,
        `GitHub:      github.com/InfinityAtom`,
        '',
      ];
    case 'skills':
      return [
        ...skills.flatMap(cat => [
          `[${cat.category}]`,
          ...cat.items.map(s => {
            const bar = '\u2588'.repeat(Math.round(s.level / 5)) + '\u2591'.repeat(20 - Math.round(s.level / 5));
            return `  ${s.name.padEnd(18)} ${bar} ${s.level}%`;
          }),
          '',
        ]),
      ];
    case 'experience':
      return [
        ...workExperience.flatMap(job => [
          `${job.title}`,
          `  ${job.company} | ${job.period}`,
          `  ${job.location}`,
          '',
        ]),
      ];
    case 'education':
      return [
        ...education.flatMap(edu => [
          `${edu.degree}`,
          `  ${edu.institution}`,
          `  ${edu.period} | ${edu.location}`,
          '',
        ]),
      ];
    case 'projects':
      return [
        'PeP5 - Programming Examination Platform',
        '  Secure online exam system with AI-powered code evaluation',
        '  Tech: .NET, Blazor, WPF, SQL Server, OpenAI, Docker',
        '  URL:  github.com/InfinityAtom/PeP5',
        '',
        'React95 Portfolio',
        '  This Windows 95 themed portfolio website',
        '  Tech: React, TypeScript, React95, Vite',
        '',
      ];
    case 'publications':
      return [
        ...publications.flatMap(pub => [
          `"${pub.title}"`,
          `  ${pub.authors}`,
          `  ${pub.venue}`,
          pub.doi ? `  DOI: ${pub.doi}` : '',
          '',
        ]).filter(Boolean),
        '',
      ];
    case 'contact':
      return [
        `Email:  ${personalInfo.email}`,
        `Phone:  ${personalInfo.phone}`,
        `GitHub: github.com/InfinityAtom`,
        '',
      ];
    case 'github':
      window.open(personalInfo.github, '_blank');
      return ['Opening GitHub profile...', ''];
    case 'ver':
      return [
        '',
        'Windows 95 [Version 4.00.950]',
        'Portfolio Edition - Fabian Pavel Velicea',
        '',
      ];
    case 'dir':
      return [
        ' Volume in drive C is PORTFOLIO',
        ' Volume Serial Number is FA81-AN95',
        ' Directory of C:\\WINDOWS',
        '',
        'ABOUT    EXE        4,096  03-29-2002  12:00a',
        'SKILLS   EXE        8,192  03-29-2002  12:00a',
        'PROJECTS EXE       16,384  03-29-2002  12:00a',
        'CONTACT  EXE        2,048  03-29-2002  12:00a',
        'RESUME   TXT        3,072  03-29-2002  12:00a',
        'PEP5     EXE      512,000  03-29-2002  12:00a',
        '         6 file(s)        545,792 bytes',
        '         0 dir(s)   420,000,000 bytes free',
        '',
      ];
    case 'clear':
    case 'cls':
      return [];
    case 'echo':
      return [args.slice(1).join(' '), ''];
    case '':
      return [];
    default:
      return [
        `Bad command or file name - '${args[0]}'`,
        "Type 'help' for available commands.",
        '',
      ];
  }
}

export function DosPrompt() {
  const [lines, setLines] = useState<string[]>([...WELCOME]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  const handleSubmit = () => {
    const cmd = input;
    const newLines = [...lines, `C:\\WINDOWS> ${cmd}`];

    if (cmd.trim().toLowerCase() === 'clear' || cmd.trim().toLowerCase() === 'cls') {
      setLines([]);
    } else {
      const output = processCommand(cmd);
      setLines([...newLines, ...output]);
    }

    if (cmd.trim()) {
      setHistory(prev => [...prev, cmd]);
    }
    setHistoryIdx(-1);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        color: '#c0c0c0',
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: 16,
        padding: 6,
        overflow: 'auto',
        cursor: 'text',
        boxSizing: 'border-box',
      }}
    >
      {lines.map((line, i) => (
        <div key={i} style={{ minHeight: 16, whiteSpace: 'pre' }}>{line}</div>
      ))}
      <div style={{ display: 'flex', minHeight: 16, whiteSpace: 'pre' }}>
        <span>C:\WINDOWS&gt;&nbsp;</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'inherit',
            font: 'inherit',
            padding: 0,
            margin: 0,
            caretColor: '#c0c0c0',
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  );
}
