import { useState } from 'react';

interface DesktopIconProps {
  icon: React.ComponentType<any> | string;
  label: string;
  onDoubleClick: () => void;
}

export function DesktopIcon({ icon: Icon, label, onDoubleClick }: DesktopIconProps) {
  const [selected, setSelected] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '70px',
        padding: '4px',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onClick={(e) => {
        e.stopPropagation();
        setSelected(true);
      }}
      onDoubleClick={onDoubleClick}
      onBlur={() => setSelected(false)}
      tabIndex={0}
    >
      <div style={{
        padding: '2px',
        backgroundColor: selected ? 'rgba(0,0,128,0.4)' : 'transparent',
      }}>
        {typeof Icon === 'string' ? <img src={Icon} alt="" style={{ width: 32, height: 32 }} /> : <Icon variant="32x32_4" />}
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
      }}>
        {label}
      </span>
    </div>
  );
}
