import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechSynthesisService {
  private isSpeaking = false;
  private isPaused = false;
  private isAudioEnabled = true;
  private currentLang: string = 'ru';
  private availableVoices: SpeechSynthesisVoice[] = [];

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

  speak(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isAudioEnabled) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.cancel();

      if (!('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported');
        reject(new Error('Speech synthesis not supported'));
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
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

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (event) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', event);
        reject(event);
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  cancel(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      this.isPaused = false;
    }
  }

  pause(): void {
    if ('speechSynthesis' in window && this.isSpeaking && !this.isPaused) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  resume(): void {
    if ('speechSynthesis' in window && this.isPaused) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  toggleAudio(): void {
    this.isAudioEnabled = !this.isAudioEnabled;
    if (!this.isAudioEnabled) {
      this.cancel();
    }
  }

  get isPlaying(): boolean {
    return this.isSpeaking;
  }

  get audioEnabled(): boolean {
    return this.isAudioEnabled;
  }

  setAudioEnabled(enabled: boolean): void {
    this.isAudioEnabled = enabled;
    if (!enabled) {
      this.cancel();
    }
  }
}

