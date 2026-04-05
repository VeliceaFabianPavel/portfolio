import { useState, useCallback } from 'react';
import { Frame } from '@react95/core';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

const ROWS = 9;
const COLS = 9;
const MINES = 10;

function createBoard(): CellState[][] {
  const board: CellState[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  // Place mines
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS);
    const c = Math.floor(Math.random() * COLS);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  // Calculate adjacent
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export function MinesweeperApp() {
  const [board, setBoard] = useState(createBoard);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [face, setFace] = useState<'smile' | 'dead' | 'cool'>('smile');

  const flagCount = board.flat().filter(c => c.isFlagged).length;

  const reveal = useCallback((r: number, c: number) => {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[r][c].isMine) {
      // Game over - reveal all mines
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setGameOver(true);
      setFace('dead');
      return;
    }

    // Flood fill
    const queue: [number, number][] = [[r, c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      if (cr < 0 || cr >= ROWS || cc < 0 || cc >= COLS) continue;
      if (newBoard[cr][cc].isRevealed || newBoard[cr][cc].isFlagged) continue;
      newBoard[cr][cc].isRevealed = true;
      if (newBoard[cr][cc].adjacentMines === 0 && !newBoard[cr][cc].isMine) {
        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            queue.push([cr + dr, cc + dc]);
          }
        }
      }
    }

    // Check win
    const unrevealed = newBoard.flat().filter(c => !c.isRevealed && !c.isMine).length;
    if (unrevealed === 0) {
      setWon(true);
      setGameOver(true);
      setFace('cool');
    }

    setBoard(newBoard);
  }, [board, gameOver]);

  const toggleFlag = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || board[r][c].isRevealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  }, [board, gameOver]);

  const reset = () => {
    setBoard(createBoard());
    setGameOver(false);
    setWon(false);
    setFace('smile');
  };

  return (
    <div style={{
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '4px',
      backgroundColor: '#c0c0c0',
    }}>
      {/* Header */}
      <Frame boxShadow="in" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '4px 6px',
        marginBottom: '4px',
        width: `${COLS * 20 + 8}px`,
        boxSizing: 'border-box',
      }}>
        {/* Mine counter */}
        <Frame boxShadow="in" style={{
          backgroundColor: '#000',
          color: '#f00',
          fontFamily: '"Courier New", monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '2px 6px',
          minWidth: '40px',
          textAlign: 'center',
        }}>
          {String(MINES - flagCount).padStart(3, '0')}
        </Frame>

        {/* Face button */}
        <button
          onClick={reset}
          style={{
            width: '28px',
            height: '28px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '2px outset #fff',
            backgroundColor: '#c0c0c0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {face === 'smile' ? '🙂' : face === 'dead' ? '💀' : '😎'}
        </button>

        {/* Timer placeholder */}
        <Frame boxShadow="in" style={{
          backgroundColor: '#000',
          color: '#f00',
          fontFamily: '"Courier New", monospace',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '2px 6px',
          minWidth: '40px',
          textAlign: 'center',
        }}>
          000
        </Frame>
      </Frame>

      {/* Board */}
      <Frame boxShadow="in" style={{ padding: '2px' }}>
        {board.map((row, r) => (
          <div key={r} style={{ display: 'flex' }}>
            {row.map((cell, c) => (
              <div
                key={c}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => toggleFlag(e, r, c)}
                style={{
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: gameOver ? 'default' : 'pointer',
                  border: cell.isRevealed ? '1px solid #808080' : '2px outset #fff',
                  backgroundColor: cell.isRevealed ? '#c0c0c0' : '#c0c0c0',
                  color: NUMBER_COLORS[cell.adjacentMines] || '#000',
                  userSelect: 'none',
                  boxSizing: 'border-box',
                }}
              >
                {cell.isRevealed
                  ? cell.isMine
                    ? '💣'
                    : cell.adjacentMines > 0
                      ? cell.adjacentMines
                      : ''
                  : cell.isFlagged
                    ? '🚩'
                    : ''}
              </div>
            ))}
          </div>
        ))}
      </Frame>

      {gameOver && (
        <div style={{ marginTop: '8px', fontWeight: 'bold', color: won ? '#008000' : '#ff0000' }}>
          {won ? 'You Win!' : 'Game Over!'}
        </div>
      )}
    </div>
  );
}
