import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { BiosScreen } from './BiosScreen';

describe('BiosScreen', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('types out BIOS lines and eventually calls onComplete', () => {
    const onComplete = vi.fn();
    render(<BiosScreen onComplete={onComplete} />);
    act(() => {
      vi.advanceTimersByTime(30 * 65);
    });
    expect(onComplete).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(60 * 65 + 800);
    });
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders at least the first line after first tick', () => {
    const { container } = render(<BiosScreen onComplete={() => {}} />);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(container.textContent).toContain('Award Modular BIOS');
  });
});
