// Win95 sound scheme — authentic .wav files from the original OS.
// Mapped to the real Windows 95 sound event categories:
//
//   ding.wav    → Default Beep / Asterisk (information)
//   chord.wav   → Critical Stop / Error
//   chimes.wav  → Exclamation / Warning
//
// Startup (The Microsoft Sound) and shutdown (tada.mp3) are handled
// directly by WelcomeScreen and Desktop since they need sequencing.

import dingWav from './assets/ding.wav';
import chordWav from './assets/chord.wav';
import chimesWav from './assets/chimes.wav';

function play(src: string) {
  const a = new Audio(src);
  a.play().catch(() => {});
}

/** Default Beep / Asterisk — information, success, notification. */
export function playDing() { play(dingWav); }

/** Critical Stop — errors, failures, game over. */
export function playChord() { play(chordWav); }

/** Exclamation — warnings, confirmations dialogs, "are you sure?" */
export function playChimes() { play(chimesWav); }
