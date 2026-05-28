import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AIContextService {
  private translations: Record<string, any> = {};
  private isLoading = false;

  constructor(private http: HttpClient) {}

  /**
   * Загружает переводы для указанного языка
   */
  private loadTranslations(language: string): Observable<any> {
    if (this.translations[language]) {
      return of(this.translations[language]);
    }

    if (this.isLoading) {
      return of(null);
    }

    this.isLoading = true;
    return this.http.get<any>(`/assets/i18n/${language}.json`).pipe(
      map(data => {
        this.translations[language] = data;
        this.isLoading = false;
        return data;
      }),
      catchError(() => {
        this.isLoading = false;
        return of(null);
      })
    );
  }

  /**
   * Получает переводы для указанного языка
   */
  private getTranslations(language: string): any {
    return this.translations[language] || {};
  }

  /**
   * Инициализирует сервис загрузкой переводов
   */
  init(language: string = 'en'): Observable<boolean> {
    return this.loadTranslations(language).pipe(
      map(data => !!data)
    );
  }

  /**
   * Генерирует оптимизированный контекст для LLM
   * Использует только важные секции, избегая UI текстов (кнопки, labels, placeholders)
   */
  getContext(language: string = 'en'): string {
    const t = this.getTranslations(language);
    const lines: string[] = [];

    // Компания
    lines.push('DDC KZ - Company Information');
    lines.push('==============================');
    lines.push('');

    // Главная информация
    if (t.home?.description) {
      lines.push('DESCRIPTION:');
      lines.push(t.home.description);
      lines.push('');
    }

    // Миссия
    if (t.home?.mission) {
      lines.push('MISSION:');
      lines.push(t.home.mission);
      lines.push('');
    }

    // Проекты
    if (t.projects) {
      lines.push('PROJECTS:');
      lines.push(`${t.projects.subtitle}`);
      lines.push('');
      
      const project1 = t.projects.project1;
      const project2 = t.projects.project2;
      const project3 = t.projects.project3;
      
      if (project1) {
        lines.push(`- ${project1.name}: ${project1.description}`);
      }
      if (project2) {
        lines.push(`- ${project2.name}: ${project2.description}`);
      }
      if (project3) {
        lines.push(`- ${project3.name}: ${project3.description}`);
      }
      lines.push('');
    }

    // Услуги - только важные данные
    if (t.services?.services) {
      lines.push('SERVICES:');
      const services = t.services.services;
      
      // Flatten structure для лучшего понимания LLM
      Object.entries(services).forEach(([key, service]: [string, any]) => {
        lines.push(`- ${service.title}: ${service.description}`);
        if (service.features && Array.isArray(service.features)) {
          lines.push(`  Features: ${service.features.join(', ')}`);
        }
      });
      lines.push('');
    }

    // Главная - возможности
    if (t.home?.features) {
      lines.push('KEY FEATURES:');
      const features = t.home.features;
      for (let i = 1; i <= 5; i++) {
        const title = features[`title${i}`];
        const desc = features[`desc${i}`];
        if (title && desc) {
          lines.push(`- ${title}: ${desc}`);
        }
      }
      lines.push('');
    }

    // Руководство - Совет директоров
    if (t.directorsBoard?.directors) {
      lines.push('BOARD OF DIRECTORS:');
      Object.entries(t.directorsBoard.directors).forEach(([key, director]: [string, any]) => {
        lines.push(`- ${director.name}: ${director.position.replace('<br>', ' ')}`);
      });
      lines.push('');
    }

    // Правление
    if (t.ceo?.ceoBorders) {
      lines.push('EXECUTIVE BOARD:');
      Object.entries(t.ceo.ceoBorders).forEach(([key, ceo]: [string, any]) => {
        lines.push(`- ${ceo.name}: ${ceo.position.replace('<br>', ' ')}`);
      });
      lines.push('');
    }

    // Основной CEO
    if (t.ceo?.mainCeo) {
      lines.push('CEO:');
      lines.push(`${t.ceo.mainCeo.name} - ${t.ceo.mainCeo.position.replace('<br>', ' ')}`);
      lines.push('');
    }

    // Контакты
    if (t.contacts?.info) {
      lines.push('CONTACT INFORMATION:');
      const info = t.contacts.info;
      
      if (info.address?.text) {
        lines.push(`Address (Astana): ${info.address.text}`);
      }
      if (info.address_almaty?.text) {
        lines.push(`Address (Almaty): ${info.address_almaty.text}`);
      }
      if (info.email?.text) {
        lines.push(`Email: ${info.email.text}`);
      }
      if (info.phone?.text) {
        lines.push(`Phone: ${info.phone.text}`);
      }
      if (info.hours?.text) {
        lines.push(`Working Hours: ${info.hours.text.replace('\n', ', ')}`);
      }
      if (info.social?.instagram) {
        lines.push(`Instagram: ${info.social.instagram}`);
      }
      lines.push('');
    }

    // Достижения
    if (t.achievements) {
      lines.push('ACHIEVEMENTS:');
      lines.push(`${t.achievements.subtitle}`);
      lines.push('');
    }

    // Ценности компании
    if (t.home?.center) {
      lines.push('COMPANY VALUES:');
      const center = t.home.center;
      Object.entries(center).forEach(([key, value]: [string, any]) => {
        lines.push(`- ${value.name}: ${value.desc}`);
      });
      lines.push('');
    }

    // Footer информация
    if (t.footer) {
      lines.push('FOOTER INFORMATION:');
      lines.push(`About: ${t.footer.aboutus}`);
      lines.push(`Privacy Policy: Available`);
      lines.push(`Terms of Service: Available`);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Генерирует системный промпт для AI ассистента
   */
  getSystemPrompt(language: string = 'en'): string {
    const context = this.getContext(language);
    const isRu = language === 'ru';
    const isKk = language === 'kk';

    if (isRu) {
      const prompt = `
${context}

ВАЖНЫЕ ИНСТРУКЦИИ:
- ТЫ - ИСКЛЮЧИТЕЛЬНО ТЕКСТОВЫЙ КОНСУЛЬТАНТ DDC KZ
- НИКОГДА НЕ генерируй HTML, CSS, JavaScript или код
- ОТВЕЧАЙ ТОЛЬКО текстом на русском языке
- НЕ создавай веб-страницы, формы или интерактивные элементы

ПРИ ОТВЕТАХ:
- Используй только информацию из предоставленного контекста
- Если не знаешь ответа - признай это открыто
- Не выдумывай информацию, которой нет в контексте
- Будь профессиональным, вежливым и полезным

ПОМНИ: Твоя задача - отвечать текстом, а не создавать веб-контент.
`;
      return prompt;
    } else if (isKk) {
      const prompt = `
${context}

МАҢЫЗДЫ НҰСҚАУЛАР:
- СІЗ - DDC KZ МӘТІНДІК КЕҢЕСШІсі
- ЕШҚАШАН HTML, CSS, JavaScript немесе код жасамаңыз
- ҚАЗАҚ ТІЛІНДЕ ҒANA МӘТІНМЕН ЖАУАП БЕРІҢІЗ
- Веб-беттер, формалар немесе интерактивті элементтер жасамаңыз

ЖАУАП БЕРГЕНДЕ:
- Тек берілген контексттегі ақпаратты қолданыңыз
- Егер жауапты білмесеңіз, ашық мойындаңыз
- Контекстте жоқ ақпаратты ойлап таңбаңыз
- Кәсіби, сыпайы және пайдалы болыңыз

ЕСТЕ САҚТАҢЫЗ: Сіздің міндетіңіз - мәтінмен жауап беру, веб-мазмұн жасау емес.
`;
      return prompt;
    } else {
      const prompt = `
${context}

IMPORTANT INSTRUCTIONS:
- YOU ARE A TEXT-ONLY CONSULTANT FOR DDC KZ
- NEVER generate HTML, CSS, JavaScript or code
- ANSWER ONLY in text in English language
- DO NOT create web pages, forms or interactive elements

WHEN ANSWERING:
- Use only information from the provided context
- If you don't know the answer - admit it openly
- Do not make up information that is not in the context
- Be professional, polite and helpful

REMEMBER: Your task is to answer with text, not to create web content.
`;
      return prompt;
    }
  }

  /**
   * Получает краткий контекст для быстрых ответов
   */
  getShortContext(language: string = 'en'): string {
    const t = this.getTranslations(language);
    const lines: string[] = [];

    lines.push('DDC KZ - Short Summary');
    lines.push('======================');
    lines.push('');
    
    if (t.home?.description) {
      lines.push(t.home.description);
      lines.push('');
    }

    // Проекты
    if (t.projects) {
      lines.push('Projects:');
      const p1 = t.projects.project1?.name;
      const p2 = t.projects.project2?.name;
      const p3 = t.projects.project3?.name;
      lines.push([p1, p2, p3].filter(Boolean).join(', '));
      lines.push('');
    }

    // Только основные услуги
    if (t.services?.services) {
      lines.push('Services:');
      const services = Object.values(t.services.services);
      lines.push(services.map((s: any) => s.title).join(', '));
      lines.push('');
    }

    // Контакты
    if (t.contacts?.info) {
      const info = t.contacts.info;
      lines.push('Contact:');
      if (info.email?.text) lines.push(`Email: ${info.email.text}`);
      if (info.phone?.text) lines.push(`Phone: ${info.phone.text}`);
    }

    return lines.join('\n');
  }
}
