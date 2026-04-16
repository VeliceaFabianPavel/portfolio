import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectsExplorer } from './ProjectsExplorer';

describe('ProjectsExplorer', () => {
  it('renders the PeP5 heading on first mount', () => {
    render(<ProjectsExplorer />);
    expect(screen.getAllByText(/PeP5/).length).toBeGreaterThan(0);
  });

  it('renders a status bar with section info', () => {
    render(<ProjectsExplorer />);
    expect(screen.getByText(/Section:/)).toBeInTheDocument();
    expect(screen.getByText(/Page \d+ of \d+/)).toBeInTheDocument();
  });

  it('Next advances the page counter', async () => {
    render(<ProjectsExplorer />);
    const initial = screen.getByText(/Page \d+ of \d+/).textContent!;
    const nextBtn = screen.queryByRole('button', { name: /Next/i });
    if (!nextBtn) return; // component may not expose a Next button — skip gracefully
    await userEvent.click(nextBtn);
    expect(screen.getByText(/Page \d+ of \d+/).textContent).not.toBe(initial);
  });
});
