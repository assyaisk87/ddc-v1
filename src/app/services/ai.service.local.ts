import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  Translation,
  getLangCode,
  createContext,
  generateSystemPrompt,
  getDefaultReply,
  DEFAULT_GROQ_PARAMS
} from '../../../shared/ai-context-helper';

@Injectable({
  providedIn: 'root'
})
export class LocalAiService {

  private translations: Record<string, Translation> = {};
  private loading = false;

  constructor(
    private http: HttpClient
  ) {}

  private loadTranslation(lang: string): Observable<Translation> {
    if (this.translations[lang]) {
      return of(this.translations[lang]);
    }

    if (this.loading) {
      return of({});
    }

    this.loading = true;
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`).pipe(
      map(data => {
        this.translations[lang] = data;
        this.loading = false;
        return data;
      }),
      catchError(error => {
        console.error(`Failed to load translations for ${lang}:`, error);
        this.loading = false;
        return of({});
      })
    );
  }

  async answer(question: string, lang: string): Promise<string> {
    const langCode = getLangCode(lang);
    // Загружаем переводы
    const t = await this.loadTranslation(langCode).toPromise();

    // Если не загрузились, пробуем русский
    const finalT = t && Object.keys(t).length > 0 ? t : await this.loadTranslation('ru').toPromise();

    // Диагностика
    console.log('LocalAiService - Language:', langCode);
    console.log('LocalAiService - Translations loaded:', !!finalT);
    console.log('LocalAiService - CEO:', finalT?.ceo?.mainCeo);
    console.log('LocalAiService - Mission:', finalT?.home?.mission);
    console.log('LocalAiService - Projects:', finalT?.projects);

    if (!finalT || Object.keys(finalT).length === 0) {
      console.warn('LocalAiService - Translations not loaded for:', langCode);
      return 'Переводы не загружены. Пожалуйста, обновите страницу.';
    }

    // Формируем контекст (используем общий хелпер)
    const context = createContext(finalT);
    console.log('Context length:', context.length);

    // Генерируем system prompt (используем общий хелпер)
    const systemPrompt = generateSystemPrompt(context, langCode);
    console.log('System Prompt ', systemPrompt);
    // Получаем API ключ из localStorage (или из переменной окружения)
    const apiKey = localStorage.getItem('GROQ_API_KEY') || ''; // Или использовать переменную окружения

    if (!apiKey) {
      console.warn('GROQ_API_KEY not found. Please set it in localStorage.');
      return 'API ключ Groq не найден. Пожалуйста, установите его в localStorage.';
    }

    // Делаем запрос к Groq API
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question },
          ],
          ...DEFAULT_GROQ_PARAMS
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Groq API error:', errorData);
        throw new Error(errorData.error?.message || 'Groq API error');
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || getDefaultReply(langCode);
      console.log('Response generated successfully');
      return reply;
    } catch (error) {
      console.error('Error calling Groq API:', error);
      return 'Ошибка при обращении к AI. Пожалуйста, попробуйте позже.';
    }
  }
}