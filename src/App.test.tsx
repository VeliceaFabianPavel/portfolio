import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Start in desktop-width mode so we go through dos, not bsod.
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function advanceInSteps(totalMs: number, stepMs = 500) {
    let remaining = totalMs;
    while (remaining > 0) {
      const step = Math.min(stepMs, remaining);
      act(() => { vi.advanceTimersByTime(step); });
      remaining -= step;
    }
  }

  it('starts on the BIOS screen (not yet at DOS)', () => {
    render(<App />);
    advanceInSteps(1000);
    // Still in CRT/BIOS phase — DOS boot hasn't started yet.
    expect(document.body.textContent).not.toContain('MS-DOS');
  });

  it('routes to BSOD on small screens', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 });
    render(<App />);
    advanceInSteps(10_000);
    expect(screen.getByText(/An error has occurred\./)).toBeInTheDocument();
  });

  it('progresses from BIOS to DOS boot on desktop width', () => {
    render(<App />);
    advanceInSteps(15_000);
    expect(document.body.textContent).not.toContain('Award Modular BIOS');
  });
});
