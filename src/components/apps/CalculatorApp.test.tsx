import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalculatorApp } from './CalculatorApp';

function display() {
  // The display is the first element inside the calculator that shows the current value.
  // We locate it by finding the text that ends with "." (Win95 calculator always shows a decimal).
  const el = document.querySelector('div[style*="Courier New"]');
  return el?.textContent ?? '';
}

function click(label: string) {
  return userEvent.click(screen.getByRole('button', { name: label }));
}

describe('CalculatorApp', () => {
  it('shows 0. on first render', () => {
    render(<CalculatorApp />);
    expect(display()).toBe('0.');
  });

  it('adds two numbers', async () => {
    render(<CalculatorApp />);
    await click('2');
    await click('+');
    await click('3');
    await click('=');
    expect(display()).toBe('5.');
  });

  it('subtracts two numbers', async () => {
    render(<CalculatorApp />);
    await click('9');
    await click('-');
    await click('4');
    await click('=');
    expect(display()).toBe('5.');
  });

  it('multiplies two numbers', async () => {
    render(<CalculatorApp />);
    await click('6');
    await click('*');
    await click('7');
    await click('=');
    expect(display()).toBe('42.');
  });

  it('divides two numbers', async () => {
    render(<CalculatorApp />);
    await click('8');
    await click('/');
    await click('2');
    await click('=');
    expect(display()).toBe('4.');
  });

  it('divides by zero safely (returns 0)', async () => {
    render(<CalculatorApp />);
    await click('5');
    await click('/');
    await click('0');
    await click('=');
    expect(display()).toBe('0.');
  });

  it('chains operations (2 + 3 * 4 = 20 left-to-right)', async () => {
    render(<CalculatorApp />);
    await click('2');
    await click('+');
    await click('3');
    await click('*');
    await click('4');
    await click('=');
    // Left-to-right evaluation: (2+3)*4 = 20
    expect(display()).toBe('20.');
  });

  it('supports decimals', async () => {
    render(<CalculatorApp />);
    await click('.');
    await click('5');
    await click('+');
    await click('.');
    await click('5');
    await click('=');
    expect(display()).toBe('1.');
  });

  it('does not allow two decimals in a single number', async () => {
    render(<CalculatorApp />);
    await click('1');
    await click('.');
    await click('.');
    await click('5');
    // Should be 1.5, not 1..5
    expect(display()).toBe('1.5');
  });

  it('C clears everything', async () => {
    render(<CalculatorApp />);
    await click('7');
    await click('+');
    await click('3');
    await click('C');
    expect(display()).toBe('0.');
  });

  it('CE clears the current entry only', async () => {
    render(<CalculatorApp />);
    await click('5');
    await click('+');
    await click('7');
    await click('CE');
    await click('3');
    await click('=');
    expect(display()).toBe('8.');
  });

  it('Back deletes the last digit', async () => {
    render(<CalculatorApp />);
    await click('1');
    await click('2');
    await click('3');
    await click('Back');
    expect(display()).toBe('12.');
  });

  it('+/- flips sign', async () => {
    render(<CalculatorApp />);
    await click('5');
    await click('+/-');
    expect(display()).toBe('-5.');
  });

  it('sqrt of 9 is 3', async () => {
    render(<CalculatorApp />);
    await click('9');
    await click('sqrt');
    expect(display()).toBe('3.');
  });

  it('1/x takes reciprocal', async () => {
    render(<CalculatorApp />);
    await click('4');
    await click('1/x');
    expect(display()).toBe('0.25');
  });

  it('1/x on zero leaves display at 0', async () => {
    render(<CalculatorApp />);
    await click('1/x');
    expect(display()).toBe('0.');
  });

  it('memory MS / MR round-trips a value', async () => {
    render(<CalculatorApp />);
    await click('4');
    await click('2');
    await click('MS');
    await click('C');
    await click('MR');
    expect(display()).toBe('42.');
  });

  it('memory M+ accumulates then MR retrieves total', async () => {
    render(<CalculatorApp />);
    await click('1');
    await click('0');
    await click('MS');
    await click('C');
    await click('5');
    await click('M+');
    await click('C');
    await click('MR');
    expect(display()).toBe('15.');
  });

  it('MC clears memory to 0', async () => {
    render(<CalculatorApp />);
    await click('7');
    await click('MS');
    await click('MC');
    await click('C');
    await click('MR');
    expect(display()).toBe('0.');
  });
});
