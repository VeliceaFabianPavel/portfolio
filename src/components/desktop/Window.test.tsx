import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Window } from './Window';
import type { WindowState } from '../../types';
import { Computer } from '@react95/icons';

function makeState(overrides: Partial<WindowState> = {}): WindowState {
  return {
    id: 'test',
    title: 'Test Window',
    icon: Computer,
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 1,
    position: { x: 10, y: 20 },
    size: { width: 300, height: 200 },
    ...overrides,
  };
}

describe('Window', () => {
  it('renders children when open', () => {
    render(
      <Window windowState={makeState()} onClose={() => {}} onFocus={() => {}}>
        <div>inside</div>
      </Window>,
    );
    expect(screen.getByText('inside')).toBeInTheDocument();
    expect(screen.getByText('Test Window')).toBeInTheDocument();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Window windowState={makeState({ isOpen: false })} onClose={() => {}} onFocus={() => {}}>
        <div>inside</div>
      </Window>,
    );
    expect(container.textContent).toBe('');
  });

  it('onFocus fires when mousedown on the wrapper', () => {
    const onFocus = vi.fn();
    render(
      <Window windowState={makeState()} onClose={() => {}} onFocus={onFocus}>
        <div data-testid="child">inside</div>
      </Window>,
    );
    screen.getByTestId('child').dispatchEvent(
      new MouseEvent('mousedown', { bubbles: true }),
    );
    expect(onFocus).toHaveBeenCalled();
  });
});
