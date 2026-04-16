import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DosPrompt } from './DosPrompt';

describe('DosPrompt', () => {
  beforeEach(() => {
    // Stubs out window.open for the `github` command.
    vi.stubGlobal('open', vi.fn());
  });

  it('shows the welcome banner on mount', () => {
    render(<DosPrompt />);
    expect(screen.getByText(/Microsoft\(R\) Windows 95/)).toBeInTheDocument();
    expect(screen.getByText(/Type 'help' for available commands/)).toBeInTheDocument();
  });

  async function type(cmd: string) {
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.type(input, cmd + '{Enter}');
  }

  it('help prints the command list', async () => {
    render(<DosPrompt />);
    await type('help');
    expect(screen.getByText(/Available commands:/)).toBeInTheDocument();
    expect(screen.getByText(/about\s+- Display personal information/)).toBeInTheDocument();
  });

  it('about prints personal info', async () => {
    render(<DosPrompt />);
    await type('about');
    expect(screen.getByText(/Name:\s+Fabian Pavel Velicea/)).toBeInTheDocument();
  });

  it('ver prints the Windows 95 version string', async () => {
    render(<DosPrompt />);
    await type('ver');
    expect(screen.getByText(/Windows 95 \[Version 4.00.950\]/)).toBeInTheDocument();
  });

  it('echo echoes the argument', async () => {
    render(<DosPrompt />);
    await type('echo hello world');
    expect(screen.getByText('hello world')).toBeInTheDocument();
  });

  it('unknown command reports bad command', async () => {
    render(<DosPrompt />);
    await type('notarealcommand');
    expect(
      screen.getByText(/Bad command or file name - 'notarealcommand'/),
    ).toBeInTheDocument();
  });

  it('clear wipes the screen', async () => {
    render(<DosPrompt />);
    await type('help');
    await type('clear');
    expect(screen.queryByText(/Available commands:/)).not.toBeInTheDocument();
  });

  it('arrow-up recalls last command', async () => {
    render(<DosPrompt />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.type(input, 'ver{Enter}');
    await userEvent.type(input, '{ArrowUp}');
    expect(input.value).toBe('ver');
  });

  it('github command opens github in new tab', async () => {
    render(<DosPrompt />);
    await type('github');
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('github.com'),
      '_blank',
    );
  });
});
