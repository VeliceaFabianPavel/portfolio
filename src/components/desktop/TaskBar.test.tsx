import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TaskBar } from './TaskBar';

async function openStartMenu() {
  const startBtn = screen.getByRole('button', { name: /Start/i });
  await userEvent.click(startBtn);
}

describe('TaskBar', () => {
  it('renders the Start button', () => {
    render(<TaskBar onOpenApp={() => {}} onShutDown={() => {}} />);
    expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
  });

  it('exposes all the start menu entries once opened', async () => {
    render(<TaskBar onOpenApp={() => {}} onShutDown={() => {}} />);
    await openStartMenu();
    for (const label of [
      'About Me',
      'My Projects',
      'Skills.exe',
      'Contact Me',
      'Resume.txt',
      'Internet Explorer',
      'Minesweeper',
      'Calculator',
      'Help',
      'Shut Down...',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('onOpenApp fires with correct id when a menu item is clicked', async () => {
    const onOpenApp = vi.fn();
    render(<TaskBar onOpenApp={onOpenApp} onShutDown={() => {}} />);
    await openStartMenu();
    await userEvent.click(screen.getByText('Calculator'));
    expect(onOpenApp).toHaveBeenCalledWith('calculator');
  });

  it('onShutDown fires when Shut Down is clicked', async () => {
    const onShutDown = vi.fn();
    render(<TaskBar onOpenApp={() => {}} onShutDown={onShutDown} />);
    await openStartMenu();
    await userEvent.click(screen.getByText('Shut Down...'));
    expect(onShutDown).toHaveBeenCalledTimes(1);
  });
});
