import { useState } from 'react';
import { Button, Frame } from '@react95/core';

export function CalculatorApp() {
  const [display, setDisplay] = useState('0');
  const [hasDecimal, setHasDecimal] = useState(false);
  const [memory, setMemory] = useState(0);
  const [accumulator, setAccumulator] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(true);

  const formatDisplay = (n: number) => String(n);
  const displayText = display.includes('.') ? display : display + '.';

  const currentValue = () => parseFloat(display);

  const handleDigit = (d: string) => {
    if (d === '.') {
      if (resetNext) {
        setDisplay('0.');
        setHasDecimal(true);
        setResetNext(false);
      } else if (!hasDecimal) {
        setDisplay(display + '.');
        setHasDecimal(true);
      }
    } else {
      if (resetNext) {
        setDisplay(d);
        setHasDecimal(false);
        setResetNext(false);
      } else {
        setDisplay(display === '0' ? d : display + d);
      }
    }
  };

  const calculate = (a: number, op: string, b: number): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleOperator = (op: string) => {
    const val = currentValue();
    if (accumulator !== null && operator && !resetNext) {
      const result = calculate(accumulator, operator, val);
      setAccumulator(result);
      setDisplay(formatDisplay(result));
    } else {
      setAccumulator(val);
    }
    setOperator(op);
    setResetNext(true);
  };

  const handleEquals = () => {
    if (accumulator !== null && operator) {
      const result = calculate(accumulator, operator, currentValue());
      setDisplay(formatDisplay(result));
      setAccumulator(null);
      setOperator(null);
      setResetNext(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setHasDecimal(false);
    setAccumulator(null);
    setOperator(null);
    setResetNext(true);
  };

  const handleCE = () => {
    setDisplay('0');
    setHasDecimal(false);
    setResetNext(true);
  };

  const handleBack = () => {
    const raw = display.endsWith('.') ? display.slice(0, -1) : display;
    if (raw.length <= 1 || (raw.length === 2 && raw.startsWith('-'))) {
      setDisplay('0.');
    } else {
      const newRaw = raw.slice(0, -1);
      setDisplay(newRaw.includes('.') ? newRaw : newRaw + '.');
    }
  };

  const handlePlusMinus = () => {
    const val = currentValue();
    setDisplay(formatDisplay(-val));
  };

  const handleSqrt = () => {
    const val = currentValue();
    if (val >= 0) setDisplay(formatDisplay(Math.sqrt(val)));
    setResetNext(true);
  };

  const handlePercent = () => {
    if (accumulator !== null) {
      const result = accumulator * (currentValue() / 100);
      setDisplay(formatDisplay(result));
      setResetNext(true);
    }
  };

  const handleInverse = () => {
    const val = currentValue();
    if (val !== 0) setDisplay(formatDisplay(1 / val));
    setResetNext(true);
  };

  const handleMemory = (action: string) => {
    switch (action) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(formatDisplay(memory)); setResetNext(true); break;
      case 'MS': setMemory(currentValue()); break;
      case 'M+': setMemory(memory + currentValue()); break;
    }
  };

  const btnBase: React.CSSProperties = {
    width: 36, height: 25, fontSize: 12, fontWeight: 'bold',
    fontFamily: '"MS Sans Serif", Arial, sans-serif', padding: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };

  const memBtn: React.CSSProperties = { ...btnBase, color: '#800000', width: 36 };
  const numBtn: React.CSSProperties = { ...btnBase, color: '#0000aa' };
  const opBtn: React.CSSProperties = { ...btnBase, color: '#800000' };
  const topBtn: React.CSSProperties = { ...btnBase, width: 50, color: '#800000' };

  return (
    <div style={{
      width: '100%', height: '100%', backgroundColor: '#c0c0c0',
      fontFamily: '"MS Sans Serif", Arial, sans-serif', fontSize: 12,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Menu bar */}
      <div style={{ display: 'flex', gap: 12, padding: '2px 6px', borderBottom: '1px solid #808080' }}>
        <span style={{ textDecoration: 'underline', textDecorationColor: '#000', textUnderlineOffset: 1 }}>
          <u>E</u>dit
        </span>
        <span><u>V</u>iew</span>
        <span><u>H</u>elp</span>
      </div>

      <div style={{ padding: '6px 8px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {/* Display */}
        <Frame
          boxShadow="in"
          style={{
            backgroundColor: '#fff', padding: '2px 4px',
            textAlign: 'right', fontSize: 16,
            fontFamily: '"Courier New", monospace',
            height: 22, display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          }}
        >
          {displayText}
        </Frame>

        {/* Top row: Back, CE, C */}
        <div style={{ display: 'flex', gap: 3, justifyContent: 'flex-end' }}>
          <div style={{ flex: 1 }} />
          <Button onClick={handleBack} style={topBtn}>Back</Button>
          <Button onClick={handleCE} style={topBtn}>CE</Button>
          <Button onClick={handleClear} style={topBtn}>C</Button>
        </div>

        {/* Button grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 3 }}>
          {/* Row 1 */}
          <Button onClick={() => handleMemory('MC')} style={memBtn}>MC</Button>
          <Button onClick={() => handleDigit('7')} style={numBtn}>7</Button>
          <Button onClick={() => handleDigit('8')} style={numBtn}>8</Button>
          <Button onClick={() => handleDigit('9')} style={numBtn}>9</Button>
          <Button onClick={() => handleOperator('/')} style={opBtn}>/</Button>
          <Button onClick={handleSqrt} style={opBtn}>sqrt</Button>

          {/* Row 2 */}
          <Button onClick={() => handleMemory('MR')} style={memBtn}>MR</Button>
          <Button onClick={() => handleDigit('4')} style={numBtn}>4</Button>
          <Button onClick={() => handleDigit('5')} style={numBtn}>5</Button>
          <Button onClick={() => handleDigit('6')} style={numBtn}>6</Button>
          <Button onClick={() => handleOperator('*')} style={opBtn}>*</Button>
          <Button onClick={handlePercent} style={opBtn}>%</Button>

          {/* Row 3 */}
          <Button onClick={() => handleMemory('MS')} style={memBtn}>MS</Button>
          <Button onClick={() => handleDigit('1')} style={numBtn}>1</Button>
          <Button onClick={() => handleDigit('2')} style={numBtn}>2</Button>
          <Button onClick={() => handleDigit('3')} style={numBtn}>3</Button>
          <Button onClick={() => handleOperator('-')} style={opBtn}>-</Button>
          <Button onClick={handleInverse} style={opBtn}>1/x</Button>

          {/* Row 4 */}
          <Button onClick={() => handleMemory('M+')} style={memBtn}>M+</Button>
          <Button onClick={() => handleDigit('0')} style={numBtn}>0</Button>
          <Button onClick={handlePlusMinus} style={numBtn}>+/-</Button>
          <Button onClick={() => handleDigit('.')} style={numBtn}>.</Button>
          <Button onClick={() => handleOperator('+')} style={opBtn}>+</Button>
          <Button onClick={handleEquals} style={opBtn}>=</Button>
        </div>
      </div>
    </div>
  );
}
