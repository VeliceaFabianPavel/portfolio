import { useState } from 'react';
import { Button, Frame } from '@react95/core';

const tabs = ['Contents', 'Index', 'Find'] as const;
type Tab = typeof tabs[number];

interface HelpTopic {
  title: string;
  icon: string;
  children?: HelpTopic[];
  content?: string[];
}

const helpTopics: HelpTopic[] = [
  {
    title: 'Welcome to Fabian\'s Portfolio',
    icon: '?',
    content: [
      'Welcome to this Windows 95 themed portfolio!',
      '',
      'This interactive experience showcases the work and skills of Fabian Pavel Velicea, a Software Developer based in Brasov, Romania.',
      '',
      'Navigate through the desktop icons and Start menu to explore different sections:',
      '',
      '  • About Me — Personal information and background',
      '  • My Projects — Featured project: PeP5',
      '  • Skills.exe — Technical skills overview',
      '  • Contact Me — Get in touch via email',
      '  • Resume.txt — View CV in Notepad',
      '  • Internet Explorer — Browse links',
      '  • MS-DOS Prompt — Command-line interface',
      '  • Calculator — Classic Win95 calculator',
      '  • Minesweeper — Take a break!',
    ],
  },
  {
    title: 'About the Developer',
    icon: '?',
    content: [
      'Fabian Pavel Velicea',
      'Software Developer at Siemens',
      '',
      'Location: Brasov, Romania',
      'Nationality: Romanian',
      '',
      'Currently pursuing a Master\'s degree at the Faculty of Electrical Engineering and Computer Science.',
      '',
      'Specializing in .NET ecosystem, web development, and software architecture.',
      '',
      'GitHub: github.com/InfinityAtom',
    ],
  },
  {
    title: 'Featured Project: PeP5',
    icon: '?',
    content: [
      'PeP5 — Programming Examination Platform',
      '',
      'A secure online examination system with AI-powered code evaluation, built for academic institutions.',
      '',
      'Key Features:',
      '  • Real-time code editing with Monaco Editor',
      '  • AI-powered code evaluation using OpenAI',
      '  • Support for 10+ programming languages',
      '  • Anti-cheat mechanisms and secure exam environment',
      '  • Role-based access control',
      '  • Docker containerized deployment',
      '',
      'Tech Stack:',
      '  • Backend: .NET 8, ASP.NET Core, Blazor',
      '  • Desktop: WPF (.NET)',
      '  • Database: SQL Server',
      '  • AI: OpenAI API integration',
      '  • DevOps: Docker, CI/CD',
      '',
      'Published at ICL 2024 (Springer)',
    ],
  },
  {
    title: 'Technical Skills',
    icon: '?',
    content: [
      '.NET Ecosystem:',
      '  C#, ASP.NET Core, Blazor, WPF, Entity Framework',
      '',
      'Web & Frontend:',
      '  React, TypeScript, JavaScript, HTML/CSS, Tailwind',
      '',
      'Backend & Systems:',
      '  SQL Server, PostgreSQL, Docker, REST APIs',
      '',
      'DevOps & Tools:',
      '  Git, GitHub Actions, Azure DevOps, CI/CD, Linux',
    ],
  },
  {
    title: 'Keyboard Shortcuts',
    icon: '?',
    content: [
      'MS-DOS Prompt:',
      '  ↑ / ↓    — Browse command history',
      '  Enter    — Execute command',
      '  Type "help" for available commands',
      '',
      'Desktop:',
      '  Double-click — Open application',
      '  Click Start  — Open Start menu',
      '  Drag icon    — Move icon (snaps to grid)',
      '  F3           — Reset icon positions',
      '  Shift+F3     — Reset all settings (icons + background)',
      '',
      'Windows:',
      '  Drag title bar — Move window',
      '  Drag corner    — Resize window',
      '  X button       — Close window',
    ],
  },
  {
    title: 'About This Portfolio',
    icon: '?',
    content: [
      'Windows 95 Portfolio v4.00.950',
      '',
      'Built with:',
      '  • React 18 + TypeScript',
      '  • React95 Component Library',
      '  • Vite',
      '',
      'This portfolio is a tribute to the classic Windows 95 operating system, recreating the full experience from BIOS POST to desktop.',
      '',
      'All applications are fully functional and interactive.',
      '',
      '© 2024 Fabian Pavel Velicea',
      'All rights reserved.',
    ],
  },
];

const indexEntries = [
  { term: 'About Me', topic: 1 },
  { term: 'Applications, desktop', topic: 0 },
  { term: 'Calculator', topic: 0 },
  { term: 'Contact information', topic: 1 },
  { term: 'Desktop icons', topic: 4 },
  { term: 'Docker', topic: 2 },
  { term: 'DOS Prompt, commands', topic: 4 },
  { term: 'Education', topic: 1 },
  { term: 'GitHub profile', topic: 1 },
  { term: 'Keyboard shortcuts', topic: 4 },
  { term: 'Minesweeper', topic: 0 },
  { term: '.NET ecosystem', topic: 3 },
  { term: 'PeP5 project', topic: 2 },
  { term: 'Portfolio, about', topic: 5 },
  { term: 'React', topic: 5 },
  { term: 'Resume', topic: 0 },
  { term: 'Siemens', topic: 1 },
  { term: 'Skills, technical', topic: 3 },
  { term: 'Start menu', topic: 4 },
  { term: 'TypeScript', topic: 3 },
  { term: 'Windows 95 theme', topic: 5 },
];

export function HelpApp() {
  const [activeTab, setActiveTab] = useState<Tab>('Contents');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndex = searchQuery
    ? indexEntries.filter(e => e.term.toLowerCase().includes(searchQuery.toLowerCase()))
    : indexEntries;

  const tabStyle = (tab: Tab): React.CSSProperties => ({
    padding: '4px 12px',
    fontSize: 12,
    fontFamily: '"MS Sans Serif", Arial, sans-serif',
    cursor: 'pointer',
    backgroundColor: activeTab === tab ? '#c0c0c0' : '#a0a0a0',
    border: '2px outset #c0c0c0',
    borderBottom: activeTab === tab ? 'none' : '2px outset #c0c0c0',
    marginBottom: activeTab === tab ? -1 : 0,
    position: 'relative',
    zIndex: activeTab === tab ? 1 : 0,
  });

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#c0c0c0',
      fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 1, padding: '8px 8px 0', alignItems: 'flex-end' }}>
        {tabs.map(tab => (
          <div key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </div>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, margin: '0 8px 8px', border: '2px inset #c0c0c0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeTab === 'Contents' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 8, overflow: 'hidden' }}>
            <div style={{ marginBottom: 8 }}>
              Click a topic, then click Display. Or click another tab.
            </div>
            <Frame boxShadow="in" style={{ flex: 1, backgroundColor: '#fff', overflow: 'auto', padding: 4 }}>
              {helpTopics.map((topic, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedTopic(i)}
                  onDoubleClick={() => setSelectedTopic(i)}
                  style={{
                    padding: '2px 4px',
                    cursor: 'pointer',
                    backgroundColor: selectedTopic === i ? '#000080' : 'transparent',
                    color: selectedTopic === i ? '#fff' : '#000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <span>{topic.icon}</span>
                  <span>{topic.title}</span>
                </div>
              ))}
            </Frame>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
              <Button
                style={{ width: 76 }}
                onClick={() => { if (selectedTopic !== null) setActiveTab('Find'); }}
                disabled={selectedTopic === null}
              >
                Display
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'Index' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 8, overflow: 'hidden' }}>
            <div style={{ marginBottom: 4 }}>
              1. Type the first few letters of the word you're looking for.
            </div>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', marginBottom: 8, padding: '2px 4px',
                fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12,
                border: '2px inset #c0c0c0', boxSizing: 'border-box',
              }}
            />
            <div style={{ marginBottom: 4 }}>2. Click the entry you want, then click Display.</div>
            <Frame boxShadow="in" style={{ flex: 1, backgroundColor: '#fff', overflow: 'auto', padding: 4 }}>
              {filteredIndex.map((entry, i) => (
                <div
                  key={i}
                  onClick={() => { setSelectedIndex(i); setSelectedTopic(entry.topic); }}
                  style={{
                    padding: '1px 4px',
                    cursor: 'pointer',
                    backgroundColor: selectedIndex === i ? '#000080' : 'transparent',
                    color: selectedIndex === i ? '#fff' : '#000',
                  }}
                >
                  {entry.term}
                </div>
              ))}
            </Frame>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 8 }}>
              <Button
                style={{ width: 76 }}
                onClick={() => { if (selectedTopic !== null) setActiveTab('Find'); }}
                disabled={selectedTopic === null}
              >
                Display
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'Find' && selectedTopic !== null && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 12, overflow: 'auto' }}>
            <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#000080' }}>
              {helpTopics[selectedTopic].icon} {helpTopics[selectedTopic].title}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '0 0 8px' }} />
            <div style={{ fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12, lineHeight: 1.5 }}>
              {helpTopics[selectedTopic].content?.map((line, i) => (
                <div key={i} style={{ minHeight: 14, whiteSpace: 'pre-wrap' }}>{line || '\u00A0'}</div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <Button style={{ width: 90 }} onClick={() => { setActiveTab('Contents'); setSelectedTopic(null); }}>
                ← Back
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'Find' && selectedTopic === null && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            <div style={{ textAlign: 'center', color: '#808080' }}>
              Select a topic from Contents or Index, then click Display.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
