import { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  Translation,
  getLangCode,
  createContext,
  generateSystemPrompt,
  getDefaultReply,
  DEFAULT_GROQ_PARAMS
} from '../../shared/ai-context-helper';

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
    const langCode = getLangCode(lang);

    console.log('=== AI Chat Function Debug ===');
    console.log('Language:', langCode);
    console.log('cwd:', process.cwd());
    console.log('basePath:', basePath);
    console.log('Question:', message);

    let translations: Record<string, Translation> = {};
    try {
      const ruPath = path.join(basePath, 'ru.json');
      const kkPath = path.join(basePath, 'kk.json');
      const enPath = path.join(basePath, 'en.json');
      console.log('ru exists:', fs.existsSync(ruPath));
      console.log('kk exists:', fs.existsSync(kkPath));
      console.log('en exists:', fs.existsSync(enPath));

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

    // Диагностика загруженных данных
    console.log('Mission:', t.home?.mission);
    console.log('Projects:', t.projects);
    console.log('CEO:', t.ceo?.mainCeo);
    console.log('Contacts:', t.contacts?.info);
    console.log('Context length before:', 0);

    // Формируем контекст (используем общий хелпер)
    const context = createContext(t);

    console.log('Context length:', context.length);

    // Генерируем system prompt (используем общий хелпер)
    const systemPrompt = generateSystemPrompt(context, langCode);

    // Initialize Groq client
    const groq = new Groq({
      apiKey: process.env['GROQ_API_KEY'],
    });

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      ...DEFAULT_GROQ_PARAMS
    });

    const reply = chatCompletion.choices[0]?.message?.content || getDefaultReply(langCode);

    console.log('Response generated successfully');

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

