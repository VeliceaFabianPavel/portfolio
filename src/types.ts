export interface WindowState {
  id: string;
  title: string;
  icon: React.ComponentType<any> | string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface DesktopIconConfig {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  iconVariant?: string;
  onDoubleClick: () => void;
}

export type BootPhase = 'bios' | 'loading' | 'welcome' | 'desktop';
