/**
 * Web Audio API synthesizer emulating the 1978 Parker Brothers Merlin
 * Texas Instruments TMS1000 1-bit piezo square-wave sound chip.
 */

// Merlin 10-note scale frequencies (Hz)
// Based on Merlin 1978's pitch mapping:
// 1: C4 (261.63), 2: D4 (293.66), 3: E4 (329.63), 4: F4 (349.23), 5: G4 (392.00),
// 6: A4 (440.00), 7: B4 (493.88), 8: C5 (523.25), 9: D5 (587.33), 10: E5 (659.25)
export const MERLIN_FREQUENCIES: Record<number, number> = {
  0: 0, // Rest
  1: 261.63, // Low C (Do)
  2: 293.66, // D (Re)
  3: 329.63, // E (Mi)
  4: 349.23, // F (Fa)
  5: 392.00, // G (Sol)
  6: 440.00, // A (La)
  7: 493.88, // B (Ti)
  8: 523.25, // High C (Do)
  9: 587.33, // High D (Re)
  10: 659.25, // High E (Mi)
};

class MerlinAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6; // 0.0 to 1.0
  private currentToneOsc: OscillatorNode | null = null;
  private currentToneGain: GainNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  /**
   * Play a note corresponding to Merlin's 1-10 keys (or 0 for rest)
   */
  public playNote(noteIndex: number, durationSeconds: number = 0.2): void {
    if (this.isMuted || noteIndex === 0) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = MERLIN_FREQUENCIES[noteIndex];
    if (!freq) return;

    this.stopCurrentTone();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Vintage square wave piezo sound
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);

    // Warm vintage lowpass filter to mimic small plastic toy speaker casing
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    // Fast vintage attack/decay envelope
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.008); // crisp attack
    gain.gain.setValueAtTime(0.35, now + durationSeconds - 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + durationSeconds);

    this.currentToneOsc = osc;
    this.currentToneGain = gain;
  }

  public startContinuousTone(noteIndex: number): void {
    if (this.isMuted || noteIndex === 0) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const freq = MERLIN_FREQUENCIES[noteIndex];
    if (!freq) return;

    this.stopCurrentTone();

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.008);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);

    this.currentToneOsc = osc;
    this.currentToneGain = gain;
  }

  public stopCurrentTone(): void {
    if (this.currentToneGain && this.ctx && this.currentToneOsc) {
      try {
        const now = this.ctx.currentTime;
        this.currentToneGain.gain.setValueAtTime(this.currentToneGain.gain.value, now);
        this.currentToneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        this.currentToneOsc.stop(now + 0.025);
      } catch {
        // ignore if already stopped
      }
      this.currentToneOsc = null;
      this.currentToneGain = null;
    }
  }

  /**
   * Authentic tactile plastic membrane button click
   */
  public playClick(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.025);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Low defeat buzzer sound (120Hz square wave with rapid tremolo)
   */
  public playBuzzer(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(115, now);

    // Rapid flutter
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.setValueAtTime(0.05, now + 0.08);
    gain.gain.setValueAtTime(0.3, now + 0.16);
    gain.gain.setValueAtTime(0.05, now + 0.24);
    gain.gain.setValueAtTime(0.3, now + 0.32);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * Merlin computer turn thinking beep
   */
  public playComputerBeep(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.setValueAtTime(950, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  /**
   * Celebratory victory fanfare (Classic Merlin ascending arpeggio)
   */
  public async playVictory(): Promise<void> {
    if (this.isMuted) return;
    const sequence = [1, 3, 5, 8, 10, 8, 10];
    const timings = [100, 100, 100, 120, 160, 100, 300];

    for (let i = 0; i < sequence.length; i++) {
      this.playNote(sequence[i], timings[i] / 1000);
      await new Promise(r => setTimeout(r, timings[i]));
    }
  }

  /**
   * Classic Power-On chirp sequence
   */
  public async playPowerOn(): Promise<void> {
    if (this.isMuted) return;
    const notes = [1, 5, 8, 10];
    for (const note of notes) {
      this.playNote(note, 0.07);
      await new Promise(r => setTimeout(r, 75));
    }
  }
}

export const merlinAudio = new MerlinAudioEngine();
