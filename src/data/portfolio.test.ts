import { describe, it, expect } from 'vitest';
import {
  personalInfo,
  projects,
  workExperience,
  education,
  publications,
  skills,
  resumeText,
} from './portfolio';

describe('portfolio data', () => {
  describe('personalInfo', () => {
    it('has required contact fields', () => {
      expect(personalInfo.name).toBeTruthy();
      expect(personalInfo.email).toMatch(/@/);
      expect(personalInfo.github).toMatch(/^https?:\/\//);
      expect(personalInfo.location).toBeTruthy();
    });
  });

  describe('projects', () => {
    it('has at least one project', () => {
      expect(projects.length).toBeGreaterThan(0);
    });

    it('every project has unique id', () => {
      const ids = projects.map(p => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('every project has required fields', () => {
      for (const p of projects) {
        expect(p.id).toBeTruthy();
        expect(p.name).toBeTruthy();
        expect(p.description).toBeTruthy();
        expect(Array.isArray(p.tech)).toBe(true);
        expect(['Completed', 'In Progress', 'Archived']).toContain(p.status);
        expect(p.year).toMatch(/^\d{4}$/);
      }
    });

    it('valid optional github URLs', () => {
      for (const p of projects) {
        if (p.github) expect(p.github).toMatch(/^https?:\/\//);
      }
    });
  });

  describe('workExperience', () => {
    it('has entries with required fields', () => {
      expect(workExperience.length).toBeGreaterThan(0);
      for (const w of workExperience) {
        expect(w.title).toBeTruthy();
        expect(w.company).toBeTruthy();
        expect(w.period).toMatch(/\d{2}\/\d{4}/);
      }
    });
  });

  describe('education', () => {
    it('has entries with required fields', () => {
      expect(education.length).toBeGreaterThan(0);
      for (const e of education) {
        expect(e.degree).toBeTruthy();
        expect(e.institution).toBeTruthy();
      }
    });
  });

  describe('publications', () => {
    it('has at least one publication with authors & venue', () => {
      expect(publications.length).toBeGreaterThan(0);
      for (const p of publications) {
        expect(p.title).toBeTruthy();
        expect(p.authors).toBeTruthy();
        expect(p.venue).toBeTruthy();
      }
    });
  });

  describe('skills', () => {
    it('has categories with items', () => {
      expect(skills.length).toBeGreaterThan(0);
      for (const cat of skills) {
        expect(cat.category).toBeTruthy();
        expect(cat.items.length).toBeGreaterThan(0);
      }
    });

    it('every skill level is between 0 and 100', () => {
      for (const cat of skills) {
        for (const s of cat.items) {
          expect(s.level).toBeGreaterThanOrEqual(0);
          expect(s.level).toBeLessThanOrEqual(100);
        }
      }
    });
  });

  describe('resumeText', () => {
    it('contains the candidate name and contact info', () => {
      expect(resumeText).toContain(personalInfo.name.toUpperCase());
      expect(resumeText).toContain(personalInfo.email);
    });
  });
});
