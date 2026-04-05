import { useState, useRef } from 'react';

interface DesktopIconProps {
  icon: React.ComponentType<any> | string;
  label: string;
  position: { x: number; y: number };
  onDoubleClick: () => void;
  onMove: (pos: { x: number; y: number }) => void;
}

export function DesktopIcon({ icon: Icon, label, position, onDoubleClick, onMove }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);
  const dragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const moved = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setSelected(true);
    dragging.current = true;
    moved.current = false;
    dragStart.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...position };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      moved.current = true;
    }
    if (moved.current) {
      onMove({
        x: startPos.current.x + dx,
        y: startPos.current.y + dy,
      });
    }
  };

  const GRID_X = 75;
  const GRID_Y = 75;

  const handlePointerUp = () => {
    if (dragging.current && moved.current) {
      // Snap to grid
      onMove({
        x: Math.round(position.x / GRID_X) * GRID_X,
        y: Math.round(position.y / GRID_Y) * GRID_Y,
      });
    }
    dragging.current = false;
  };

  const handleDoubleClick = () => {
    if (!moved.current) {
      onDoubleClick();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '70px',
        padding: '4px',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div style={{
        padding: '2px',
        backgroundColor: selected ? 'rgba(0,0,128,0.4)' : 'transparent',
      }}>
        {typeof Icon === 'string' ? <img src={Icon} alt="" style={{ width: 32, height: 32, pointerEvents: 'none' }} /> : <Icon variant="32x32_4" />}
      </div>
      <span style={{
        color: '#fff',
        fontSize: '11px',
        fontFamily: '"MS Sans Serif", Arial, sans-serif',
        textAlign: 'center',
        marginTop: '2px',
        textShadow: '1px 1px 1px rgba(0,0,0,0.8)',
        backgroundColor: selected ? '#000080' : 'transparent',
        padding: '1px 2px',
        lineHeight: '1.2',
        wordBreak: 'break-word',
        maxWidth: '68px',
        pointerEvents: 'none',
      }}>
        {label}
      </span>
    </div>
  );
}
