import { Component, OnInit, OnDestroy, Renderer2, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';
import { AiService } from '../../services/ai.service';
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
export class AiAssistantComponent {

  isOpen = false;
  userInput = '';
  isTyping = false;
  messages: Message[] = [];
  modelLabel = 'AI: DDC KZ Assistant';
  isAudioEnabled = true;
  currentLang = 'ru';
  get hasInput(): boolean {
    return this.userInput.trim().length > 0;
  }

  constructor(
    private aiService: AiService,
    private speechService: SpeechSynthesisService,
    private translate: TranslateService
  ) { }

  // ===== STATE =====
  get audioState() {
    return this.speechService.getState();
  }

  get activeMessageId() {
    return this.speechService.getActiveMessageId();
  }

  get hasLastText(): boolean {
    return this.speechService.getLastText().length > 0;
  }

  formatMessage(content: string): string {
    // Convert newlines to HTML line breaks and escape HTML
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  toggleAssistant(): void {
    this.isOpen = !this.isOpen;
  }

  // ===== SEND MESSAGE =====
  sendMessage() {
    if (!this.hasInput) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);

    const text = this.userInput;
    this.userInput = '';
    this.isTyping = true;

    this.aiService.askAI(text).subscribe(response => {

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      this.messages.push(assistantMessage);
      this.isTyping = false;

      // 🔥 IMPORTANT: pass message ID
      this.speechService.speak(response, assistantMessage.id);
    });
  }

  // ===== AUDIO CONTROL =====
  pauseAudio() {
    this.speechService.pause();
  }

  resumeAudio() {
    this.speechService.resume();
  }

  stopAudio() {
    this.speechService.cancel();
  }

  replayAudio(): void {
    this.speechService.replay();
  }
}

