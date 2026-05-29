import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  constructor(private http: HttpClient) {}

  askAI(message: string): Observable<string> {
    // В production используем Netlify Function
    // В development можно добавить fallback
    const apiUrl = environment.production ? '/api/chat' : '/api/chat';
    return this.http.post<any>(apiUrl, {
      message
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

