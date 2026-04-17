import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Frame, Button } from '@react95/core';
import { playChord, playDing } from '../../sounds';
import tile0 from '../../assets/minesweeper/Minesweeper_0.svg';
import tile1 from '../../assets/minesweeper/Minesweeper_1.svg';
import tile2 from '../../assets/minesweeper/Minesweeper_2.svg';
import tile3 from '../../assets/minesweeper/Minesweeper_3.svg';
import tile4 from '../../assets/minesweeper/Minesweeper_4.svg';
import tile5 from '../../assets/minesweeper/Minesweeper_5.svg';
import tile6 from '../../assets/minesweeper/Minesweeper_6.svg';
import tile7 from '../../assets/minesweeper/Minesweeper_7.svg';
import tile8 from '../../assets/minesweeper/Minesweeper_8.svg';
import flagImg from '../../assets/minesweeper/MINESWEEPER_FLAG_(Windows_9x).png';
import smileyImg from '../../assets/minesweeper/MINESWEEPER_SMILEY.png';
import smileyDeathImg from '../../assets/minesweeper/MINESWEEPER_SMILEY_DEATH.png';
import smileyPressedImg from '../../assets/minesweeper/MINESWEEPER_SMILEY_PRESSED.png';
import smileySwagImg from '../../assets/minesweeper/MINESWEEPER_SMILEY_SWAG.png';
import mineImg from '../../assets/minesweeper/mine.svg';
import mineRedImg from '../../assets/minesweeper/mine_red.svg';
import mineWrongImg from '../../assets/minesweeper/mine_wrong.svg';
import d0 from '../../assets/minesweeper/d0.svg';
import d1 from '../../assets/minesweeper/d1.svg';
import d2 from '../../assets/minesweeper/d2.svg';
import d3 from '../../assets/minesweeper/d3.svg';
import d4 from '../../assets/minesweeper/d4.svg';
import d5 from '../../assets/minesweeper/d5.svg';
import d6 from '../../assets/minesweeper/d6.svg';
import d7 from '../../assets/minesweeper/d7.svg';
import d8 from '../../assets/minesweeper/d8.svg';
import d9 from '../../assets/minesweeper/d9.svg';

type CellState = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type DifficultyKey = 'beginner' | 'intermediate' | 'expert' | 'custom';

type Difficulty = {
  label: string;
  rows: number;
  cols: number;
  mines: number;
};

const PRESETS: Record<Exclude<DifficultyKey, 'custom'>, Difficulty> = {
  beginner: { label: 'Beginner', rows: 9, cols: 9, mines: 10 },
  intermediate: { label: 'Intermediate', rows: 16, cols: 16, mines: 40 },
  expert: { label: 'Expert', rows: 16, cols: 30, mines: 99 },
};

const CUSTOM_LIMITS = {
  rows: { min: 5, max: 24 },
  cols: { min: 5, max: 30 },
  minMines: 1,
};

const NUMBER_TILES = [tile0, tile1, tile2, tile3, tile4, tile5, tile6, tile7, tile8];
const DIGIT_TILES = [d0, d1, d2, d3, d4, d5, d6, d7, d8, d9];
const CELL_SIZE = 20;
const DIGIT_WIDTH = 13;
const DIGIT_HEIGHT = 23;

function clampCustom(rows: number, cols: number, mines: number) {
  const r = Math.max(CUSTOM_LIMITS.rows.min, Math.min(CUSTOM_LIMITS.rows.max, Math.floor(rows) || CUSTOM_LIMITS.rows.min));
  const c = Math.max(CUSTOM_LIMITS.cols.min, Math.min(CUSTOM_LIMITS.cols.max, Math.floor(cols) || CUSTOM_LIMITS.cols.min));
  const maxMines = (r - 1) * (c - 1);
  const m = Math.max(CUSTOM_LIMITS.minMines, Math.min(maxMines, Math.floor(mines) || CUSTOM_LIMITS.minMines));
  return { rows: r, cols: c, mines: m };
}

function DigitDisplay({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(999, value));
  const s = String(clamped).padStart(3, '0');
  return (
    <Frame boxShadow="in" aria-label={s} style={{
      backgroundColor: '#000',
      padding: '1px',
      display: 'flex',
      gap: 0,
    }}>
      {s.split('').map((ch, i) => (
        <img
          key={i}
          src={DIGIT_TILES[Number(ch)]}
          alt={ch}
          style={{ width: DIGIT_WIDTH, height: DIGIT_HEIGHT, display: 'block' }}
          draggable={false}
        />
      ))}
    </Frame>
  );
}

function CustomDialog({
  initial,
  onConfirm,
  onCancel,
}: {
  initial: Difficulty;
  onConfirm: (d: Difficulty) => void;
  onCancel: () => void;
}) {
  const [rowsStr, setRowsStr] = useState(String(initial.rows));
  const [colsStr, setColsStr] = useState(String(initial.cols));
  const [minesStr, setMinesStr] = useState(String(initial.mines));

  const rowsNum = Number(rowsStr);
  const colsNum = Number(colsStr);
  const minesNum = Number(minesStr);

  const rowsValid = Number.isFinite(rowsNum) && rowsNum >= CUSTOM_LIMITS.rows.min && rowsNum <= CUSTOM_LIMITS.rows.max;
  const colsValid = Number.isFinite(colsNum) && colsNum >= CUSTOM_LIMITS.cols.min && colsNum <= CUSTOM_LIMITS.cols.max;
  const maxMines = rowsValid && colsValid ? (Math.floor(rowsNum) - 1) * (Math.floor(colsNum) - 1) : 0;
  const minesValid = Number.isFinite(minesNum)
    && minesNum >= CUSTOM_LIMITS.minMines
    && rowsValid && colsValid
    && minesNum <= maxMines;

  const allValid = rowsValid && colsValid && minesValid;

  const handleOk = () => {
    const clamped = clampCustom(rowsNum, colsNum, minesNum);
    onConfirm({ label: 'Custom', ...clamped });
  };

  const inputStyle: React.CSSProperties = {
    width: 60,
    padding: '2px 4px',
    fontFamily: '"MS Sans Serif", Arial, sans-serif',
    fontSize: 12,
    border: '1px solid',
    borderColor: '#808080 #fff #fff #808080',
    background: '#fff',
  };

  const row = (
    label: string,
    value: string,
    setValue: (v: string) => void,
    hint: string,
    valid: boolean
  ) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <label style={{ width: 70 }}>{label}:</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={inputStyle}
      />
      <span style={{ fontSize: 11, color: valid ? '#404040' : '#b00000' }}>{hint}</span>
    </div>
  );

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9998,
      }}
      onMouseDown={onCancel}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: 300,
          background: '#c0c0c0',
          borderTop: '2px solid #fff',
          borderLeft: '2px solid #fff',
          borderRight: '2px solid #404040',
          borderBottom: '2px solid #404040',
          fontFamily: '"MS Sans Serif", Arial, sans-serif',
          fontSize: 12,
          boxShadow: '1px 1px 0 #000',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#000080',
          color: '#fff',
          padding: '2px 4px',
          fontWeight: 'bold',
        }}>
          <span>Custom Field</span>
          <button
            onClick={onCancel}
            style={{
              width: 18,
              height: 16,
              padding: 0,
              fontSize: 11,
              lineHeight: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: '1px outset #fff',
              background: '#c0c0c0',
              color: '#000',
            }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: 12 }}>
          {row('Rows', rowsStr, setRowsStr, `${CUSTOM_LIMITS.rows.min}–${CUSTOM_LIMITS.rows.max}`, rowsValid)}
          {row('Columns', colsStr, setColsStr, `${CUSTOM_LIMITS.cols.min}–${CUSTOM_LIMITS.cols.max}`, colsValid)}
          {row(
            'Mines',
            minesStr,
            setMinesStr,
            rowsValid && colsValid
              ? `${CUSTOM_LIMITS.minMines}–${maxMines}`
              : `${CUSTOM_LIMITS.minMines}+`,
            minesValid
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6, marginTop: 10 }}>
            <Button onClick={handleOk} disabled={!allValid} style={{ width: 70 }}>OK</Button>
            <Button onClick={onCancel} style={{ width: 70 }}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function createBoard(rows: number, cols: number, mines: number): CellState[][] {
  const board: CellState[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );

  let placed = 0;
  const cap = Math.min(mines, rows * cols - 1);
  while (placed < cap) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc].isMine) count++;
        }
      }
      board[r][c].adjacentMines = count;
    }
  }

  return board;
}

type MinesweeperAppProps = {
  onResize?: (size: { width: number; height: number }) => void;
};

const WINDOW_CHROME_W = 12;
const WINDOW_CHROME_H = 64;
const OUTER_PAD = 24;
const HEADER_H = 48;
const MENU_H = 24;

function windowSizeFor(d: Difficulty) {
  const innerW = d.cols * CELL_SIZE + OUTER_PAD;
  const innerH = MENU_H + HEADER_H + d.rows * CELL_SIZE + OUTER_PAD + 10;
  return {
    width: Math.max(220, innerW + WINDOW_CHROME_W),
    height: innerH + WINDOW_CHROME_H,
  };
}

export function MinesweeperApp({ onResize }: MinesweeperAppProps = {}) {
  const [difficulty, setDifficulty] = useState<DifficultyKey>('beginner');
  const [customConfig, setCustomConfig] = useState<Difficulty>({ label: 'Custom', rows: 16, cols: 16, mines: 40 });
  const [menuOpen, setMenuOpen] = useState(false);
  const [customDialogOpen, setCustomDialogOpen] = useState(false);

  const activeConfig: Difficulty = difficulty === 'custom' ? customConfig : PRESETS[difficulty];
  const { rows, cols, mines } = activeConfig;

  const [board, setBoard] = useState(() => createBoard(rows, cols, mines));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [face, setFace] = useState<'smile' | 'dead' | 'cool'>('smile');
  const [clickedMine, setClickedMine] = useState<[number, number] | null>(null);

  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [pressing, setPressing] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const up = () => setPressing(false);
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  useEffect(() => {
    onResize?.(windowSizeFor(activeConfig));
  }, [activeConfig.rows, activeConfig.cols, onResize]);

  useEffect(() => {
    if (started && !gameOver) {
      intervalRef.current = window.setInterval(() => {
        setTimer(t => Math.min(999, t + 1));
      }, 1000);
      return () => {
        if (intervalRef.current !== null) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
  }, [started, gameOver]);

  const flagCount = useMemo(
    () => board.flat().filter(c => c.isFlagged).length,
    [board]
  );

  const resetTo = useCallback((d: Difficulty) => {
    setBoard(createBoard(d.rows, d.cols, d.mines));
    setGameOver(false);
    setWon(false);
    setFace('smile');
    setClickedMine(null);
    setTimer(0);
    setStarted(false);
  }, []);

  const reset = useCallback(() => {
    resetTo(activeConfig);
  }, [resetTo, activeConfig]);

  const selectPreset = (key: Exclude<DifficultyKey, 'custom'>) => {
    setDifficulty(key);
    setMenuOpen(false);
    resetTo(PRESETS[key]);
  };

  const applyCustom = (d: Difficulty) => {
    setCustomConfig(d);
    setDifficulty('custom');
    setCustomDialogOpen(false);
    setMenuOpen(false);
    resetTo(d);
  };

  const reveal = useCallback((r: number, c: number) => {
    if (gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

    if (!started) setStarted(true);

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[r][c].isMine) {
      newBoard.forEach(row => row.forEach(cell => {
        if (cell.isMine) cell.isRevealed = true;
      }));
      setBoard(newBoard);
      setClickedMine([r, c]);
      setGameOver(true);
      setFace('dead');
      playChord();
      return;
    }

    const queue: [number, number][] = [[r, c]];
    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!;
      if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
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

    const unrevealed = newBoard.flat().filter(cell => !cell.isRevealed && !cell.isMine).length;
    if (unrevealed === 0) {
      setWon(true);
      setGameOver(true);
      setFace('cool');
      playDing();
    }

    setBoard(newBoard);
  }, [board, gameOver, rows, cols, started]);

  const toggleFlag = useCallback((e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || board[r][c].isRevealed) return;
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
    setBoard(newBoard);
  }, [board, gameOver]);

  const faceSrc =
    face === 'dead' ? smileyDeathImg
    : face === 'cool' ? smileySwagImg
    : pressing && !gameOver ? smileyPressedImg
    : smileyImg;
  const headerWidth = cols * CELL_SIZE + 8;

  const renderCellContent = (cell: CellState, r: number, c: number) => {
    if (gameOver && !won && cell.isFlagged && !cell.isMine) {
      return (
        <img
          src={mineWrongImg}
          alt="wrong"
          style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
          draggable={false}
        />
      );
    }
    if (cell.isFlagged) {
      return (
        <img
          src={flagImg}
          alt="flag"
          style={{ width: '70%', height: '70%', imageRendering: 'pixelated' }}
          draggable={false}
        />
      );
    }
    if (cell.isRevealed) {
      if (cell.isMine) {
        const isClicked = clickedMine && clickedMine[0] === r && clickedMine[1] === c;
        return (
          <img
            src={isClicked ? mineRedImg : mineImg}
            alt="mine"
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            draggable={false}
          />
        );
      }
      if (cell.adjacentMines > 0) {
        return (
          <img
            src={NUMBER_TILES[cell.adjacentMines]}
            alt={String(cell.adjacentMines)}
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
            draggable={false}
          />
        );
      }
    }
    return null;
  };

  const menuRowStyle = (selected: boolean): React.CSSProperties => ({
    padding: '3px 16px 3px 20px',
    cursor: 'pointer',
    backgroundColor: selected ? '#000080' : 'transparent',
    color: selected ? '#fff' : '#000',
    userSelect: 'none',
  });

  return (
    <div style={{
      fontFamily: '"MS Sans Serif", Arial, sans-serif',
      fontSize: '12px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      padding: '4px',
      backgroundColor: '#c0c0c0',
      position: 'relative',
      minHeight: '100%',
    }}>
      {/* Menu bar */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '2px 6px',
        borderBottom: '1px solid #808080',
        marginBottom: 4,
        position: 'relative',
      }}>
        <span
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={() => setMenuOpen(o => !o)}
        >
          <u>G</u>ame
        </span>
        {menuOpen && (
          <Frame
            boxShadow="out"
            style={{
              position: 'absolute',
              top: '100%',
              left: 4,
              zIndex: 10,
              backgroundColor: '#c0c0c0',
              padding: '2px',
              minWidth: 180,
            }}
          >
            {(Object.keys(PRESETS) as Array<Exclude<DifficultyKey, 'custom'>>).map(key => (
              <div
                key={key}
                onClick={() => selectPreset(key)}
                style={menuRowStyle(difficulty === key)}
              >
                {PRESETS[key].label} ({PRESETS[key].rows}×{PRESETS[key].cols}, {PRESETS[key].mines})
              </div>
            ))}
            <div
              onClick={() => { setCustomDialogOpen(true); setMenuOpen(false); }}
              style={menuRowStyle(difficulty === 'custom')}
            >
              Custom... {difficulty === 'custom' && `(${customConfig.rows}×${customConfig.cols}, ${customConfig.mines})`}
            </div>
            <div style={{ borderTop: '1px solid #808080', margin: '2px 0' }} />
            <div
              onClick={() => { reset(); setMenuOpen(false); }}
              style={menuRowStyle(false)}
            >
              New Game
            </div>
          </Frame>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Thick outer beveled frame, like original Win95 Minesweeper */}
        <div style={{
          padding: 6,
          background: '#c0c0c0',
          borderTop: '3px solid #fff',
          borderLeft: '3px solid #fff',
          borderRight: '3px solid #808080',
          borderBottom: '3px solid #808080',
          display: 'inline-block',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '4px 6px',
            marginBottom: '6px',
            width: `${headerWidth}px`,
            boxSizing: 'border-box',
            borderTop: '2px solid #808080',
            borderLeft: '2px solid #808080',
            borderRight: '2px solid #fff',
            borderBottom: '2px solid #fff',
          }}>
            <DigitDisplay value={Math.max(0, mines - flagCount)} />

            <button
              onClick={() => reset()}
              style={{
                width: '28px',
                height: '28px',
                cursor: 'pointer',
                border: '2px outset #fff',
                backgroundColor: '#c0c0c0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <img
                src={faceSrc}
                alt={face}
                style={{ width: 20, height: 20, imageRendering: 'pixelated' }}
                draggable={false}
              />
            </button>

            <DigitDisplay value={timer} />
          </div>

          {/* Board */}
          <div style={{
            padding: 0,
            borderTop: '3px solid #808080',
            borderLeft: '3px solid #808080',
            borderRight: '3px solid #fff',
            borderBottom: '3px solid #fff',
            display: 'inline-block',
          }}>
            {board.map((row, r) => (
              <div key={r} style={{ display: 'flex' }}>
                {row.map((cell, c) => (
                  <div
                    key={c}
                    onMouseDown={(e) => { if (e.button === 0 && !gameOver) setPressing(true); }}
                    onClick={() => reveal(r, c)}
                    onContextMenu={(e) => toggleFlag(e, r, c)}
                    style={{
                      width: `${CELL_SIZE}px`,
                      height: `${CELL_SIZE}px`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: gameOver ? 'default' : 'pointer',
                      border: cell.isRevealed && !cell.isFlagged ? '1px solid #808080' : '2px outset #fff',
                      backgroundColor: '#c0c0c0',
                      userSelect: 'none',
                      boxSizing: 'border-box',
                      padding: 0,
                    }}
                  >
                    {renderCellContent(cell, r, c)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {gameOver && (
          <div style={{ marginTop: '8px', fontWeight: 'bold', color: won ? '#008000' : '#ff0000' }}>
            {won ? 'You Win!' : 'Game Over!'}
          </div>
        )}
      </div>

      {customDialogOpen && (
        <CustomDialog
          initial={customConfig}
          onConfirm={applyCustom}
          onCancel={() => setCustomDialogOpen(false)}
        />
      )}
    </div>
  );
}
