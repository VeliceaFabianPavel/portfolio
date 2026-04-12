import { useCallback, useState, useEffect, useRef, lazy, Suspense } from 'react';
import shutdownSound from '../../assets/tada.mp3';
import { Modal, TitleBar, Button, RadioButton, Alert } from '@react95/core';
import {
  Computer,
  Computer4,
  Explore,
  Settings,
  Mail,
  Notepad,
  Mshtml32528,
  RecycleFull,
  Winmine1,
  Calculator,
  HelpBook,
  Desk100,
} from '@react95/icons';
// React95 core components used by child components
import { DesktopIcon } from './DesktopIcon';
import { Window } from './Window';
import { TaskBar } from './TaskBar';
import { AboutMe } from '../apps/AboutMe';
import { ProjectsExplorer } from '../apps/ProjectsExplorer';
import { SkillsApp } from '../apps/SkillsApp';
import { ContactApp } from '../apps/ContactApp';
import { NotepadApp } from '../apps/NotepadApp';
import { BrowserApp } from '../apps/BrowserApp';
import { MinesweeperApp } from '../apps/MinesweeperApp';
import { DosPrompt } from '../apps/DosPrompt';
import { CalculatorApp } from '../apps/CalculatorApp';
import { HelpApp } from '../apps/HelpApp';
import { DisplayApp } from '../apps/DisplayApp';
import msDosIcon from '../../assets/MsDos_32x32_32.png';
import { loadBackground, saveBackground, getBackgroundStyle, type DesktopBackground } from '../../wallpapers';

// Lazy so the js-dos loader code is only fetched if the egg is triggered.
const DoomEasterEgg = lazy(() =>
  import('../DoomEasterEgg').then(m => ({ default: m.DoomEasterEgg })),
);

// Konami code (classic + Enter). Shift must be held throughout to
// trigger the DOOM egg. Enter is the "start" button on the original
// arcade/NES input and it keeps Konami detection off of users who
// type "ba" at the end of a word by accident.
const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a', 'Enter',
] as const;

interface DesktopProps {
  onShutDown: () => void;
  onRestart: () => void;
}

interface AppConfig {
  title: string;
  icon: React.ComponentType<any> | string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

const appConfigs: Record<string, AppConfig> = {
  about: {
    title: 'About Me - System Properties',
    icon: Computer,
    position: { x: 60, y: 20 },
    size: { width: 520, height: 480 },
  },
  projects: {
    title: 'PeP5 — Programming Examination Platform',
    icon: Explore,
    position: { x: 0, y: 0 },
    size: { width: window.innerWidth, height: window.innerHeight - 28 },
  },
  skills: {
    title: 'Skills.exe',
    icon: Settings,
    position: { x: 140, y: 25 },
    size: { width: 480, height: 460 },
  },
  contact: {
    title: 'New Message - Outlook Express',
    icon: Mail,
    position: { x: 140, y: 60 },
    size: { width: 440, height: 400 },
  },
  notepad: {
    title: 'Resume.txt - Notepad',
    icon: Notepad,
    position: { x: 100, y: 20 },
    size: { width: 460, height: 440 },
  },
  browser: {
    title: 'Microsoft Internet Explorer',
    icon: Mshtml32528,
    position: { x: 60, y: 15 },
    size: { width: 540, height: 460 },
  },
  minesweeper: {
    title: 'Minesweeper',
    icon: Winmine1,
    position: { x: 200, y: 80 },
    size: { width: 228, height: 320 },
  },
  dos: {
    title: 'MS-DOS Prompt',
    icon: msDosIcon,
    position: { x: 100, y: 50 },
    size: { width: 560, height: 380 },
  },
  help: {
    title: 'Help Topics',
    icon: HelpBook,
    position: { x: 80, y: 30 },
    size: { width: 480, height: 420 },
  },
  calculator: {
    title: 'Calculator',
    icon: Calculator,
    position: { x: 220, y: 100 },
    size: { width: 260, height: 280 },
  },
  display: {
    title: 'Display Properties',
    icon: Desk100,
    position: { x: 120, y: 40 },
    size: { width: 420, height: 440 },
  },
};

const desktopIcons = [
  { id: 'about', label: 'About Me', icon: Computer, tooltip: 'View system properties and personal info' },
  { id: 'projects', label: 'My Projects', icon: Explore, tooltip: 'Browse my projects and research' },
  { id: 'skills', label: 'Skills.exe', icon: Settings, tooltip: 'Technical skills and proficiencies' },
  { id: 'contact', label: 'Contact Me', icon: Mail, tooltip: 'Send me a message via Outlook Express' },
  { id: 'notepad', label: 'Resume.txt', icon: Notepad, tooltip: 'Open resume in Notepad' },
  { id: 'browser', label: 'Internet\nExplorer', icon: Mshtml32528, tooltip: 'Browse the World Wide Web' },
  { id: 'minesweeper', label: 'Minesweeper', icon: Winmine1, tooltip: 'Play Minesweeper' },
  { id: 'dos', label: 'MS-DOS\nPrompt', icon: msDosIcon, tooltip: 'Open an MS-DOS command prompt' },
  { id: 'calculator', label: 'Calculator', icon: Calculator, tooltip: 'Performs basic arithmetic' },
  { id: 'help', label: 'Help', icon: HelpBook, tooltip: 'Windows Help and keyboard shortcuts' },
  { id: 'display', label: 'Display\nProperties', icon: Desk100, tooltip: 'Change desktop wallpaper and appearance' },
  { id: 'recycle', label: 'Recycle Bin', icon: RecycleFull, tooltip: 'Contains deleted files and folders' },
];

const ICON_STORAGE_KEY = 'win95-icon-positions';
const ICON_WIDTH = 78;
const ICON_HEIGHT = 70;

function getDefaultIconPositions(): Record<string, { x: number; y: number }> {
  const positions: Record<string, { x: number; y: number }> = {};
  const maxRows = Math.floor((window.innerHeight - 40) / ICON_HEIGHT);
  desktopIcons.forEach((icon, i) => {
    const col = Math.floor(i / maxRows);
    const row = i % maxRows;
    positions[icon.id] = { x: 8 + col * ICON_WIDTH, y: 8 + row * ICON_HEIGHT };
  });
  return positions;
}

function loadIconPositions(): Record<string, { x: number; y: number }> {
  try {
    const saved = localStorage.getItem(ICON_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure all icons have positions
      const defaults = getDefaultIconPositions();
      for (const icon of desktopIcons) {
        if (!parsed[icon.id]) parsed[icon.id] = defaults[icon.id];
      }
      return parsed;
    }
  } catch { /* ignore */ }
  return getDefaultIconPositions();
}

function saveIconPositions(positions: Record<string, { x: number; y: number }>) {
  localStorage.setItem(ICON_STORAGE_KEY, JSON.stringify(positions));
}

// appComponents is built inside the Desktop component since DisplayApp needs props

function ShutdownDialog({ onYes, onNo }: { onYes: (action: 'shutdown' | 'restart') => void; onNo: () => void }) {
  const [selected, setSelected] = useState<'shutdown' | 'restart'>('shutdown');

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
    }}>
      <div style={{ width: 420 }}>
        <Modal
          title="Shut Down Windows"
          style={{ width: 420, position: 'relative' }}
          titleBarOptions={[
            <TitleBar.Close key="close" onClick={onNo} />,
          ]}
        >
          <div style={{ padding: '12px 16px 16px', fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12 }}>
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ flexShrink: 0, paddingTop: 2 }}>
                <Computer4 variant="32x32_4" />
              </div>
              <div>
                <div style={{ marginBottom: 12 }}>Are you sure you want to:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, whiteSpace: 'nowrap' }}>
                  <RadioButton
                    checked={selected === 'shutdown'}
                    onChange={() => setSelected('shutdown')}
                  >
                    Shut down the computer?
                  </RadioButton>
                  <RadioButton
                    checked={selected === 'restart'}
                    onChange={() => setSelected('restart')}
                  >
                    Restart the computer?
                  </RadioButton>
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #808080', borderBottom: '1px solid #fff', margin: '0 0 12px' }} />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
              <Button onClick={() => onYes(selected)} style={{ width: 80 }}>Yes</Button>
              <Button onClick={onNo} style={{ width: 80 }}>No</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export function Desktop({ onShutDown, onRestart }: DesktopProps) {
  const [openApps, setOpenApps] = useState<Set<string>>(new Set());
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const [background, setBackground] = useState<DesktopBackground>(loadBackground);
  const [iconPositions, setIconPositions] = useState(loadIconPositions);
  const [doomOpen, setDoomOpen] = useState(false);
  const konamiProgress = useRef(0);
  const konamiShiftHeld = useRef(true);

  const moveIcon = useCallback((id: string, pos: { x: number; y: number }) => {
    setIconPositions(prev => {
      const next = { ...prev, [id]: pos };
      saveIconPositions(next);
      return next;
    });
  }, []);

  // F3 = reset icon positions, Shift+F3 = reset everything.
  // Shift+Konami (↑↑↓↓←→←→BA) = launch actual DOOM easter egg.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'F3') {
        e.preventDefault();
        if (e.shiftKey) {
          // Reset all: icons + background
          const defaults = getDefaultIconPositions();
          setIconPositions(defaults);
          saveIconPositions(defaults);
          const defaultBg: DesktopBackground = { type: 'color', value: '#008080' };
          setBackground(defaultBg);
          saveBackground(defaultBg);
        } else {
          // Reset icons only
          const defaults = getDefaultIconPositions();
          setIconPositions(defaults);
          saveIconPositions(defaults);
        }
        return;
      }

      // Don't track Konami while Doom is already open — let the game own the keys.
      if (doomOpen) return;

      // Konami tracking. Match case-insensitively for the final B / A.
      const expected = KONAMI_SEQUENCE[konamiProgress.current];
      const pressed = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const target = expected.length === 1 ? expected.toLowerCase() : expected;

      if (pressed === target) {
        if (!e.shiftKey) konamiShiftHeld.current = false;
        konamiProgress.current += 1;
        if (konamiProgress.current === KONAMI_SEQUENCE.length) {
          const shiftWasHeld = konamiShiftHeld.current;
          konamiProgress.current = 0;
          konamiShiftHeld.current = true;
          if (shiftWasHeld) {
            e.preventDefault();
            setDoomOpen(true);
          }
        }
      } else {
        // Allow a wrong press to also *start* a new sequence if it matches step 0.
        konamiProgress.current = 0;
        konamiShiftHeld.current = true;
        const firstTarget = KONAMI_SEQUENCE[0];
        if (pressed === (firstTarget.length === 1 ? firstTarget.toLowerCase() : firstTarget)) {
          konamiProgress.current = 1;
          if (!e.shiftKey) konamiShiftHeld.current = false;
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [doomOpen]);

  const applyBackground = useCallback((bg: DesktopBackground) => {
    setBackground(bg);
    saveBackground(bg);
  }, []);

  const appComponents: Record<string, React.ReactNode> = {
    about: <AboutMe />,
    projects: <ProjectsExplorer />,
    skills: <SkillsApp />,
    contact: <ContactApp />,
    notepad: <NotepadApp />,
    browser: <BrowserApp />,
    minesweeper: <MinesweeperApp />,
    dos: <DosPrompt />,
    calculator: <CalculatorApp />,
    help: <HelpApp />,
    display: <DisplayApp current={background} onApply={(bg) => { applyBackground(bg); closeApp('display'); }} />,
  };



  const openApp = useCallback((id: string) => {
    if (id === 'recycle') {
      playDing();
      setRecycleBinAlert(true);
      return;
    }
    setOpenApps(prev => new Set(prev).add(id));
  }, []);

  const closeApp = useCallback((id: string) => {
    setOpenApps(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  return (
    <ClippyProvider agentName="Clippy">
    <div style={{
      width: '100vw',
      height: '100vh',
      ...getBackgroundStyle(background),
      position: 'relative',
      overflow: 'hidden',
      cursor: 'default',
    }}>
      {/* Build string */}
      <div style={{
        position: 'absolute',
        right: '8px',
        bottom: '32px',
        color: '#fff',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: '14px',
        fontWeight: 'bold',
        textShadow: '1px 1px 2px rgba(0,0,0,0.6)',
        pointerEvents: 'none',
        textAlign: 'right',
        lineHeight: '1.4',
      }}>
        Windows 95 Portfolio<br />
        Build 4.00.950.B
      </div>

      {/* Desktop Icons */}
      {desktopIcons.map(icon => (
        <DesktopIcon
          key={icon.id}
          icon={icon.icon}
          label={icon.label}
          tooltip={icon.tooltip}
          position={iconPositions[icon.id] ?? { x: 8, y: 8 }}
          onDoubleClick={() => openApp(icon.id)}
          onMove={(pos) => moveIcon(icon.id, pos)}
        />
      ))}

      {/* App Windows — rendered as React95 Modals that auto-register with TaskBar */}
      {Array.from(openApps).map(id => {
        const config = appConfigs[id];
        if (!config) return null;
        return (
          <Window
            key={id}
            windowState={{
              id,
              title: config.title,
              icon: id === 'dos' ? '' : config.icon,
              isOpen: true,
              isMinimized: false,
              isMaximized: false,
              zIndex: 10,
              position: config.position,
              size: config.size,
            }}
            onClose={() => closeApp(id)}
            onFocus={() => {}}
          >
            {appComponents[id]}
          </Window>
        );
      })}

      {/* React95 TaskBar — handles Start button, window buttons, and clock natively */}
      <TaskBar
        onOpenApp={openApp}
        onShutDown={() => { playChimes(); setShowShutdownDialog(true); }}
      />

      {/* DOOM easter egg — Shift+Konami launches the real game fullscreen.
          Rendered above everything; closing returns to the desktop. */}
      {doomOpen && (
        <Suspense fallback={null}>
          <DoomEasterEgg onClose={() => setDoomOpen(false)} />
        </Suspense>
      )}

      {/* Shut Down Dialog */}
      {showShutdownDialog && (
        <ShutdownDialog
          onYes={(action) => {
            setShowShutdownDialog(false);
            const audio = new Audio(shutdownSound);
            audio.play().catch(() => {});
            audio.addEventListener('ended', () => {
              if (action === 'shutdown') onShutDown();
              else onRestart();
            });
            // Fallback in case 'ended' doesn't fire
            setTimeout(() => {
              if (action === 'shutdown') onShutDown();
              else onRestart();
            }, 5000);
          }}
          onNo={() => setShowShutdownDialog(false)}
        />
      )}

      <ClippyAssistant openApps={openApps} onOpenApp={openApp} />
    </div>
    </ClippyProvider>
  );
}
