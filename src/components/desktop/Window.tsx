import { Modal, TitleBar } from '@react95/core';
import type { WindowState } from '../../types';

interface WindowProps {
  windowState: WindowState;
  onClose: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}

export function Window({
  windowState,
  onClose,
  onFocus,
  children,
}: WindowProps) {
  const Icon = windowState.icon;

  if (!windowState.isOpen) return null;

  const iconElement = Icon
    ? (typeof Icon === 'string'
      ? <img src={Icon} alt="" style={{ width: 32, height: 32 }} />
      : <Icon variant="32x32_4" />)
    : undefined;

  return (
    <div onMouseDown={onFocus}>
      <Modal
        {...(iconElement ? { icon: iconElement } : {})}
        title={windowState.title}
        dragOptions={{
          defaultPosition: windowState.position,
        }}
        style={{
          width: windowState.size.width,
          height: windowState.size.height,
          zIndex: windowState.zIndex,
          resize: 'both',
          overflow: 'auto',
        }}
        titleBarOptions={[
          <TitleBar.Close key="close" onClick={onClose} />,
        ]}
      >
        {children}
      </Modal>
    </div>
  );
}
