import { Injectable } from '@angular/core';
import { GROQ_API_KEY } from '../../environments/environments';
import { AIContextService } from './ai-context.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// Используем GROQ API - бесплатный LLM сервис
// Ключ хранится в src/environments/environments.ts и используется напрямую клиентом.
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile'; // Актуальная production модель на Groq

@Injectable({
  providedIn: 'root'
})
export class GroqService {
  // Expose model name for UI display
  public readonly modelName = GROQ_MODEL;

  constructor(
    private aiContextService: AIContextService
  ) {}

  private getSystemPrompt(language: string): string {
    // Используем новый AIContextService с загрузкой JSON
    return this.aiContextService.getSystemPrompt(language);
  }

  /**
   * Получает ответ от Groq API
   * Сначала загружает переводы, затем отправляет запрос
   */
  getResponse(userInput: string, language: string = 'en'): Observable<string> {
    // Сначала загружаем переводы
    return this.aiContextService.init(language).pipe(
      switchMap(() => {
    const systemPrompt = this.getSystemPrompt(language);
        return this.callGroqAPI(userInput, systemPrompt);
      })
    );
  }

  /**
   * Вызывает Groq API
   */
  private callGroqAPI(userInput: string, systemPrompt: string): Observable<string> {
    const apiKey = GROQ_API_KEY.trim();
    if (!apiKey) {
      return of('Error: Groq API key is not configured. Please get a free key at https://console.groq.com/keys');
    }

    const body = {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userInput }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1
    };

    return new Observable<string>((observer) => {
      fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
      })
        .then(response => {
    if (!response.ok) {
            return response.json().then(errorData => {
        if (errorData?.error?.message) {
                throw new Error(`Groq request failed: ${errorData.error.message}`);
        }
              throw new Error(`HTTP ${response.status}`);
            }).catch(() => {
              throw new Error(`HTTP ${response.status}`);
            });
        }
          return response.json();
        })
        .then(data => {
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
            observer.error(new Error('Groq response is missing assistant content.'));
            return;
    }
          observer.next(content.trim());
          observer.complete();
        })
        .catch(error => {
          observer.error(error);
        });
    });
  }
}

