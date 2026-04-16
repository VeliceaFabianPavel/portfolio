import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactApp } from './ContactApp';
import { personalInfo } from '../../data/portfolio';

describe('ContactApp', () => {
  beforeEach(() => {
    vi.stubGlobal('open', vi.fn());
  });

  it('renders the recipient email in the header', () => {
    render(<ContactApp />);
    expect(screen.getByText(new RegExp(personalInfo.email))).toBeInTheDocument();
  });

  it('Send button is disabled until required fields are filled', () => {
    render(<ContactApp />);
    const sendBtn = screen.getByRole('button', { name: 'Send' });
    expect(sendBtn).toBeDisabled();
  });

  it('Send button enables once name, email and message are provided', async () => {
    render(<ContactApp />);
    const inputs = screen.getAllByRole('textbox');
    // inputs: From, Email, Subject, Body
    await userEvent.type(inputs[0], 'Jane');
    await userEvent.type(inputs[1], 'jane@example.com');
    await userEvent.type(inputs[3], 'hi!');
    expect(screen.getByRole('button', { name: 'Send' })).toBeEnabled();
  });

  it('clicking Send opens a mailto URL with the recipient', async () => {
    render(<ContactApp />);
    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], 'Jane');
    await userEvent.type(inputs[1], 'jane@example.com');
    await userEvent.type(inputs[3], 'hello there');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));

    expect(window.open).toHaveBeenCalledTimes(1);
    const url = (window.open as any).mock.calls[0][0] as string;
    expect(url).toContain(`mailto:${personalInfo.email}`);
    expect(url).toContain('hello%20there');
  });

  it('shows confirmation message after sending', async () => {
    render(<ContactApp />);
    const inputs = screen.getAllByRole('textbox');
    await userEvent.type(inputs[0], 'Jane');
    await userEvent.type(inputs[1], 'jane@example.com');
    await userEvent.type(inputs[3], 'msg');
    await userEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText(/Mail client opened!/)).toBeInTheDocument();
  });
});
