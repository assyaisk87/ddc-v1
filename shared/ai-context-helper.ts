/**
 * AI Context Helper
 * 
 * Общий модуль для формирования AI контекста и промптов.
 * Используется как в LocalAiService (браузер), так и в Netlify функции (Node.js)
 */

export interface Translation {
  home?: {
    description?: string;
    mission?: string;
    features?: {
      title1?: string;
      title2?: string;
      title3?: string;
      title4?: string;
      title5?: string;
      desc1?: string;
      desc2?: string;
      desc3?: string;
      desc4?: string;
      desc5?: string;
    };
    center?: Record<string, { name?: string; desc?: string }>;
  };
  projects?: {
    subtitle?: string;
    project1?: { name?: string; description?: string };
    project2?: { name?: string; description?: string };
    project3?: { name?: string; description?: string };
  };
  services?: {
    services?: Record<string, {
      title?: string;
      description?: string;
      features?: string[];
    }>;
  };
  directorsBoard?: {
    directors?: Record<string, { name?: string; position?: string }>;
  };
  ceo?: {
    mainCeo?: { name?: string; position?: string };
    ceoBorders?: Record<string, { name?: string; position?: string }>;
  };
  contacts?: {
    info?: {
      address?: { text?: string };
      address_almaty?: { text?: string };
      email?: { text?: string };
      phone?: { text?: string };
      hours?: { text?: string };
      social?: { instagram?: string };
    };
  };
  achievements?: {
    subtitle?: string;
  };
  [key: string]: any;
}

/**
 * Определяет код языка
 */
export function getLangCode(lang: string): string {
  return lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru';
}

/**
 * Формирует контекст из переводов
 */
export function createContext(t: Translation): string {
  return JSON.stringify(t, null, 2);
}

/**
 * Формирует system prompt на основе языка и контекста
 */
export function generateSystemPrompt(context: string, langCode: string): string {
  const isRu = langCode === 'ru';
  const isKk = langCode === 'kk';

  if (isRu) {
    return generateRussianPrompt(context);
  } else if (isKk) {
    return generateKazakhPrompt(context);
  } else {
    return generateEnglishPrompt(context);
  }
}

/**
 * Russian system prompt
 */
function generateRussianPrompt(context: string): string {
  return `
КОНТЕКСТ:
${context}

ПРАВИЛА:
1. Используй только информацию из контекста.
2. Если информации нет — отвечай: "Информация отсутствует в базе знаний DDC KZ."
3. Запрещено использовать собственные знания.
4. Запрещено делать предположения.
5. Запрещено придумывать факты.
6. Если вопрос частично выходит за рамки контекста — сообщи об этом.
7. ТЫ - ИСКЛЮЧИТЕЛЬНО ТЕКСТОВЫЙ КОНСУЛЬТАНТ DDC KZ
8. НИКОГДА НЕ генерируй HTML, CSS, JavaScript или код
9. ОТВЕЧАЙ ТОЛЬКО текстом на русском языке
10. НЕ создавай веб-страницы, формы или интерактивные элементы

ПРИ ОТВЕТАХ:
- Будь профессиональным, вежливым и полезным
- Если не знаешь ответа - признай это открыто
- Не выдумывай информацию, которой нет в контексте

ПОМНИ: Твоя задача - отвечать текстом, а не создавать веб-контент.
`;
}

/**
 * Kazakh system prompt
 */
function generateKazakhPrompt(context: string): string {
  return `
КОНТЕКСТ:
${context}

НҰСҚАУЛАР:
1. Тек контексттегі ақпаратты қолданыңыз.
2. Ақпарат болмаса: "DDC KZ білім базасында ақпарат жоқ." деп жауап беріңіз.
3. Өз біліміңізді қолдануға тыйым салынады.
4. Болжам жасауға тыйым салынады.
5. Фактілерді ойлап табуға тыйым салынады.
6. Егер сұрақ контексттен тыс болса - туралы хабарлаңыз.
7. СІЗ - DDC KZ МӘТІНДІК КЕҢЕСШІсі
8. ЕШҚАШАН HTML, CSS, JavaScript немесе код жасамаңыз
9. ҚАЗАҚ ТІЛІНДЕ ҒANA МӘТІНМЕН ЖАУАП БЕРІҢІЗ
10. Веб-беттер, формалар немесе интерактивті элементтер жасамаңыз

ЖАУАП БЕРГЕНДЕ:
- Кәсіби, сыпайы және пайдалы болыңыз
- Егер жауапты білмесеңіз, ашық мойындаңыз
- Контекстте жоқ ақпаратты ойлап таңбаңыз

ЕСТЕ САҚТАҢЫЗ: Сіздің міндетіңіз - мәтінмен жауап беру, веб-мазмұн жасау емес.
`;
}

/**
 * English system prompt
 */
function generateEnglishPrompt(context: string): string {
  return `
CONTEXT:
${context}

RULES:
1. Use only information from the context.
2. If information is missing - answer: "Information not found in DDC KZ knowledge base."
3. Forbidden to use your own knowledge.
4. Forbidden to make assumptions.
5. Forbidden to make up facts.
6. If the question partially goes beyond the context - report this.
7. YOU ARE A TEXT-ONLY CONSULTANT FOR DDC KZ
8. NEVER generate HTML, CSS, JavaScript or code
9. ANSWER ONLY in text in English language
10. DO NOT create web pages, forms or interactive elements

WHEN ANSWERING:
- Be professional, polite and helpful
- If you don't know the answer - admit it openly
- Do not make up information that is not in the context

REMEMBER: Your task is to answer with text, not to create web content.
`;
}

/**
 * Формирует ответ по умолчанию при ошибке
 */
export function getDefaultReply(langCode: string): string {
  const isRu = langCode === 'ru';
  const isKk = langCode === 'kk';

  if (isRu) {
    return 'Извините, я не могу ответить на этот вопрос. Пожалуйста, свяжитесь с нами через контактную информацию.';
  } else if (isKk) {
    return 'Кешіріңіз, мен осы сұраққа жауап бере алмадым. Бізбен байланыс ақпараты арқылы хабарласыңыз.';
  } else {
    return 'Sorry, I cannot answer this question. Please contact us through the contact information.';
  }
}

/**
 * Параметры для запроса к Groq API
 */
export interface GroqRequestParams {
  model: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
}

/**
 * Стандартные параметры для Groq API
 */
export const DEFAULT_GROQ_PARAMS: GroqRequestParams = {
  model: 'llama-3.3-70b-versatile',
  temperature: 0.1,
  max_tokens: 2000,
  top_p: 1,
};
