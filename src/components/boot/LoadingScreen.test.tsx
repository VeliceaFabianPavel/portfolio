import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoadingScreen } from './LoadingScreen';

describe('LoadingScreen', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the boot image', () => {
    render(<LoadingScreen onComplete={() => {}} />);
    expect(screen.getByAltText('Windows 95 Boot')).toBeInTheDocument();
  });

  it('calls onComplete after 5 seconds', () => {
    const onComplete = vi.fn();
    render(<LoadingScreen onComplete={onComplete} />);
    vi.advanceTimersByTime(4999);
    expect(onComplete).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('clicking skips the loading', async () => {
    vi.useRealTimers(); // userEvent needs real timers
    const onComplete = vi.fn();
    render(<LoadingScreen onComplete={onComplete} />);
    await userEvent.click(screen.getByAltText('Windows 95 Boot'));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
