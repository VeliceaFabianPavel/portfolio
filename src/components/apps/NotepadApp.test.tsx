import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotepadApp } from './NotepadApp';
import { resumeText } from '../../data/portfolio';

describe('NotepadApp', () => {
  it('renders with the resume as default content', () => {
    render(<NotepadApp />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toBe(resumeText);
  });

  it('renders menu bar items', () => {
    render(<NotepadApp />);
    expect(screen.getByText('File')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('status bar shows correct line count', () => {
    render(<NotepadApp />);
    const expectedLines = resumeText.split('\n').length;
    expect(screen.getByText(new RegExp(`${expectedLines} lines`))).toBeInTheDocument();
  });

  it('updates line count when user types new lines', async () => {
    render(<NotepadApp />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'a{Enter}b{Enter}c');
    expect(screen.getByText(/3 lines/)).toBeInTheDocument();
  });

  it('text is editable', async () => {
    render(<NotepadApp />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    await userEvent.clear(textarea);
    await userEvent.type(textarea, 'hello');
    expect(textarea.value).toBe('hello');
  });
});
