import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SpeechSynthesisService {

  private state: 'idle' | 'speaking' | 'paused' = 'idle';

  private chunks: string[] = [];
  private index = 0;

  private lastText = '';
  private currentLang: string = 'ru';
  private activeMessageId: string | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];

  private wasCancelled = false;
  constructor(private translate: TranslateService) {
    this.currentLang = this.translate.currentLang;

    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang;
    });

    // Load voices when they become available
    this.loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  // ===== PUBLIC STATE =====
  getState() {
    return this.state;
  }

  getLastText() {
    return this.lastText;
  }

  getActiveMessageId() {
    return this.activeMessageId;
  }

  hasLastText(): boolean {
    return !!this.lastText;
  }
  private loadVoices(): void {
    if ('speechSynthesis' in window) {
      this.availableVoices = window.speechSynthesis.getVoices();
      console.log('Available voices:', this.availableVoices.map(v => ({ name: v.name, lang: v.lang, gender: v.localService })));
    }
  }
  private getMaleVoice(): SpeechSynthesisVoice | null {
    if (this.availableVoices.length === 0) {
      this.loadVoices();
    }

    const langCode = this.getLanguageCode();

    // Try to find a male voice for the current language
    // Male voices often contain keywords like 'Male', 'David', 'Microsoft Pavel', 'Yuri', etc.
    const maleKeywords = ['male', 'david', 'pavel', 'yuri', 'alex', 'sergey', 'igor', 'dmitry', 'maxim', 'andrew'];

    // First, try to find a male voice for the specific language
    let voice = this.availableVoices.find(v =>
      v.lang.startsWith(langCode.split('-')[0]) &&
      maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
    ) || null;
    // If not found, try any male voice
    if (!voice) {
      voice = this.availableVoices.find(v =>
        maleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))
      ) || null;
    }

    // If still not found, return the first available voice for the language
    if (!voice) {
      voice = this.availableVoices.find(v =>
        v.lang.startsWith(langCode.split('-')[0])
      ) || null;
    }

    // Last resort: return any available voice
    if (!voice && this.availableVoices.length > 0) {
      voice = this.availableVoices[0] || null;
    }

    return voice;
  }

  private getLanguageCode(): string {
    const langMap: { [key: string]: string } = {
      'ru': 'ru-RU',
      'kk': 'kk-KZ',
      'en': 'en-US'
    };
    return langMap[this.currentLang] || 'en-US';
  }
  // ===== SPEAK =====
  speak(text: string, messageId?: string): Promise<void> {

    this.cancel();

    this.lastText = text;
    this.activeMessageId = messageId || null;

    this.chunks = this.splitText(text);
    this.index = 0;
    this.wasCancelled = false;

    this.state = 'speaking';

    return this.play();
  }

  private play(): Promise<void> {
    return new Promise((resolve) => {

      if (this.wasCancelled) return resolve();

      if (this.index >= this.chunks.length) {
        this.reset();
        return resolve();
      }

      const utterance = new SpeechSynthesisUtterance(this.chunks[this.index]);
      utterance.lang = this.getLanguageCode();
      utterance.rate = 1.5;  // Speed x1.5
      utterance.pitch = 0.9; // Slightly lower pitch for male voice
      utterance.volume = 1;
      // Try to set a male voice
      const maleVoice = this.getMaleVoice();
      if (maleVoice) {
        utterance.voice = maleVoice;
        console.log('Using voice:', maleVoice.name);
      }

      this.state = 'speaking';

      utterance.onend = () => {
        this.index++;
        this.play().then(resolve);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  // ===== PAUSE =====
  pause() {
    if (this.state !== 'speaking') return;
    window.speechSynthesis.pause();
    this.state = 'paused';
  }

  // ===== RESUME =====
  resume() {
    if (this.state !== 'paused') return;
    window.speechSynthesis.resume();
    this.state = 'speaking';
  }

  // ===== STOP =====
  cancel() {
    this.wasCancelled = true;
    window.speechSynthesis.cancel();
    this.state = 'idle';

    this.chunks = [];
    this.index = 0;

  }

  replay(): Promise<void> {
    if (!this.lastText) return Promise.resolve();

    this.cancel(); // стоп текущего

    return this.speak(this.lastText, this.activeMessageId || undefined);
  }

  private reset() {
    this.state = 'idle';
    this.chunks = [];
    this.index = 0;
  }
  get isPlaying(): boolean {
    return this.state === 'speaking';
  }

  private splitText(text: string) {
    return text
      .replace(/\n/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean);
  }
}