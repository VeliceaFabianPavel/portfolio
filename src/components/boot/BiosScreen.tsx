import { useState, useEffect, useRef } from 'react';
import energyBios from '../../assets/wallpapers/energy_bios.jpg';

interface BiosScreenProps {
  onComplete: () => void;
}

const biosLines = [
  'Award Modular BIOS v6.00PG, An Energy Star Ally',
  'Copyright (C) 1984-95, Award Software, Inc.',
  '',
  'FABIAN-PC ACPI BIOS Revision 1009',
  '04/02/2026-i430VX-W83877-2A4C1F00C-00',
  '',
  'Intel Pentium(R) Processor 133MHz',
  'Speed : 133MHz   Bus Clock : 66MHz   Multiplier : x2',
  'L1 Cache : 16K   L2 Cache : 256K',
  'Coprocessor : Installed',
  '',
  'Memory Test :  640K Base Memory       OK',
  'Memory Test :  15360K Extended Memory OK',
  'Memory Test :  384K Cache SRAM        OK',
  'Memory Test :  Total 16384K           OK',
  '',
  'ATAPI CD-ROM : CREATIVE CD4830E',
  '',
  'Award Plug and Play BIOS Extension v1.0A',
  'Copyright (C) 1995, Award Software, Inc.',
  'Initializing Plug and Play cards ...',
  '  PnP Init Complete.',
  '',
  'Detecting IDE drives ...',
  'Detecting Primary Master   ... QUANTUM FIREBALL ST3.2A     3249MB  LBA',
  'Detecting Primary Slave    ... MAXTOR 71626A               1625MB  LBA',
  'Detecting Secondary Master ... CREATIVE CD4830E  48X  ATAPI',
  'Detecting Secondary Slave  ... None',
  '',
  'Primary Master  : LBA, Multi-Sector Transfers, UDMA Mode 2',
  'Primary Slave   : LBA, Multi-Sector Transfers, PIO Mode 4',
  '',
  'Floppy disk(s) fail (40)',
  'CMOS checksum error - Defaults loaded',
  'CMOS Date/Time Not Set - Press F2 to set',
  '',
  'Plug and Play Extensions found ...',
  '  IRQ 5   Creative Labs Sound Blaster 16 PnP    I/O 220h',
  '  IRQ 11  S3 Trio64V+ PCI VGA Adapter           4MB DRAM',
  '  IRQ 10  3Com EtherLink III 3C509B-TPO          10Base-T',
  '  IRQ 9   Adaptec AHA-1542CF SCSI Host Adapter',
  '  IRQ 12  Microsoft PS/2 Mouse Port',
  '  IRQ 14  Primary IDE Controller',
  '  IRQ 15  Secondary IDE Controller',
  '',
  'Initializing USB Controllers ... Done.',
  'USB Device(s) : 1 Keyboard, 1 Mouse',
  '',
  'PCI device listing ...',
  '  Bus No. Device No. Func No. Vendor/Device     Class            IRQ',
  '  -----   ---------  -------  -------------     -----            ---',
  '  0       0          0        8086/1237         Host Bridge',
  '  0       1          0        8086/7000         PCI-to-ISA',
  '  0       7          0        8086/7110         PIIX4 ISA',
  '  0       7          1        8086/7111         PIIX4 IDE         14',
  '  0       7          2        8086/7112         PIIX4 USB         11',
  '  0       7          3        8086/7113         PIIX4 ACPI',
  '  0       9          0        5333/8811         S3 Trio64V+       11',
  '  0       10         0        10B7/5900         3Com 3C590        10',
  '  0       11         0        9004/8178         Adaptec AHA        9',
  '',
  'Verifying DMI Pool Data .......... ',
  'DMI Pool Data Successfully Verified',
  '',
  'System Configuration:',
  '  Processor    : Intel Pentium 133MHz',
  '  Memory       : 16384K (16MB EDO DRAM)',
  '  Disk 0       : QUANTUM FIREBALL ST3.2A 3249MB',
  '  Disk 1       : MAXTOR 71626A 1625MB',
  '  Video        : S3 Trio64V+ 4MB',
  '  Audio        : Sound Blaster 16 PnP',
  '  Network      : 3Com EtherLink III',
  '',
];

const biosFooterLines = [
  'Press DEL to enter SETUP, F8 for Boot Menu',
  '04/02/2026-i430VX-W83877-00',
];

const CRT_STYLE_ID = 'crt-boot-fx';

function injectStyles() {
  if (document.getElementById(CRT_STYLE_ID)) return;
  const s = document.createElement('style');
  s.id = CRT_STYLE_ID;
  s.textContent = `
    .crt-screen {
      width: 100vw; height: 100vh;
      background: #000;
      overflow-y: auto;
      overflow-x: hidden;
      cursor: none;
      position: relative;
    }
    .crt-scroll-area::-webkit-scrollbar { display: none; }

    /* ── White dot ignition ── */
    .crt-dot {
      position: absolute;
      top: 50%; left: 50%;
      width: 6px; height: 6px;
      margin: -3px 0 0 -3px;
      border-radius: 50%;
      background: #fff;
      box-shadow:
        0 0 8px 4px rgba(255,255,255,0.9),
        0 0 30px 12px rgba(200,210,255,0.5),
        0 0 80px 30px rgba(150,170,255,0.15);
      animation: dot-pop 0.35s ease-out forwards;
    }
    @keyframes dot-pop {
      0%   { opacity: 0; transform: scale(0); }
      35%  { opacity: 1; transform: scale(2); }
      55%  { opacity: 0.6; transform: scale(0.7); }
      75%  { opacity: 1; transform: scale(1.3); }
      100% { opacity: 1; transform: scale(1); }
    }

    /* ── Dot stretches to horizontal line ── */
    .crt-hline {
      position: absolute;
      top: 50%; left: 0; right: 0;
      height: 2px; margin-top: -1px;
      background: linear-gradient(90deg,
        transparent 1%, rgba(255,255,255,0.3) 8%,
        #fff 30%, #fff 70%,
        rgba(255,255,255,0.3) 92%, transparent 99%);
      box-shadow:
        0 0 12px 3px rgba(255,255,255,0.7),
        0 0 40px 10px rgba(200,210,255,0.2);
      animation: hline-stretch 0.25s cubic-bezier(0.22,1,0.36,1) forwards;
    }
    @keyframes hline-stretch {
      0%   { transform: scaleX(0); opacity: 0.6; }
      100% { transform: scaleX(1); opacity: 1; }
    }

    /* ── Full-screen white flash + fade to black ── */
    .crt-flash {
      position: absolute; inset: 0;
      background: #fff;
      animation: flash-fade 0.6s ease-out forwards;
      z-index: 10;
    }
    @keyframes flash-fade {
      0%   { opacity: 0.85; }
      15%  { opacity: 0.5; }
      30%  { opacity: 0.15; }
      50%  { opacity: 0.05; }
      100% { opacity: 0; }
    }

    /* ── Tube warmup flicker after flash ── */
    .crt-flicker {
      animation: tube-flicker 0.4s ease-out forwards;
    }
    @keyframes tube-flicker {
      0%   { opacity: 0.05; }
      8%   { opacity: 0.7; }
      16%  { opacity: 0.02; }
      28%  { opacity: 0.85; }
      36%  { opacity: 0.1; }
      48%  { opacity: 0.9; }
      60%  { opacity: 0.6; }
      75%  { opacity: 0.95; }
      100% { opacity: 1; }
    }

    /* ── Persistent CRT look ── */
    .crt-scanlines {
      position: absolute; inset: 0;
      background: repeating-linear-gradient(0deg,
        transparent, transparent 2px,
        rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px);
      pointer-events: none; z-index: 3;
    }
    .crt-curve {
      position: absolute; inset: 0;
      box-shadow: inset 0 0 100px 40px rgba(0,0,0,0.45);
      border-radius: 12px;
      pointer-events: none; z-index: 3;
    }
    .crt-glow {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 50% 50%,
        rgba(200,200,255,0.025) 0%, transparent 65%);
      pointer-events: none; z-index: 1;
    }
  `;
  document.head.appendChild(s);
}

type Phase = 'off' | 'dot' | 'line' | 'flash' | 'flicker' | 'on';

export function BiosScreen({ onComplete }: BiosScreenProps) {
  const [phase, setPhase] = useState<Phase>('off');
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    injectStyles();
    const prevBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#000';

    const t = [
      setTimeout(() => setPhase('dot'), 200),
      setTimeout(() => setPhase('line'), 550),
      setTimeout(() => setPhase('flash'), 800),
      setTimeout(() => setPhase('flicker'), 1100),
      setTimeout(() => setPhase('on'), 1500),
    ];

    return () => {
      t.forEach(clearTimeout);
      document.body.style.backgroundColor = prevBg;
    };
  }, []);

  useEffect(() => {
    if (phase !== 'on') return;
    let idx = 0;
    const iv = setInterval(() => {
      if (idx < biosLines.length) {
        setVisibleLines(prev => [...prev, biosLines[idx]]);
        idx++;
      } else {
        clearInterval(iv);
        setTimeout(onComplete, 800);
      }
    }, 30);
    return () => clearInterval(iv);
  }, [phase, onComplete]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [visibleLines]);

  useEffect(() => {
    const iv = setInterval(() => setCursor(p => !p), 530);
    return () => clearInterval(iv);
  }, []);

  if (phase === 'off') {
    return <div className="crt-screen" />;
  }

  if (phase === 'dot') {
    return (
      <div className="crt-screen">
        <div className="crt-dot" />
      </div>
    );
  }

  if (phase === 'line') {
    return (
      <div className="crt-screen">
        <div className="crt-hline" />
      </div>
    );
  }

  if (phase === 'flash') {
    return (
      <div className="crt-screen">
        <div className="crt-flash" />
        <div className="crt-scanlines" />
      </div>
    );
  }

  if (phase === 'flicker') {
    return (
      <div className="crt-screen crt-flicker">
        <div className="crt-scanlines" />
        <div className="crt-curve" />
      </div>
    );
  }

  return (
    <div
      data-testid="bios-screen"
      className="crt-screen"
      style={{
        color: '#33ff33',
        fontFamily: '"Perfect DOS VGA 437", "Courier New", monospace',
        fontSize: '16px',
        fontWeight: 'bold',
        lineHeight: '1.35',
        boxSizing: 'border-box',
        textShadow: '0 0 4px rgba(51,255,51,0.4)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div className="crt-scanlines" />
      <div className="crt-curve" />
      <div className="crt-glow" />

      <img
        src={energyBios}
        alt="Energy Star"
        style={{
          position: 'fixed',
          top: '20px',
          right: '30px',
          width: '240px',
          opacity: 0.85,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '20px 20px 0 20px',
          scrollbarWidth: 'none',
        }}
        className="crt-scroll-area"
      >
        {visibleLines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre', minHeight: '18px', position: 'relative', zIndex: 2 }}>{line}</div>
        ))}
        {cursor && (
          <span style={{ color: '#33ff33', position: 'relative', zIndex: 2, textShadow: '0 0 4px rgba(51,255,51,0.4)' }}>_</span>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        flexShrink: 0,
        padding: '8px 20px 20px 20px',
        position: 'relative',
        zIndex: 2,
        borderTop: '1px solid rgba(51,255,51,0.15)',
      }}>
        {biosFooterLines.map((line, i) => (
          <div key={i} style={{ whiteSpace: 'pre', minHeight: '18px' }}>{line}</div>
        ))}
      </div>
    </div>
  );
}
