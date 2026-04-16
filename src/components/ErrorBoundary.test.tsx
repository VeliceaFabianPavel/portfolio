import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function Bomb({ fire }: { fire: boolean }) {
  if (fire) throw new Error('boom');
  return <div>safe</div>;
}

describe('ErrorBoundary', () => {
  const origError = console.error;

  beforeEach(() => {
    // Silence React's "The above error occurred…" during the fatal test.
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = origError;
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>hello</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('displays a fatal error dialog when a child throws', () => {
    render(
      <ErrorBoundary>
        <Bomb fire />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Program Error')).toBeInTheDocument();
    expect(screen.getByText('boom')).toBeInTheDocument();
  });

  it('catches window error events and surfaces an alert', () => {
    render(
      <ErrorBoundary>
        <div>ok</div>
      </ErrorBoundary>,
    );
    act(() => {
      window.dispatchEvent(
        new ErrorEvent('error', { message: 'something went wrong' }),
      );
    });
    expect(screen.getByText(/something went wrong/)).toBeInTheDocument();
  });

  it('catches unhandled rejections and surfaces an alert', () => {
    render(
      <ErrorBoundary>
        <div>ok</div>
      </ErrorBoundary>,
    );
    act(() => {
      const ev = Object.assign(new Event('unhandledrejection'), {
        reason: new Error('async boom'),
        promise: Promise.resolve(),
      }) as unknown as PromiseRejectionEvent;
      window.dispatchEvent(ev);
    });
    expect(screen.getByText(/async boom/)).toBeInTheDocument();
  });
});
