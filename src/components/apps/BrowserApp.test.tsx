import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserApp } from './BrowserApp';
import { personalInfo } from '../../data/portfolio';

describe('BrowserApp', () => {
  it('opens on the Home page', () => {
    render(<BrowserApp />);
    expect(screen.getByText(personalInfo.name)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to my corner of the World Wide Web!/)).toBeInTheDocument();
  });

  it('Back is disabled on the initial page', () => {
    render(<BrowserApp />);
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
  });

  it('clicking the GitHub link navigates to the github page', async () => {
    render(<BrowserApp />);
    await userEvent.click(screen.getByText(/GitHub Profile/));
    expect(
      screen.getByText(/This link points to an external website/),
    ).toBeInTheDocument();
  });

  it('Back returns to the previous page after navigating', async () => {
    render(<BrowserApp />);
    await userEvent.click(screen.getByText(/GitHub Profile/));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(screen.getByText(/Welcome to my corner of the World Wide Web!/)).toBeInTheDocument();
  });

  it('Forward re-navigates after going back', async () => {
    render(<BrowserApp />);
    await userEvent.click(screen.getByText(/GitHub Profile/));
    await userEvent.click(screen.getByRole('button', { name: 'Back' }));
    await userEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(
      screen.getByText(/This link points to an external website/),
    ).toBeInTheDocument();
  });
});
