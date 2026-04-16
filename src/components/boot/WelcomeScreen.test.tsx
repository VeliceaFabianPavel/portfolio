import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WelcomeScreen } from './WelcomeScreen';

describe('WelcomeScreen', () => {
  it('renders the modal with the password hint', () => {
    render(<WelcomeScreen onComplete={() => {}} />);
    expect(screen.getByText(/Welcome to Windows/i)).toBeInTheDocument();
    expect(screen.getByText(/The password is/)).toBeInTheDocument();
  });

  it('wrong password shows error dialog', async () => {
    const onComplete = vi.fn();
    render(<WelcomeScreen onComplete={onComplete} />);
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;
    await userEvent.type(passwordInput, 'wrong');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByText('Incorrect password.')).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('correct password calls onComplete', async () => {
    const onComplete = vi.fn();
    render(<WelcomeScreen onComplete={onComplete} />);
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;
    await userEvent.type(passwordInput, 'portfolio');
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('Enter key submits the form', async () => {
    const onComplete = vi.fn();
    render(<WelcomeScreen onComplete={onComplete} />);
    const passwordInput = document.querySelector(
      'input[type="password"]',
    ) as HTMLInputElement;
    await userEvent.type(passwordInput, 'portfolio{Enter}');
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
