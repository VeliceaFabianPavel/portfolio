import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelpApp } from './HelpApp';

describe('HelpApp', () => {
  it('renders with three tabs', () => {
    render(<HelpApp />);
    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.getByText('Index')).toBeInTheDocument();
    expect(screen.getByText('Find')).toBeInTheDocument();
  });

  it('shows a list of help topics', () => {
    render(<HelpApp />);
    expect(screen.getByText(/Welcome to Fabian's Portfolio/)).toBeInTheDocument();
    expect(screen.getByText(/Technical Skills/)).toBeInTheDocument();
  });

  it('Display button is disabled until a topic is selected', () => {
    render(<HelpApp />);
    expect(screen.getByRole('button', { name: 'Display' })).toBeDisabled();
  });

  it('selecting a topic enables Display', async () => {
    render(<HelpApp />);
    await userEvent.click(screen.getByText(/Welcome to Fabian's Portfolio/));
    expect(screen.getByRole('button', { name: 'Display' })).toBeEnabled();
  });

  it('Display shows the topic content', async () => {
    render(<HelpApp />);
    await userEvent.click(screen.getByText(/Welcome to Fabian's Portfolio/));
    await userEvent.click(screen.getByRole('button', { name: 'Display' }));
    expect(
      screen.getByText(/Welcome to this Windows 95 themed portfolio!/),
    ).toBeInTheDocument();
  });

  it('Index tab has a search filter', async () => {
    render(<HelpApp />);
    await userEvent.click(screen.getByText('Index'));
    const searchInput = document.querySelector(
      'input[style*="margin-bottom: 8px"]',
    ) as HTMLInputElement;
    expect(searchInput).toBeInTheDocument();

    await userEvent.type(searchInput, 'Minesweeper');
    expect(screen.getByText('Minesweeper')).toBeInTheDocument();
    expect(screen.queryByText('Docker')).not.toBeInTheDocument();
  });

  it('Find tab placeholder when no topic selected', async () => {
    render(<HelpApp />);
    await userEvent.click(screen.getByText('Find'));
    expect(
      screen.getByText(/Select a topic from Contents or Index/),
    ).toBeInTheDocument();
  });
});
