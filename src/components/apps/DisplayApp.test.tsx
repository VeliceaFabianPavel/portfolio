import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DisplayApp } from './DisplayApp';

describe('DisplayApp', () => {
  it('renders None and every wallpaper and color option', () => {
    render(<DisplayApp current={{ type: 'color', value: '#008080' }} onApply={() => {}} />);
    expect(screen.getByText('(None)')).toBeInTheDocument();
    expect(screen.getByText('Clouds')).toBeInTheDocument();
    expect(screen.getByText('Teal (Default)')).toBeInTheDocument();
  });

  it('OK calls onApply with the currently selected background', async () => {
    const onApply = vi.fn();
    render(<DisplayApp current={{ type: 'color', value: '#008080' }} onApply={onApply} />);
    await userEvent.click(screen.getByText('Clouds'));
    await userEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onApply).toHaveBeenCalledWith({ type: 'wallpaper', value: 'Clouds' });
  });

  it('selecting a color updates the pending background', async () => {
    const onApply = vi.fn();
    render(<DisplayApp current={{ type: 'color', value: '#008080' }} onApply={onApply} />);
    await userEvent.click(screen.getByText('Red'));
    await userEvent.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onApply).toHaveBeenCalledWith({ type: 'color', value: '#FF0000' });
  });
});
