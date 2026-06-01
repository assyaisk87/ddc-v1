import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, from } from 'rxjs';
import { environment } from '../../environments/environment';
import { LocalAiService } from './ai.service.local';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor(private http: HttpClient,
    private localAi: LocalAiService
  ) {}

  askAI(message: string, lang: string): Observable<string> {
    // В production используем Netlify Function
    // В development используем LocalAiService
    if (!environment.production) {
      // Local development - используем LocalAiService
      console.log('Local mode: Using LocalAiService with lang:', lang);
   return from(this.localAi.answer(message, lang));
    } else {
      // Production - используем Netlify Function
      const apiUrl = '/api/chat';
      console.log('Production mode: Using Netlify Function with lang:', lang);
    return this.http.post<any>(apiUrl, {
    message,
    lang
  }).pipe(
      map(res => res?.reply || 'Пустой ответ'),
      catchError(error => {
        console.error('AI Service Error:', error);

        // Если ошибка 404 (локальная разработка без Netlify Dev)
        // можно добавить fallback сообщение
        if (error.status === 404) {
          return of('⚠️ Для работы AI ассистента нужно развернуть приложение на Netlify или запустить через `netlify dev`. Локально функции Netlify не работают.');
        }

        throw error;
      })
    );
  }
}
}

