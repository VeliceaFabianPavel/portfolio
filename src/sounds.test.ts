import { describe, it, expect, vi, beforeEach } from 'vitest';
import { playDing, playChord, playChimes } from './sounds';

describe('sounds', () => {
  let playSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    playSpy = vi.fn(() => Promise.resolve());
    HTMLMediaElement.prototype.play = playSpy as unknown as HTMLMediaElement['play'];
  });

  it('playDing constructs an Audio and plays it', () => {
    playDing();
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('playChord plays audio', () => {
    playChord();
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('playChimes plays audio', () => {
    playChimes();
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it('swallows play() rejection (autoplay blocked)', async () => {
    HTMLMediaElement.prototype.play = vi.fn(() => Promise.reject(new Error('blocked'))) as any;
    expect(() => playDing()).not.toThrow();
    // Wait a microtask for the rejection to flow through .catch()
    await Promise.resolve();
  });
});
