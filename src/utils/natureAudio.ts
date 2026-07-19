/**
 * Web Audio Nature Sound Synthesizer
 * Generates beautiful, procedural ambient focus sounds client-side.
 * No external media dependencies.
 */

class NatureAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private rainNode: AudioBufferSourceNode | null = null;
  private windNode: AudioBufferSourceNode | null = null;
  private rainFilter: BiquadFilterNode | null = null;
  private windFilter: BiquadFilterNode | null = null;
  private rainGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private windLfo: OscillatorNode | null = null;
  private birdTimer: number | null = null;
  private masterGain: GainNode | null = null;
  private isAudioRunning = false;

  private initContext() {
    if (!this.ctx) {
      // @ts-ignore - Support older safari browsers if needed
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime); // moderate default volume
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Helper to create white noise buffer
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  public setVolume(volume: number) {
    this.initContext();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.1);
    }
  }

  public getVolume(): number {
    return this.masterGain ? this.masterGain.gain.value : 0.4;
  }

  public startRain() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.rainNode) this.stopRain();

    try {
      const buffer = this.createNoiseBuffer();
      this.rainNode = this.ctx.createBufferSource();
      this.rainNode.buffer = buffer;
      this.rainNode.loop = true;

      this.rainFilter = this.ctx.createBiquadFilter();
      this.rainFilter.type = "lowpass";
      this.rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.rainGain = this.ctx.createGain();
      this.rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

      // Connect: Noise -> Filter -> Gain -> Master
      this.rainNode.connect(this.rainFilter);
      this.rainFilter.connect(this.rainGain);
      this.rainGain.connect(this.masterGain);

      this.rainNode.start(0);
      this.isAudioRunning = true;
    } catch (e) {
      console.error("Failed to play procedural rain", e);
    }
  }

  public stopRain() {
    if (this.rainNode) {
      try {
        this.rainNode.stop();
      } catch (e) {}
      this.rainNode.disconnect();
      this.rainNode = null;
    }
    if (this.rainFilter) {
      this.rainFilter.disconnect();
      this.rainFilter = null;
    }
    if (this.rainGain) {
      this.rainGain.disconnect();
      this.rainGain = null;
    }
    this.checkIfIdle();
  }

  public startWind() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.windNode) this.stopWind();

    try {
      const buffer = this.createNoiseBuffer();
      this.windNode = this.ctx.createBufferSource();
      this.windNode.buffer = buffer;
      this.windNode.loop = true;

      this.windFilter = this.ctx.createBiquadFilter();
      this.windFilter.type = "bandpass";
      this.windFilter.Q.setValueAtTime(1.8, this.ctx.currentTime);
      this.windFilter.frequency.setValueAtTime(350, this.ctx.currentTime);

      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.22, this.ctx.currentTime);

      // LFO to modulate filter frequency (creates wind blowing gusts)
      this.windLfo = this.ctx.createOscillator();
      this.windLfo.type = "sine";
      this.windLfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow oscillation

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(150, this.ctx.currentTime); // sweep range: 150 Hz

      this.windLfo.connect(lfoGain);
      // Modulate filter frequency with LFO
      lfoGain.connect(this.windFilter.frequency);

      // Connect sound pipeline: Noise -> Filter -> Gain -> Master
      this.windNode.connect(this.windFilter);
      this.windFilter.connect(this.windGain);
      this.windGain.connect(this.masterGain);

      this.windLfo.start(0);
      this.windNode.start(0);
      this.isAudioRunning = true;
    } catch (e) {
      console.error("Failed to play procedural wind", e);
    }
  }

  public stopWind() {
    if (this.windNode) {
      try {
        this.windNode.stop();
      } catch (e) {}
      this.windNode.disconnect();
      this.windNode = null;
    }
    if (this.windLfo) {
      try {
        this.windLfo.stop();
      } catch (e) {}
      this.windLfo.disconnect();
      this.windLfo = null;
    }
    if (this.windFilter) {
      this.windFilter.disconnect();
      this.windFilter = null;
    }
    if (this.windGain) {
      this.windGain.disconnect();
      this.windGain = null;
    }
    this.checkIfIdle();
  }

  // Generates randomized high-pitch beautiful forest bird chirps
  public startBirds() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    if (this.birdTimer) this.stopBirds();

    this.isAudioRunning = true;
    const playChirpGroup = () => {
      if (!this.ctx || !this.masterGain || !this.isAudioRunning) return;

      const now = this.ctx.currentTime;
      const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 rapid chirps

      let timeOffset = 0;
      for (let i = 0; i < count; i++) {
        const chirpStart = now + timeOffset;
        const duration = 0.05 + Math.random() * 0.05; // very rapid

        const osc = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();

        // High sweet bird chirp frequency sweeps
        osc.type = "sine";
        const startFreq = 2200 + Math.random() * 1200;
        const endFreq = startFreq + 1500 * (Math.random() > 0.5 ? 1 : -0.7);

        osc.frequency.setValueAtTime(startFreq, chirpStart);
        osc.frequency.exponentialRampToValueAtTime(endFreq, chirpStart + duration);

        gainNode.gain.setValueAtTime(0.001, chirpStart);
        gainNode.gain.linearRampToValueAtTime(0.08, chirpStart + duration * 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.001, chirpStart + duration);

        osc.connect(gainNode);
        gainNode.connect(this.masterGain);

        osc.start(chirpStart);
        osc.stop(chirpStart + duration);

        timeOffset += duration + 0.08 + Math.random() * 0.08;
      }

      // Schedule next chirp group in 4 to 9 seconds
      const nextDelay = 4000 + Math.random() * 5000;
      this.birdTimer = window.setTimeout(playChirpGroup, nextDelay);
    };

    // Play first chirp group shortly
    this.birdTimer = window.setTimeout(playChirpGroup, 1200);
  }

  public stopBirds() {
    if (this.birdTimer) {
      clearTimeout(this.birdTimer);
      this.birdTimer = null;
    }
    this.checkIfIdle();
  }

  private checkIfIdle() {
    if (!this.rainNode && !this.windNode && !this.birdTimer) {
      this.isAudioRunning = false;
      if (this.ctx && this.ctx.state !== "suspended") {
        // Suspend context to conserve battery/cpu when not playing
        this.ctx.suspend();
      }
    }
  }

  public stopAll() {
    this.stopRain();
    this.stopWind();
    this.stopBirds();
    this.isAudioRunning = false;
  }

  public isRunning(): boolean {
    return this.isAudioRunning;
  }
}

export const natureAudio = new NatureAudioSynthesizer();
