import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DesktopIcon } from './DesktopIcon';
import { Computer } from '@react95/icons';

describe('DesktopIcon', () => {
  it('renders label', () => {
    render(
      <DesktopIcon
        icon={Computer}
        label="My Computer"
        position={{ x: 0, y: 0 }}
        onDoubleClick={() => {}}
        onMove={() => {}}
      />,
    );
    expect(screen.getByText('My Computer')).toBeInTheDocument();
  });

  it('double-click fires onDoubleClick', () => {
    const onDoubleClick = vi.fn();
    render(
      <DesktopIcon
        icon={Computer}
        label="My Computer"
        position={{ x: 0, y: 0 }}
        onDoubleClick={onDoubleClick}
        onMove={() => {}}
      />,
    );
    fireEvent.doubleClick(screen.getByText('My Computer').parentElement!);
    expect(onDoubleClick).toHaveBeenCalledTimes(1);
  });

  it('positions via absolute left/top', () => {
    const { container } = render(
      <DesktopIcon
        icon={Computer}
        label="X"
        position={{ x: 123, y: 45 }}
        onDoubleClick={() => {}}
        onMove={() => {}}
      />,
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.style.left).toBe('123px');
    expect(root.style.top).toBe('45px');
  });

  it('string icon renders an img', () => {
    render(
      <DesktopIcon
        icon="/path/to/icon.png"
        label="Strm"
        position={{ x: 0, y: 0 }}
        onDoubleClick={() => {}}
        onMove={() => {}}
      />,
    );
    const img = document.querySelector('img[src="/path/to/icon.png"]');
    expect(img).toBeInTheDocument();
  });
});
