import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AboutMe } from './AboutMe';
import { personalInfo, workExperience, education, publications } from '../../data/portfolio';

describe('AboutMe', () => {
  it('renders the General tab with personal info by default', () => {
    render(<AboutMe />);
    expect(screen.getAllByText(personalInfo.name)[0]).toBeInTheDocument();
    expect(screen.getByText(personalInfo.email)).toBeInTheDocument();
    expect(screen.getByText(personalInfo.phone)).toBeInTheDocument();
  });

  it('shows all five tabs', () => {
    render(<AboutMe />);
    for (const tab of ['General', 'Experience', 'Education', 'Publications', 'Links']) {
      expect(screen.getByText(tab)).toBeInTheDocument();
    }
  });

  it('switching to Experience shows jobs', async () => {
    render(<AboutMe />);
    await userEvent.click(screen.getByText('Experience'));
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    for (const job of workExperience) {
      expect(screen.getByText(job.title)).toBeInTheDocument();
    }
  });

  it('switching to Education shows degrees', async () => {
    render(<AboutMe />);
    await userEvent.click(screen.getByText('Education'));
    expect(screen.getByText('Education & Training')).toBeInTheDocument();
    for (const edu of education) {
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
    }
  });

  it('switching to Publications shows titles', async () => {
    render(<AboutMe />);
    await userEvent.click(screen.getByText('Publications'));
    for (const pub of publications) {
      expect(screen.getByText(pub.title)).toBeInTheDocument();
    }
  });

  it('switching to Links shows external links', async () => {
    render(<AboutMe />);
    await userEvent.click(screen.getByText('Links'));
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThanOrEqual(3);
  });
});
