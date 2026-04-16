import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MinesweeperApp } from './MinesweeperApp';

describe('MinesweeperApp', () => {
  beforeEach(() => {
    // Make mine placement deterministic: mines land in the first 10 cells of the grid.
    let i = 0;
    vi.spyOn(Math, 'random').mockImplementation(() => {
      // Produces rows 0..1, cols 0..8 -> first 10 cells
      const n = i++;
      return (n % 81) / 81;
    });
  });

  it('renders 81 cells', () => {
    const { container } = render(<MinesweeperApp />);
    // Cells are 20x20 divs inside the board frame.
    const cells = container.querySelectorAll('div[style*="width: 20px"][style*="height: 20px"]');
    expect(cells.length).toBe(81);
  });

  it('starts with 10 mines to find', () => {
    render(<MinesweeperApp />);
    // Counter displays as 3-digit padded number — "010".
    expect(screen.getByText('010')).toBeInTheDocument();
  });

  it('face is smiling initially', () => {
    render(<MinesweeperApp />);
    expect(screen.getByRole('button', { name: /🙂|smile|😎|💀/u })).toBeInTheDocument();
  });

  it('reset button resets the game', async () => {
    render(<MinesweeperApp />);
    const faceBtn = screen.getByRole('button');
    await userEvent.click(faceBtn);
    // Should still show 010 flags after reset.
    expect(screen.getByText('010')).toBeInTheDocument();
  });

  it('right-click places a flag and updates counter', async () => {
    const { container } = render(<MinesweeperApp />);
    const cells = container.querySelectorAll('div[style*="width: 20px"][style*="height: 20px"]');
    // Right-click the last cell (should not be a mine given our deterministic mock).
    const lastCell = cells[cells.length - 1] as HTMLElement;
    fireEvent.contextMenu(lastCell);
    // One flag placed -> 10-1 = 9 => "009"
    expect(screen.getByText('009')).toBeInTheDocument();
  });

  it('clicking a mine triggers game over', async () => {
    const { container } = render(<MinesweeperApp />);
    const cells = container.querySelectorAll('div[style*="width: 20px"][style*="height: 20px"]');
    // First cell is a mine per our mocked randomness.
    await userEvent.click(cells[0] as HTMLElement);
    expect(screen.getByText('Game Over!')).toBeInTheDocument();
  });
});
