import { Component, OnInit, OnDestroy, Renderer2, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { GroqService } from '../../services/groq.service';
import { SpeechSynthesisService } from '../../services/speech-synthesis.service';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
})
export class AiAssistantComponent implements OnInit, OnDestroy {
  isOpen = false;
  userInput = '';
  isTyping = false;
  messages: Message[] = [];
  modelLabel = '';
  private destroy$ = new Subject<void>();
  private groqSubscription?: Subscription;
  isAudioEnabled = true;
  currentLang: string = 'ru';
  private lastSpokenText: string = '';

  @ViewChild('userInput') userInputRef!: ElementRef;

  get hasInput(): boolean {
    return this.userInput.trim().length > 0;
  }

  get isAudioPaused(): boolean {
    return (this.speechService as any).isPaused;
  }

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private groqService: GroqService,
    private speechService: SpeechSynthesisService
  ) {
    // Show which model is used by the assistant
    this.modelLabel = `AI: Groq (${this.groqService.modelName})`;
    this.currentLang = this.translate.currentLang;
    
    // Subscribe to language changes
    this.translate.onLangChange.subscribe(() => {
      this.currentLang = this.translate.currentLang;
    });
  }

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.groqSubscription) {
      this.groqSubscription.unsubscribe();
    }
    this.speechService.cancel();
  }

  toggleAssistant(): void {
    this.isOpen = !this.isOpen;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.userInput = target.value;
  }

  sendMessage(): void {
    if (!this.hasInput) return;

    const currentLang = this.translate.currentLang || 'en';
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageContent = this.userInput; // Store for error handling
    this.userInput = '';
    this.isTyping = true;

    // Clear input field
    if (this.userInputRef?.nativeElement) {
      this.userInputRef.nativeElement.value = '';
    }

    // Unsubscribe from previous request if exists
    if (this.groqSubscription) {
      this.groqSubscription.unsubscribe();
    }

    // Subscribe to Groq API response
    this.groqSubscription = this.groqService.getResponse(messageContent, currentLang)
      .subscribe({
        next: (response) => {
          const assistantMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: response,
            timestamp: new Date()
          };
          this.messages.push(assistantMessage);
          this.isTyping = false;
          this.scrollToBottom();
          this.speakResponse(response);
        },
        error: (error) => {
          console.error('Error fetching AI response:', error);
          this.isTyping = false;
          const errorMessage: Message = {
            id: Date.now().toString(),
      role: 'assistant',
            content: currentLang === 'ru' ? 'Извините, произошла ошибка. Пожалуйста, попробуйте позже.' : 'Sorry, an error occurred. Please try again later.',
      timestamp: new Date()
          };
          this.messages.push(errorMessage);
          this.scrollToBottom();
        }
      });
  }

  speakResponse(text: string): void {
    if (!this.isAudioEnabled) return;

    this.lastSpokenText = text;

    this.speechService.speak(text).catch(err => {
      console.error('Error speaking response:', err);
    });
  }

  resumeAudio(): void {
    // Restart from beginning with last spoken text
    if (this.lastSpokenText && this.isAudioEnabled) {
      this.speechService.speak(this.lastSpokenText).catch(err => {
        console.error('Error resuming speech:', err);
      });
    }
  }

  pauseAudio(): void {
    this.speechService.pause();
  }

  stopAudio(): void {
    this.speechService.cancel();
  }

  toggleAudioEnabled(): void {
    this.isAudioEnabled = !this.isAudioEnabled;
    this.speechService.setAudioEnabled(this.isAudioEnabled);
  }

  formatMessage(content: string): string {
    // Convert newlines to HTML line breaks and escape HTML
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  private addWelcomeMessage(): void {
    const currentLang = this.translate.currentLang;
    const welcomeText = currentLang === 'ru' ?
      'Привет! Я ваш AI-ассистент DDC KZ. Чем могу помочь?' :
      'Hello! I\'m your DDC KZ AI assistant. How can I help?';

    this.messages.push({
      id: 'welcome',
      role: 'assistant',
      content: welcomeText,
      timestamp: new Date()
    });
      }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.document.querySelector('.ai-messages');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}

