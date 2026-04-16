import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BlueScreen } from './BlueScreen';

describe('BlueScreen', () => {
  const originalLocation = window.location;

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
  });

  it('shows BSOD text', () => {
    render(<BlueScreen />);
    expect(screen.getByText(/An error has occurred\./)).toBeInTheDocument();
    expect(screen.getByText(/Error: 0E : 016F/)).toBeInTheDocument();
    // "Windows" appears both as the banner label and inside the error copy.
    expect(screen.getAllByText(/Windows/).length).toBeGreaterThanOrEqual(1);
  });

  it('reloads page on any keydown', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });
    render(<BlueScreen />);
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(reload).toHaveBeenCalled();
  });

  it('reloads page on click', () => {
    const reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    });
    render(<BlueScreen />);
    fireEvent.click(screen.getByText(/An error has occurred\./));
    expect(reload).toHaveBeenCalled();
  });
});
