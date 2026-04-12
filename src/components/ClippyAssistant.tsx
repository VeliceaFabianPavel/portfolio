import { useEffect, useRef, useState, useCallback } from 'react';
import { useClippy } from '@react95/clippy';
import type Agent from 'clippyts/dist/agent';

// ── Context-aware reactions when apps open ─────────────────
const APP_REACTIONS: Record<string, string> = {
  about:
    "Here's Fabian's system properties! He's a Software Developer at Siemens with a Master's in Electronic Communications.",
  projects:
    "PeP5 is a full exam platform with AI grading, Monaco editor, and SafeExamBrowser-level security. Impressive stuff!",
  skills:
    "Fabian's strongest skills: .NET C# at 95%, Git and Blazor at 90%, SQL at 88%. Click the categories to explore!",
  contact:
    "Want to get in touch? Fill in your details and hit Send - it'll open your email client with everything pre-filled.",
  notepad:
    "This is Fabian's resume in plain text. You can read through his experience, education, and publications.",
  browser:
    "Internet Explorer! Type a URL in the address bar to browse. Try visiting Fabian's GitHub!",
  minesweeper:
    "Classic Minesweeper! Left-click to reveal, right-click to flag. Watch out for those mines!",
  dos:
    "MS-DOS Prompt! Try typing HELP to see available commands, or WIN to start Windows 95.",
  calculator:
    "A basic calculator. Click the buttons or use your keyboard to do math.",
  help:
    "Need help navigating? This shows all the keyboard shortcuts and features of this portfolio.",
  display:
    "Change the desktop wallpaper! Pick from the presets or go with a solid color.",
};

// ── Idle tips shown periodically ───────────────────────────
const IDLE_TIPS = [
  "Did you know? Fabian built PeP5 with GPT-4o integration for automatic code grading!",
  "Fabian started at Siemens as an intern in 2023 and got promoted to Software Developer in 2025.",
  "PeP5 is published in Springer's Lecture Notes - check the Publications tab in About Me!",
  "This portfolio runs on React, TypeScript, Vite, and the React95 component library.",
  "PeP5 supports Python, Java, JavaScript and C# with multi-file project support.",
  "Fabian is pursuing a Master's in Electronic and Integrated Communications Systems.",
  "You can drag desktop icons around! Press F3 to reset them.",
  "Psst... try holding Ctrl and clicking on me for a surprise!",
];

// ── Interactive menu options ───────────────────────────────
interface MenuOption {
  label: string;
  action: string;
}

const MAIN_MENU: MenuOption[] = [
  { label: 'Who is Fabian?', action: 'about' },
  { label: 'Show me his projects', action: 'projects' },
  { label: 'What skills does he have?', action: 'skills' },
  { label: 'I want to contact him', action: 'contact' },
  { label: 'Show me his resume', action: 'notepad' },
  { label: 'Do a trick!', action: 'trick' },
  { label: 'Go away', action: 'hide' },
];

interface ClippyAssistantProps {
  openApps: Set<string>;
  onOpenApp: (id: string) => void;
}

// Clean up orphaned Clippy DOM nodes from StrictMode double-mount.
function cleanupOrphanedClippys() {
  const clippys = document.querySelectorAll('.clippy');
  for (let i = 0; i < clippys.length - 1; i++) {
    clippys[i].remove();
  }
}

export function ClippyAssistant({ openApps, onOpenApp }: ClippyAssistantProps) {
  const { clippy } = useClippy();
  const initialized = useRef(false);
  const prevApps = useRef<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [secretMenu, setSecretMenu] = useState(false);
  const idleTimer = useRef<ReturnType<typeof setInterval>>(undefined);
  const lastTipIndex = useRef(-1);
  const hidden = useRef(false);

  // ── Cleanup duplicate DOM nodes ──────────────────────────
  useEffect(() => {
    const t = setTimeout(cleanupOrphanedClippys, 500);
    return () => clearTimeout(t);
  }, []);

  // ── Initialise Clippy once ───────────────────────────────
  useEffect(() => {
    if (!clippy || initialized.current) return;
    initialized.current = true;

    clippy.moveTo(window.innerWidth - 180, window.innerHeight - 200, 0);

    // Greet after 2s.
    const greet = setTimeout(() => {
      clippy.play('Wave');
      clippy.speak(
        "Hi! I'm Clippy. Click me if you need help exploring Fabian's portfolio!",
        false,
      );
    }, 2000);

    // Idle tips every 45s.
    idleTimer.current = setInterval(() => {
      if (!hidden.current) showIdleTip(clippy);
    }, 45000);

    return () => {
      clearTimeout(greet);
      if (idleTimer.current) clearInterval(idleTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clippy]);

  // ── Document-level click to detect clicks on .clippy ─────
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clippyEl = target.closest('.clippy');
      const menuEl = document.getElementById('clippy-menu');

      if (clippyEl && !hidden.current) {
        // Clicked on Clippy — toggle menu. Ctrl+Click opens the secret menu.
        const isSecret = e.ctrlKey;
        const rect = clippyEl.getBoundingClientRect();
        const items = isSecret ? 1 : MAIN_MENU.length;
        setMenuPos({
          x: rect.left - 160,
          y: rect.top - items * 28 - 16,
        });
        setSecretMenu(isSecret);
        setMenuOpen(prev => !prev);
        return;
      }

      // Clicked outside both Clippy and the menu — close menu.
      if (menuEl && !menuEl.contains(target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // ── React to app opens ───────────────────────────────────
  useEffect(() => {
    if (!clippy || hidden.current) return;

    for (const id of openApps) {
      if (!prevApps.current.has(id) && APP_REACTIONS[id]) {
        clippy.stop();
        clippy.play('Searching');
        clippy.speak(APP_REACTIONS[id], false);
        break;
      }
    }
    prevApps.current = new Set(openApps);
  }, [openApps, clippy]);

  // ── Idle tip rotator ─────────────────────────────────────
  const showIdleTip = useCallback((agent: Agent) => {
    let idx = Math.floor(Math.random() * IDLE_TIPS.length);
    if (idx === lastTipIndex.current) idx = (idx + 1) % IDLE_TIPS.length;
    lastTipIndex.current = idx;
    agent.animate();
    agent.speak(IDLE_TIPS[idx], false);
  }, []);

  // ── Handle menu option selection ─────────────────────────
  const handleMenuSelect = useCallback(
    (action: string) => {
      setMenuOpen(false);
      if (!clippy) return;

      if (action === 'trick') {
        clippy.animate();
        return;
      }
      if (action === 'secret') {
        clippy.play('GetAttention');
        clippy.speak(
          "You found a secret! Hold Shift and type the Konami code: Up Up Down Down Left Right Left Right B A Enter. This will launch the REAL DOOM (1993) right inside this portfolio!",
          false,
        );
        return;
      }
      if (action === 'hide') {
        clippy.play('GoodBye');
        clippy.speak("Okay, I'll go away. Refresh the page if you miss me!", false);
        hidden.current = true;
        setTimeout(() => {
          try { clippy.hide(false, () => {}); } catch { /* ignore */ }
        }, 3000);
        if (idleTimer.current) clearInterval(idleTimer.current);
        return;
      }

      // Open the requested app.
      onOpenApp(action);
    },
    [clippy, onOpenApp],
  );

  if (!menuOpen) return null;

  return (
    <div
      id="clippy-menu"
      style={{
        position: 'fixed',
        left: menuPos.x,
        top: menuPos.y,
        zIndex: 99999,
        background: '#c0c0c0',
        border: '2px solid',
        borderColor: '#ffffff #808080 #808080 #ffffff',
        boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        fontSize: 12,
        minWidth: 180,
        padding: 2,
      }}
    >
      <div
        style={{
          background: '#000080',
          color: '#fff',
          padding: '3px 6px',
          fontWeight: 'bold',
          marginBottom: 2,
          fontSize: 11,
        }}
      >
        {secretMenu ? 'Shhh...' : 'What would you like to do?'}
      </div>
      {secretMenu ? (
        <div
          onClick={() => handleMenuSelect('secret')}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#000080';
            (e.currentTarget as HTMLElement).style.color = '#fff';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#000';
          }}
          style={{
            padding: '4px 8px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Tell me a secret...
        </div>
      ) : (
        MAIN_MENU.map(opt => (
          <div
            key={opt.action}
            onClick={() => handleMenuSelect(opt.action)}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#000080';
              (e.currentTarget as HTMLElement).style.color = '#fff';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = 'transparent';
              (e.currentTarget as HTMLElement).style.color = '#000';
            }}
            style={{
              padding: '4px 8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {opt.label}
          </div>
        ))
      )}
    </div>
  );
}
