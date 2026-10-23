/**
 * Authentic Ethiopian Sacred Instrument Audio Engine
 * Uses Web Audio API for zero-latency, realistic synthesis of Begena, Krar, and Washint
 */

let audioCtx = null;
let currentMelodyTimeout = null;
let isPlayingMelody = false;
let activeMelodyInstrument = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// 10 Begena Strings (Traditional Pentatonic Scale with authentic frequencies)
export const BEGENA_STRINGS = [
  { index: 1, name: "1ኛ (ግዕዝ/ጊርባ)", amharicName: "አውታር 1", freq: 65.41, note: "C2", label: "Girba" },
  { index: 2, name: "2ኛ", amharicName: "አውታር 2", freq: 73.42, note: "D2", label: "2nd" },
  { index: 3, name: "3ኛ", amharicName: "አውታር 3", freq: 82.41, note: "E2", label: "3rd" },
  { index: 4, name: "4ኛ", amharicName: "አውታር 4", freq: 98.00, note: "G2", label: "4th" },
  { index: 5, name: "5ኛ (ማዕከል)", amharicName: "አውታር 5", freq: 110.00, note: "A2", label: "5th" },
  { index: 6, name: "6ኛ", amharicName: "አውታር 6", freq: 130.81, note: "C3", label: "6th" },
  { index: 7, name: "7ኛ", amharicName: "አውታር 7", freq: 146.83, note: "D3", label: "7th" },
  { index: 8, name: "8ኛ", amharicName: "አውታር 8", freq: 164.81, note: "E3", label: "8th" },
  { index: 9, name: "9ኛ", amharicName: "አውታር 9", freq: 196.00, note: "G3", label: "9th" },
  { index: 10, name: "10ኛ", amharicName: "አውታር 10", freq: 220.00, note: "A3", label: "10th" }
];

export const KRAR_STRINGS = [
  { index: 1, freq: 196.00, note: "G3" },
  { index: 2, freq: 220.00, note: "A3" },
  { index: 3, freq: 261.63, note: "C4" },
  { index: 4, freq: 293.66, note: "D4" },
  { index: 5, freq: 329.63, note: "E4" },
  { index: 6, freq: 392.00, note: "G4" }
];

export const WASHINT_NOTES = [
  { index: 1, freq: 329.63, note: "E4" },
  { index: 2, freq: 392.00, note: "G4" },
  { index: 3, freq: 440.00, note: "A4" },
  { index: 4, freq: 523.25, note: "C5" },
  { index: 5, freq: 587.33, note: "D5" },
  { index: 6, freq: 659.25, note: "E5" }
];

/**
 * Pluck a single Begena string with its authentic buzzing "ensera" acoustic characteristic
 */
export function playBegenaString(freq = 98, duration = 3.2) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.7, now + 0.015);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Fundamental Body Tone (Deep resonant string)
  const osc1 = ctx.createOscillator();
  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(freq, now);

  // Subtle pitch bend at the initial hard pluck (gut string behavior)
  osc1.frequency.exponentialRampToValueAtTime(freq * 1.02, now + 0.03);
  osc1.frequency.exponentialRampToValueAtTime(freq, now + 0.15);

  // Begena Buzz Generator ("Ensera" - buzzing contact on the leather bridge)
  const buzzOsc = ctx.createOscillator();
  buzzOsc.type = 'square';
  buzzOsc.frequency.setValueAtTime(freq * 2.01, now);

  const buzzGain = ctx.createGain();
  buzzGain.gain.setValueAtTime(0.35, now);
  buzzGain.gain.exponentialRampToValueAtTime(0.01, now + (duration * 0.7));

  // Acoustic body filter (simulating wooden soundbox covered in parchment skin)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(freq * 4.5, now);
  filter.frequency.exponentialRampToValueAtTime(freq * 1.8, now + duration * 0.8);
  filter.Q.value = 4.0;

  // Connect graph
  osc1.connect(filter);
  buzzOsc.connect(buzzGain);
  buzzGain.connect(filter);

  filter.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc1.start(now);
  buzzOsc.start(now);

  osc1.stop(now + duration);
  buzzOsc.stop(now + duration);
}

/**
 * Pluck a Krar string (crisp, higher-pitched, resonant bowl lyre tone)
 */
export function playKrarString(freq = 261.63, duration = 1.8) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.6, now + 0.008);
  masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  // Harmonic overtone
  const harmOsc = ctx.createOscillator();
  harmOsc.type = 'sine';
  harmOsc.frequency.setValueAtTime(freq * 2, now);

  const harmGain = ctx.createGain();
  harmGain.gain.setValueAtTime(0.3, now);
  harmGain.gain.exponentialRampToValueAtTime(0.001, now + duration * 0.5);

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq * 2.5, now);
  filter.Q.value = 2.0;

  osc.connect(masterGain);
  harmOsc.connect(harmGain);
  harmGain.connect(masterGain);

  masterGain.connect(ctx.destination);

  osc.start(now);
  harmOsc.start(now);

  osc.stop(now + duration);
  harmOsc.stop(now + duration);
}

/**
 * Play a Washint note (warm breathy bamboo flute with vibrato)
 */
export function playWashintNote(freq = 440, duration = 1.6) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Gain with gentle flute attack and release
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.linearRampToValueAtTime(0.45, now + 0.12);
  masterGain.gain.setValueAtTime(0.4, now + duration - 0.2);
  masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Main breathy tone
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  // Vibrato LFO
  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(5.2, now); // 5Hz vibrato
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(freq * 0.02, now);
  lfo.connect(osc.frequency);

  // Bamboo air breath noise generator
  const bufferSize = ctx.sampleRate * 0.3;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }
  const whiteNoise = ctx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(freq * 1.5, now);
  noiseFilter.Q.value = 5.0;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.06, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

  whiteNoise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(masterGain);

  osc.connect(masterGain);
  masterGain.connect(ctx.destination);

  osc.start(now);
  lfo.start(now);
  whiteNoise.start(now);

  osc.stop(now + duration);
  lfo.stop(now + duration);
  whiteNoise.stop(now + duration);
}

/**
 * Play a representative spiritual melody loop for any instrument
 */
export function playInstrumentMelody(instrument, onProgress, onComplete) {
  stopMelody();
  const ctx = getAudioContext();
  if (!ctx) return;

  isPlayingMelody = true;
  activeMelodyInstrument = instrument;

  let sequence = [];
  if (instrument === 'begena') {
    // Meditative slow Zema melody on Begena
    sequence = [
      { note: BEGENA_STRINGS[4].freq, dur: 1.4, pause: 650 },
      { note: BEGENA_STRINGS[3].freq, dur: 1.2, pause: 600 },
      { note: BEGENA_STRINGS[5].freq, dur: 1.6, pause: 750 },
      { note: BEGENA_STRINGS[4].freq, dur: 1.2, pause: 600 },
      { note: BEGENA_STRINGS[2].freq, dur: 1.4, pause: 700 },
      { note: BEGENA_STRINGS[0].freq, dur: 2.2, pause: 1100 },
      { note: BEGENA_STRINGS[3].freq, dur: 1.3, pause: 650 },
      { note: BEGENA_STRINGS[4].freq, dur: 2.5, pause: 1300 },
    ];
  } else if (instrument === 'krar') {
    // Rhythmic Krar hymn
    sequence = [
      { note: KRAR_STRINGS[2].freq, dur: 0.7, pause: 350 },
      { note: KRAR_STRINGS[3].freq, dur: 0.7, pause: 350 },
      { note: KRAR_STRINGS[4].freq, dur: 0.9, pause: 450 },
      { note: KRAR_STRINGS[2].freq, dur: 0.7, pause: 350 },
      { note: KRAR_STRINGS[0].freq, dur: 0.8, pause: 400 },
      { note: KRAR_STRINGS[1].freq, dur: 0.9, pause: 450 },
      { note: KRAR_STRINGS[2].freq, dur: 1.4, pause: 700 },
    ];
  } else if (instrument === 'washint') {
    // Haunting breathy Washint solo
    sequence = [
      { note: WASHINT_NOTES[1].freq, dur: 1.2, pause: 600 },
      { note: WASHINT_NOTES[3].freq, dur: 1.4, pause: 700 },
      { note: WASHINT_NOTES[4].freq, dur: 1.6, pause: 800 },
      { note: WASHINT_NOTES[2].freq, dur: 1.1, pause: 550 },
      { note: WASHINT_NOTES[1].freq, dur: 1.8, pause: 900 },
      { note: WASHINT_NOTES[0].freq, dur: 2.2, pause: 1100 },
    ];
  }

  let step = 0;
  function nextNote() {
    if (!isPlayingMelody || step >= sequence.length) {
      isPlayingMelody = false;
      activeMelodyInstrument = null;
      if (onComplete) onComplete();
      return;
    }

    const item = sequence[step];
    if (onProgress) onProgress(step, sequence.length);

    if (instrument === 'begena') {
      playBegenaString(item.note, item.dur);
    } else if (instrument === 'krar') {
      playKrarString(item.note, item.dur);
    } else if (instrument === 'washint') {
      playWashintNote(item.note, item.dur);
    }

    step++;
    currentMelodyTimeout = setTimeout(nextNote, item.pause);
  }

  nextNote();
}

export function stopMelody() {
  isPlayingMelody = false;
  activeMelodyInstrument = null;
  if (currentMelodyTimeout) {
    clearTimeout(currentMelodyTimeout);
    currentMelodyTimeout = null;
  }
}

export function getPlayingInstrument() {
  return activeMelodyInstrument;
}
