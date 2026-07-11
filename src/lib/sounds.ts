/**
 * Duolingo-style sound effects using the Web Audio API.
 * No external audio files needed — all sounds are synthesized.
 */

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

/** Bright, cheerful "ding-ding!" for correct answers. */
export function playCorrect() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // First note — C5
    playTone(ctx, 523.25, now, 0.12, "sine", 0.3);
    // Second note — E5 (higher, triumphant)
    playTone(ctx, 659.25, now + 0.12, 0.18, "sine", 0.3);
    // Third note — G5 (even higher, celebratory)
    playTone(ctx, 783.99, now + 0.25, 0.25, "sine", 0.25);
  } catch {
    // Silently fail if audio is blocked
  }
}

/** Short, low "buzz" for wrong answers. */
export function playWrong() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // Low buzz — two dissonant notes
    playTone(ctx, 185, now, 0.15, "square", 0.12);
    playTone(ctx, 170, now + 0.08, 0.2, "sawtooth", 0.08);
  } catch {
    // Silently fail if audio is blocked
  }
}

/** Fanfare for lesson completion. */
export function playComplete() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // C5 → E5 → G5 → C6 arpeggio
    playTone(ctx, 523.25, now, 0.12, "sine", 0.25);
    playTone(ctx, 659.25, now + 0.1, 0.12, "sine", 0.25);
    playTone(ctx, 783.99, now + 0.2, 0.12, "sine", 0.25);
    playTone(ctx, 1046.5, now + 0.3, 0.35, "sine", 0.3);
  } catch {
    // Silently fail
  }
}

function playTone(
  ctx: AudioContext,
  freq: number,
  startTime: number,
  duration: number,
  type: OscillatorType,
  volume: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, startTime);

  gain.gain.setValueAtTime(volume, startTime);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}
