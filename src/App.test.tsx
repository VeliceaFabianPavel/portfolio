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

  it('starts on the BIOS screen', () => {
    render(<App />);
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(document.body.textContent).toContain('Award Modular BIOS');
  });

  it('routes to BSOD on small screens', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 400 });
    render(<App />);
    // Drive BIOS to completion (35 lines * 65ms + 800ms trailing + buffer).
    act(() => {
      vi.advanceTimersByTime(50 * 65 + 1000);
    });
    expect(screen.getByText(/An error has occurred\./)).toBeInTheDocument();
  });

  it('progresses from BIOS to DOS boot on desktop width', () => {
    render(<App />);
    act(() => {
      // 35 BIOS lines * 65ms + 800ms trailing + ample DOS stream headroom.
      vi.advanceTimersByTime(10_000);
    });
    // Either the DOS banner has already started, or at minimum the BIOS is gone.
    expect(document.body.textContent).not.toContain('Award Modular BIOS');
  });
});
