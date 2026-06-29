import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor(private http: HttpClient) { }

  askAI(message: string, lang: string): Observable<string> {
    const cleanMessage = message?.trim();

    if (!cleanMessage) {
      return of('Введите вопрос.');
    }

    // const apiUrl = environment.production
    //   ? '/api/chat'
    //   : 'http://localhost:9999/chat';
    const apiUrl = '/api/chat';

    return this.http.post<{ reply?: string; error?: string }>(apiUrl, {
      message: cleanMessage,
      lang
    }).pipe(
      map(res => res?.reply || 'Пустой ответ от AI.'),
      catchError(error => {
        console.error('AI Service Error:', error);
        return of('Ошибка при обращении к AI. Пожалуйста, попробуйте позже.');
      })
    );
  }
}