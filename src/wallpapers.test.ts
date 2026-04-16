import { describe, it, expect, beforeEach } from 'vitest';
import {
  wallpapers,
  win95Colors,
  loadBackground,
  saveBackground,
  getBackgroundStyle,
} from './wallpapers';

describe('wallpapers module', () => {
  beforeEach(() => localStorage.clear());

  describe('data', () => {
    it('exposes at least one wallpaper with valid fields', () => {
      expect(wallpapers.length).toBeGreaterThan(0);
      for (const w of wallpapers) {
        expect(w.name).toBeTruthy();
        expect(['tile', 'stretch']).toContain(w.type);
        expect(typeof w.src).toBe('string');
      }
    });

    it('wallpaper names are unique', () => {
      const names = wallpapers.map(w => w.name);
      expect(new Set(names).size).toBe(names.length);
    });

    it('exposes the 17 classic palette colors (16 + Teal dup-named)', () => {
      expect(win95Colors.length).toBe(17);
      for (const c of win95Colors) {
        expect(c.value).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    });
  });

  describe('loadBackground', () => {
    it('returns teal default when nothing is stored', () => {
      expect(loadBackground()).toEqual({ type: 'color', value: '#008080' });
    });

    it('returns stored value when valid JSON is present', () => {
      localStorage.setItem(
        'win95-desktop-bg',
        JSON.stringify({ type: 'wallpaper', value: 'Clouds' }),
      );
      expect(loadBackground()).toEqual({ type: 'wallpaper', value: 'Clouds' });
    });

    it('falls back to default when stored value is corrupt', () => {
      localStorage.setItem('win95-desktop-bg', 'not json');
      expect(loadBackground()).toEqual({ type: 'color', value: '#008080' });
    });
  });

  describe('saveBackground', () => {
    it('persists background to localStorage', () => {
      saveBackground({ type: 'color', value: '#FF0000' });
      const raw = localStorage.getItem('win95-desktop-bg');
      expect(raw).toBeTruthy();
      expect(JSON.parse(raw!)).toEqual({ type: 'color', value: '#FF0000' });
    });

    it('round-trips through load', () => {
      saveBackground({ type: 'wallpaper', value: 'Forest' });
      expect(loadBackground()).toEqual({ type: 'wallpaper', value: 'Forest' });
    });
  });

  describe('getBackgroundStyle', () => {
    it('returns backgroundColor for color background', () => {
      expect(getBackgroundStyle({ type: 'color', value: '#123456' })).toEqual({
        backgroundColor: '#123456',
      });
    });

    it('returns teal fallback for unknown wallpaper name', () => {
      expect(getBackgroundStyle({ type: 'wallpaper', value: 'NotAWallpaper' })).toEqual({
        backgroundColor: '#008080',
      });
    });

    it('returns repeat style for tile wallpapers', () => {
      const tile = wallpapers.find(w => w.type === 'tile')!;
      const style = getBackgroundStyle({ type: 'wallpaper', value: tile.name });
      expect(style.backgroundRepeat).toBe('repeat');
      expect(style.backgroundImage).toContain(tile.src);
    });

    it('returns cover style for stretch wallpapers', () => {
      const stretch = wallpapers.find(w => w.type === 'stretch');
      if (!stretch) return;
      const style = getBackgroundStyle({ type: 'wallpaper', value: stretch.name });
      expect(style.backgroundSize).toBe('cover');
      expect(style.backgroundRepeat).toBe('no-repeat');
      expect(style.backgroundImage).toContain(stretch.src);
    });
  });
});
