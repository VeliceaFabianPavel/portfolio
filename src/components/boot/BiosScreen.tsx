import { useState, useEffect } from 'react';

interface BiosScreenProps {
  onComplete: () => void;
}

const biosLines = [
  'Award Modular BIOS v6.00PG, An Energy Star Ally',
  'Copyright (C) 1984-95, Award Software, Inc.',
  '',
  'FABIAN-PC ACPI BIOS Revision 1009',
  '',
  'Main Processor : Intel Pentium 133MHz',
  'Memory Test :  16384K OK',
  '',
  'Detecting Primary Master   ... QUANTUM FIREBALL ST3.2A',
  'Detecting Primary Slave    ... None',
  'Detecting Secondary Master ... CREATIVE CD4830E',
  'Detecting Secondary Slave  ... None',
  '',
  'Plug and Play Extensions found',
  '  Creative Labs Sound Blaster 16',
  '  S3 Trio64V+ PCI VGA',
  '  3Com EtherLink III',
  '',
  'PCI device listing ...',
  '  Bus No. Device No. Func No. Vendor/Device     Class          IRQ',
  '  0       7          0        8086/7000         ISA Bridge',
  '  0       7          1        8086/7010         IDE Controller  14',
  '  0       9          0        5333/8811         VGA Compatible  11',
  '',
  'Press DEL to enter SETUP, ESC to skip memory test',
  '04/02/2026-i430VX-W83877-00',
];

export function BiosScreen({ onComplete }: BiosScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let lineIndex = 0;
    const timer = setInterval(() => {
      if (lineIndex < biosLines.length) {
        setVisibleLines(prev => [...prev, biosLines[lineIndex]]);
        lineIndex++;
      } else {
        clearInterval(timer);
        setTimeout(onComplete, 800);
      }
    }, 65);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const blink = setInterval(() => setCursor(prev => !prev), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      color: '#aaa',
      fontFamily: '"Perfect DOS VGA 437", "Courier New", monospace',
      fontSize: '14px',
      lineHeight: '1.3',
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'hidden',
      cursor: 'none',
    }}>
      {visibleLines.map((line, i) => (
        <div key={i} style={{ whiteSpace: 'pre', minHeight: '18px' }}>{line}</div>
      ))}
      {cursor && (
        <span style={{ color: '#aaa', animation: 'none' }}>_</span>
      )}
    </div>
  );
}
