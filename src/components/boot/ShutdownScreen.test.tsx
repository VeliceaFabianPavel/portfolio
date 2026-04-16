import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ShutdownScreen } from './ShutdownScreen';

describe('ShutdownScreen', () => {
  const originalLocation = window.location;

  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('shows the shutting-down image initially', () => {
    render(<ShutdownScreen mode="shutdown" />);
    expect(screen.getByAltText('Windows is shutting down')).toBeInTheDocument();
  });

  it('transitions to the safe-to-turn-off screen after 2 seconds', () => {
    render(<ShutdownScreen mode="shutdown" />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(
      screen.getByAltText("It's now safe to turn off your computer"),
    ).toBeInTheDocument();
  });

  it('restart mode reloads the window after 2 seconds', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });
    render(<ShutdownScreen mode="restart" />);
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(reload).toHaveBeenCalledTimes(1);
  });
});
