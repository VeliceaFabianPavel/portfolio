import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkillsApp } from './SkillsApp';
import { skills } from '../../data/portfolio';

describe('SkillsApp', () => {
  it('renders the first category by default', () => {
    render(<SkillsApp />);
    const first = skills[0];
    expect(screen.getByText(`${first.category} Skills`)).toBeInTheDocument();
    expect(screen.getByText(first.items[0].name)).toBeInTheDocument();
  });

  it('renders a tab for every skill category', () => {
    render(<SkillsApp />);
    for (const cat of skills) {
      expect(screen.getByText(cat.category)).toBeInTheDocument();
    }
  });

  it('clicking a tab switches to that category', async () => {
    render(<SkillsApp />);
    const target = skills[skills.length - 1];
    await userEvent.click(screen.getByText(target.category));
    expect(screen.getByText(`${target.category} Skills`)).toBeInTheDocument();
    expect(screen.getByText(target.items[0].name)).toBeInTheDocument();
  });

  it('shows skill percentages', () => {
    render(<SkillsApp />);
    const first = skills[0];
    for (const s of first.items) {
      // ProgressBar renders the same value in multiple internal layers — getAllByText is safe.
      expect(screen.getAllByText(`${s.level}%`).length).toBeGreaterThan(0);
    }
  });
});
