import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';

@Component({
  selector: 'app-ai-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-avatar.component.html',
  styleUrl: './ai-avatar.component.scss'
})
export class AiAvatarComponent implements OnInit, OnDestroy {
  @Input() isPlaying: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  
  showGreeting = true;
  showAudioControl = true;
  audioText = '';
  currentLang: string = 'ru';
  isAudioEnabled = true;

  constructor(
    private translate: TranslateService,
    public speechService: SpeechSynthesisService
  ) {
    this.currentLang = this.translate.currentLang;
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang;
    });
  }

  ngOnInit(): void {
    // Play welcome message after a short delay
    // setTimeout(() => {
    //   this.playWelcomeMessage();
    // }, 1000);
  }

  ngOnDestroy(): void {
    this.speechService.cancel();
  }

  get welcomeMessage(): string {
    return this.currentLang === 'ru' ?
      'Добро пожаловать! Я ваш AI-аватар CEO. Я могу озвучивать ответы и помогать вам с навигацией по сайту.' :
      'Welcome! I\'m your CEO AI avatar. I can voice responses and help you navigate the site.';
  }

  playWelcomeMessage(): void {
    if (!this.isAudioEnabled) return;
    
    this.audioText = this.welcomeMessage;
    this.speechService.speak(this.audioText).catch(err => {
      console.error('Error playing welcome message:', err);
    });
  }

  toggleAudio(): void {
    if (this.speechService.isPlaying) {
      this.speechService.cancel();
      return;
    }

    if (this.audioText) {
      this.speechService.speak(this.audioText).catch(err => {
        console.error('Error playing audio:', err);
      });
    } else {
      this.playWelcomeMessage();
    }
  }

  toggleGreeting(): void {
    this.showGreeting = !this.showGreeting;
    if (!this.showGreeting) {
      this.speechService.cancel();
    }
  }

  toggleAudioControl(): void {
    this.showAudioControl = !this.showAudioControl;
  }

  // toggleAudioEnabled(): void {
  //   this.isAudioEnabled = !this.isAudioEnabled;
  //   this.speechService.setAudioEnabled(this.isAudioEnabled);
  // }

  getAudioButtonText(): string {
    if (this.speechService.isPlaying) {
      return this.currentLang === 'ru' ? 'Остановить' : 'Stop';
    }
    return this.currentLang === 'ru' ? 'Воспроизвести' : 'Play';
  }

  getAudioIcon(): string {
    if (this.speechService.isPlaying) {
      return '🔇';
    }
    return this.isAudioEnabled ? '🔊' : '🔈';
  }

  getAudioControlIcon(): string {
    return this.isAudioEnabled ? '🔊' : '🔇';
  }
}

