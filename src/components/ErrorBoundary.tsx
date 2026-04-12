import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import { Alert } from '@react95/core';
import { playChord } from '../sounds';

interface ErrorEntry {
  id: number;
  title: string;
  message: string;
  type: 'error' | 'warning';
}

interface Props {
  children: ReactNode;
}

interface State {
  /** Fatal React render error — replaces the child tree. */
  fatalError: string | null;
  /** Non-fatal alerts (runtime errors, unhandled rejections, console warnings). */
  alerts: ErrorEntry[];
}

let nextId = 0;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { fatalError: null, alerts: [] };

  private originalConsoleError: typeof console.error = console.error;
  private originalConsoleWarn: typeof console.warn = console.warn;

  // ── React render errors ─────────────────────────────────
  static getDerivedStateFromError(error: Error): Partial<State> {
    return { fatalError: error.message || String(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    this.originalConsoleError('[ErrorBoundary]', error, info.componentStack);
  }

  // ── Global runtime errors & console intercepts ──────────
  componentDidMount() {
    window.addEventListener('error', this.handleWindowError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);

    // Intercept console.warn / console.error so React warnings
    // (e.g. "Each child should have a unique key") surface as
    // Win95 alert dialogs instead of only appearing in DevTools.
    console.error = (...args: unknown[]) => {
      this.originalConsoleError.apply(console, args);
      const msg = args.map(a => (typeof a === 'string' ? a : String(a))).join(' ');
      // Skip noisy internal lines (e.g. React stack frames).
      if (msg.startsWith('    at ')) return;
      this.pushAlert('error', msg);
    };

    console.warn = (...args: unknown[]) => {
      this.originalConsoleWarn.apply(console, args);
      const msg = args.map(a => (typeof a === 'string' ? a : String(a))).join(' ');
      this.pushAlert('warning', msg);
    };
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.handleWindowError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
    console.error = this.originalConsoleError;
    console.warn = this.originalConsoleWarn;
  }

  private handleWindowError = (e: ErrorEvent) => {
    const msg = e.message || 'Unknown error';
    this.pushAlert('error', msg);
  };

  private handleUnhandledRejection = (e: PromiseRejectionEvent) => {
    const msg = e.reason?.message || String(e.reason) || 'Unhandled promise rejection';
    this.pushAlert('error', msg);
  };

  private pushAlert(type: 'error' | 'warning', message: string) {
    // Truncate long messages so the dialog doesn't overflow.
    const truncated = message.length > 200 ? message.slice(0, 200) + '...' : message;
    playChord();
    this.setState(prev => ({
      alerts: [...prev.alerts, { id: nextId++, title: type === 'error' ? 'Error' : 'Warning', message: truncated, type }],
    }));
  }

  private dismissAlert = (id: number) => {
    this.setState(prev => ({
      alerts: prev.alerts.filter(a => a.id !== id),
    }));
  };

  private dismissFatal = () => {
    this.setState({ fatalError: null });
  };

  render() {
    const { fatalError, alerts } = this.state;

    // Fatal error — can't render children, show BSOD-style dialog.
    if (fatalError) {
      return (
        <div style={{
          width: '100vw',
          height: '100vh',
          background: '#008080',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Alert
            title="Program Error"
            type="error"
            message={fatalError}
            buttons={[{ value: 'OK', onClick: this.dismissFatal }]}
            closeAlert={this.dismissFatal}
            dragOptions={{
              defaultPosition: {
                x: Math.floor(window.innerWidth / 2) - 150,
                y: Math.floor(window.innerHeight / 2) - 60,
              },
            }}
          />
        </div>
      );
    }

    return (
      <>
        {this.props.children}

        {/* Non-fatal alerts stack from center, offset downward */}
        {alerts.map((alert, i) => (
          <Alert
            key={alert.id}
            title={alert.title}
            type={alert.type === 'warning' ? 'warning' : 'error'}
            message={alert.message}
            buttons={[{ value: 'OK', onClick: () => this.dismissAlert(alert.id) }]}
            closeAlert={() => this.dismissAlert(alert.id)}
            dragOptions={{
              defaultPosition: {
                x: Math.floor(window.innerWidth / 2) - 150 + i * 20,
                y: Math.floor(window.innerHeight / 2) - 60 + i * 20,
              },
            }}
            style={{ zIndex: 99999 + i }}
          />
        ))}
      </>
    );
  }
}
