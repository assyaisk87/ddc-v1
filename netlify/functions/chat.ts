import { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';

// Define translation interface
interface Translation {
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
}

export const handler: Handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const { message, lang } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Load JSON data files
    const basePath = path.join(process.cwd(), 'public/assets/i18n');
    const langCode = lang === 'kk' ? 'kk' : lang === 'en' ? 'en' : 'ru'; // Default to Russian
    
    let translations: Record<string, Translation> = {};
    try {
      const ruPath = path.join(basePath, 'ru.json');
      const kkPath = path.join(basePath, 'kk.json');
      const enPath = path.join(basePath, 'en.json');
      
      if (fs.existsSync(ruPath)) {
        translations['ru'] = JSON.parse(fs.readFileSync(ruPath, 'utf-8')) as Translation;
      }
      if (fs.existsSync(kkPath)) {
        translations['kk'] = JSON.parse(fs.readFileSync(kkPath, 'utf-8')) as Translation;
      }
      if (fs.existsSync(enPath)) {
        translations['en'] = JSON.parse(fs.readFileSync(enPath, 'utf-8')) as Translation;
      }
    } catch (err) {
      console.error('Error loading JSON files:', err);
    }

    const t = translations[langCode] || translations['ru'] || {};

    // Generate context (same logic as AIContextService)
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
      lines.push(`${t.projects.subtitle || ''}`);
      lines.push('');
      const project1 = t.projects.project1;
      const project2 = t.projects.project2;
      const project3 = t.projects.project3;
      if (project1) {
        lines.push(`- ${project1.name || ''}: ${project1.description || ''}`);
      }
      if (project2) {
        lines.push(`- ${project2.name || ''}: ${project2.description || ''}`);
      }
      if (project3) {
        lines.push(`- ${project3.name || ''}: ${project3.description || ''}`);
      }
      lines.push('');
    }
    
    // Услуги
    if (t.services?.services) {
      lines.push('SERVICES:');
      const services = t.services.services;
      Object.entries(services).forEach(([key, service]: [string, any]) => {
        lines.push(`- ${service.title || ''}: ${service.description || ''}`);
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
        lines.push(`- ${director.name || ''}: ${director.position?.replace('<br>', ' ') || ''}`);
      });
      lines.push('');
    }
    
    // Правление
    if (t.ceo?.ceoBorders) {
      lines.push('EXECUTIVE BOARD:');
      Object.entries(t.ceo.ceoBorders).forEach(([key, ceo]: [string, any]) => {
        lines.push(`- ${ceo.name || ''}: ${ceo.position?.replace('<br>', ' ') || ''}`);
      });
      lines.push('');
    }
    
    // Основной CEO
    if (t.ceo?.mainCeo) {
      lines.push('CEO:');
      lines.push(`${t.ceo.mainCeo.name || ''} - ${t.ceo.mainCeo.position?.replace('<br>', ' ') || ''}`);
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
      lines.push(`${t.achievements.subtitle || ''}`);
      lines.push('');
    }
    
    // Ценности компании
    if (t.home?.center) {
      lines.push('COMPANY VALUES:');
      const center = t.home.center;
      Object.entries(center).forEach(([key, value]: [string, any]) => {
        lines.push(`- ${value.name || ''}: ${value.desc || ''}`);
      });
      lines.push('');
    }
    
    const context = lines.join('\n');

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env['GROQ_API_KEY'],
    });

    // Generate system prompt (same as AIContextService)
    const isRu = langCode === 'ru';
    const isKk = langCode === 'kk';
    
    let systemPrompt = '';
    
    if (isRu) {
      systemPrompt = `
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
    } else if (isKk) {
      systemPrompt = `
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
    } else {
      systemPrompt = `
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
    }

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
    });

    const reply = chatCompletion.choices[0]?.message?.content || (isRu 
      ? 'Извините, я не могу ответить на этот вопрос. Пожалуйста, свяжитесь с нами через контактную информацию.'
      : isKk 
        ? 'Кешіріңіз, мен осы сұраққа жауап бере алмадым. Бізбен байланыс ақпараты арқылы хабарласыңыз.'
        : 'Sorry, I cannot answer this question. Please contact us through the contact information.');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error('Error in chat function:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};
