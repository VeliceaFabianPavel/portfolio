import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { BiosScreen } from './BiosScreen';

describe('BiosScreen', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function advanceSteps(totalMs: number, stepMs = 200) {
    let remaining = totalMs;
    while (remaining > 0) {
      const step = Math.min(stepMs, remaining);
      act(() => { vi.advanceTimersByTime(step); });
      remaining -= step;
    }
  }

  it('starts with a blank CRT-dead screen', () => {
    const { container } = render(<BiosScreen onComplete={() => {}} />);
    expect(container.textContent).toBe('');
  });

  it('shows the spark line during early startup', () => {
    const { container } = render(<BiosScreen onComplete={() => {}} />);
    advanceSteps(500);
    const spark = container.querySelector('div[style*="radial-gradient"]');
    expect(spark).toBeInTheDocument();
  });

  it('calls onComplete after CRT startup and all BIOS lines', () => {
    const onComplete = vi.fn();
    render(<BiosScreen onComplete={onComplete} />);
    advanceSteps(10_000);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders BIOS text once fully on', () => {
    render(<BiosScreen onComplete={() => {}} />);
    advanceSteps(4000);
    const content = document.body.textContent ?? '';
    expect(content).toContain('BIOS');
  });

  it('has scanline overlay on the final screen', () => {
    render(<BiosScreen onComplete={() => {}} />);
    advanceSteps(4000);
    const scanlines = document.querySelector('div[style*="repeating-linear-gradient"]');
    expect(scanlines).toBeInTheDocument();
  });

  it('forces body background to black during CRT phase', () => {
    render(<BiosScreen onComplete={() => {}} />);
    act(() => { vi.advanceTimersByTime(0); });
    expect(document.body.style.backgroundColor).toMatch(/^(#000|rgb\(0,\s*0,\s*0\))$/);
  });
});
