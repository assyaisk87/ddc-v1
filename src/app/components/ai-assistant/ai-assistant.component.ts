import { Component, OnInit, OnDestroy, Renderer2, Inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil, throttleTime } from 'rxjs/operators';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss',
})
export class AiAssistantComponent implements OnInit, OnDestroy {
  isOpen = false;
  userInput = '';
  isTyping = false;
  messages: Message[] = [];
  private destroy$ = new Subject<void>();

  @ViewChild('userInput') userInputRef!: ElementRef;

  get hasInput(): boolean {
    return this.userInput.trim().length > 0;
  }

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService
  ) {
    // Initialize with current language
    this.translate.get('ai.welcome').subscribe(welcome => {
      this.defaultWelcome = welcome;
    });
  }

  private defaultWelcome = '';

  ngOnInit(): void {
    this.addWelcomeMessage();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

    const userMessage: Message = {
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    this.userInput = '';
    this.isTyping = true;

    // Clear input field
    if (this.userInputRef?.nativeElement) {
      this.userInputRef.nativeElement.value = '';
    }

    // Simulate AI response
    setTimeout(() => {
      const response = this.getAIResponse(userMessage.content);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      this.messages.push(assistantMessage);
      this.isTyping = false;
      this.scrollToBottom();
    }, 1000);

    this.scrollToBottom();
  }

  private getAIResponse(userInput: string): string {
    const lowerInput = userInput.toLowerCase();
    const currentLang = this.translate.currentLang;

    // Keywords for different topics
    if (lowerInput.includes('project') || lowerInput.includes('проект') || 
        lowerInput.includes('kaspi') || lowerInput.includes('halyk') ||
        lowerInput.includes('jusan')) {
      return currentLang === 'ru' ? 
        'Наши основные проекты включают Интеграцию Kaspi Pay, Halyk Digital Bank и Jusan AI Analytics. Каждый проект представляет передовые финтех решения для банковского сектора Казахстана.' :
        'Our main projects include Kaspi Pay Integration, Halyk Digital Bank, and Jusan AI Analytics. Each project represents cutting-edge fintech solutions for Kazakhstan\'s banking sector.';
    }

    if (lowerInput.includes('technology') || lowerInput.includes('технолог') ||
        lowerInput.includes('angular') || lowerInput.includes('blockchain') ||
        lowerInput.includes('ai') || lowerInput.includes('искусствен')) {
      return currentLang === 'ru' ?
        'Мы используем современные технологии включая Angular, TypeScript, интеграцию блокчейна и аналитику на базе ИИ. Наш стек обеспечивает высокую производительность и безопасность.' :
        'We use modern technologies including Angular, TypeScript, blockchain integration, and AI-powered analytics. Our stack ensures high performance and security.';
    }

    if (lowerInput.includes('partner') || lowerInput.includes('сотруднич') ||
        lowerInput.includes('work') || lowerInput.includes('работат')) {
      return currentLang === 'ru' ?
        'Мы всегда открыты для нового партнерства! Пожалуйста, свяжитесь с нами через страницу контактов или по email info@ddc.kz для обсуждения возможностей сотрудничества.' :
        'We\'re always open to new partnerships! Please contact us through our contacts page or email at info@ddc.kz to discuss collaboration opportunities.';
    }

    if (lowerInput.includes('team') || lowerInput.includes('команд') ||
        lowerInput.includes('employee') || lowerInput.includes('сотрудник')) {
      return currentLang === 'ru' ?
        'Наша команда состоит из опытных профессионалов финтеха, включая разработчиков, дизайнеров и бизнес-аналитиков. У нас более 50 банковских партнеров по всему Казахстану.' :
        'Our team consists of experienced fintech professionals including developers, designers, and business analysts. We have over 50 banking partners across Kazakhstan.';
    }

    if (lowerInput.includes('contact') || lowerInput.includes('связ') ||
        lowerInput.includes('phone') || lowerInput.includes('телефон') ||
        lowerInput.includes('email') || lowerInput.includes('адрес')) {
      return currentLang === 'ru' ?
        'Вы можете связаться с нами по телефону +7 (777) 123-45-67 или email info@ddc.kz. Наш офис находится в Алматы, Финансовый район, здание 12.' :
        'You can reach us at +7 (777) 123-45-67 or email info@ddc.kz. Our office is located in Almaty, Financial District, Building 12.';
    }

    // Default response
    return currentLang === 'ru' ?
      'Я могу помочь вам узнать больше о наших проектах и технологиях. Свободно спрашивайте о наших решениях, команде или возможностях партнерства!':
      'I can help you learn more about our projects and technologies. Feel free to ask about our solutions, team, or partnership opportunities!';
  }

  private addWelcomeMessage(): void {
    const currentLang = this.translate.currentLang;
    const welcomeText = currentLang === 'ru' ?
      'Привет! Я ваш AI-ассистент DDC KZ. Чем могу помочь?' :
      'Hello! I\'m your DDC KZ AI assistant. How can I help?';

    this.messages.push({
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
