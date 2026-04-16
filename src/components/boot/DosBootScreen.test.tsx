import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { DosBootScreen } from './DosBootScreen';

describe('DosBootScreen', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function bootFully() {
    act(() => {
      vi.advanceTimersByTime(100 * 40);
    });
  }

  it('types out MS-DOS boot info over time', () => {
    render(<DosBootScreen onComplete={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(80);
    });
    expect(screen.getByText(/Microsoft\(R\) MS-DOS/)).toBeInTheDocument();
  });

  it('WIN command triggers onComplete after delay', () => {
    const onComplete = vi.fn();
    render(<DosBootScreen onComplete={onComplete} />);
    bootFully();

    const input = document.querySelector('input') as HTMLInputElement;
    act(() => {
      input.value = 'win';
      fireEvent.input(input);
      fireEvent.keyDown(input, { key: 'Enter' });
    });

    expect(screen.getByText(/Starting Microsoft Windows 95/)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('VER prints MS-DOS version', () => {
    render(<DosBootScreen onComplete={() => {}} />);
    bootFully();

    const input = document.querySelector('input') as HTMLInputElement;
    act(() => {
      input.value = 'ver';
      fireEvent.input(input);
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(screen.getByText('MS-DOS Version 6.22')).toBeInTheDocument();
  });

  it('unknown command reports bad command', () => {
    render(<DosBootScreen onComplete={() => {}} />);
    bootFully();

    const input = document.querySelector('input') as HTMLInputElement;
    act(() => {
      input.value = 'nope';
      fireEvent.input(input);
      fireEvent.keyDown(input, { key: 'Enter' });
    });
    expect(screen.getByText('Bad command or file name')).toBeInTheDocument();
  });
});
