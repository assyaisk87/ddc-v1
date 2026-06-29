import { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';
import * as fs from 'fs';
import * as path from 'path';
import {
  Translation,
  getLangCode,
  createGeneralJsonContext,
  generateSystemPrompt,
  getDefaultReply,
  DEFAULT_GROQ_PARAMS
} from '../../shared/ai-context-helper';
import { createClient } from '@supabase/supabase-js';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message, lang } = JSON.parse(event.body || '{}');

    if (!message?.trim()) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    const langCode = getLangCode(lang);

    console.log('=== AI Chat Function Debug ===');
    console.log('lang:', langCode);
    console.log('cwd:', process.cwd());

    const dbContext = await loadDbContext(langCode);
    const jsonContext = loadJsonContext(langCode);

    const fullContext = mergeContext(dbContext, jsonContext);

    console.log('DB context length:', dbContext.length);
    console.log('JSON context length:', jsonContext.length);
    console.log('Full context length:', fullContext.length);
    console.log('Context preview:', fullContext.slice(0, 1000));

    if (!fullContext.trim()) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ reply: getDefaultReply(langCode) }),
      };
    }

    const groqApiKey = process.env['GROQ_API_KEY'];

    if (!groqApiKey) {
      console.error('GROQ_API_KEY is missing');

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'GROQ_API_KEY is missing' }),
      };
    }

    const systemPrompt = generateSystemPrompt(fullContext, langCode);

    const groq = new Groq({
      apiKey: groqApiKey,
    });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message.trim() },
      ],
      ...DEFAULT_GROQ_PARAMS
    });

    const reply = chatCompletion.choices[0]?.message?.content || getDefaultReply(langCode);

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

async function loadDbContext(lang: string): Promise<string> {
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase env variables are missing');
    return '';
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const [
    projects,
    team,
    achievements,
    vacancies,
    services,
    contentBlocks,
    stats,
    news
  ] = await Promise.all([
    supabase
      .from('projects')
      .select('slug, name, short_description, full_description, category, status, year, external_url, technologies, results, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(12),

    supabase
      .from('team_members')
      .select('member_key, full_name, position, biography, greeting, message_title, message_text, group_type, is_main, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(20),

    supabase
      .from('achievements')
      .select('slug, title, description, year, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(15),

    supabase
      .from('vacancies')
      .select('slug, title, city, experience, salary, category, company, about_company, about_vacancy, stack, tasks, requirements, advantages, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(10),

    supabase
      .from('services')
      .select('service_key, title, description, features, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(10),

    supabase
      .from('content_blocks')
      .select('page, block_key, title, description, data, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(20),

    supabase
      .from('stats')
      .select('stat_key, value, target, label, suffix, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(20),

    supabase
      .from('news')
      .select('slug, title, excerpt, content, published_date, tags, sort_order')
      .eq('lang', lang)
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(10),
  ]);

  logSupabaseError('projects', projects.error);
  logSupabaseError('team_members', team.error);
  logSupabaseError('achievements', achievements.error);
  logSupabaseError('vacancies', vacancies.error);
  logSupabaseError('services', services.error);
  logSupabaseError('content_blocks', contentBlocks.error);
  logSupabaseError('stats', stats.error);
  logSupabaseError('news', news.error);

  return `
АКТУАЛЬНЫЕ ДАННЫЕ ИЗ SUPABASE:

ПРОЕКТЫ:
${compactList(projects.data, [
    'name',
    'short_description',
    'full_description',
    'category',
    'status',
    'year',
    'external_url',
    'technologies',
    'results'
  ])}

КОМАНДА И РУКОВОДСТВО:
${compactList(team.data, [
    'full_name',
    'position',
    'biography',
    'greeting',
    'message_title',
    'message_text',
    'group_type',
    'is_main'
  ])}

ДОСТИЖЕНИЯ:
${compactList(achievements.data, [
    'title',
    'description',
    'year'
  ])}

ВАКАНСИИ:
${compactList(vacancies.data, [
    'title',
    'city',
    'experience',
    'salary',
    'category',
    'company',
    'about_company',
    'about_vacancy',
    'stack',
    'tasks',
    'requirements',
    'advantages'
  ])}

УСЛУГИ:
${compactList(services.data, [
    'title',
    'description',
    'features'
  ])}

ОБЩИЕ БЛОКИ:
${compactList(contentBlocks.data, [
    'page',
    'block_key',
    'title',
    'description',
    'data'
  ])}

СТАТИСТИКА:
${compactList(stats.data, [
    'stat_key',
    'value',
    'target',
    'label',
    'suffix'
  ])}

НОВОСТИ:
${compactList(news.data, [
    'title',
    'excerpt',
    'content',
    'published_date',
    'tags'
  ])}
`;
}

function loadJsonContext(lang: string): string {
  const translations = loadTranslations();
  const t = translations[lang] || translations['ru'];

  if (!t || Object.keys(t).length === 0) {
    console.warn('JSON translations are empty');
    return '';
  }

  return `
ОБЩИЕ СВЕДЕНИЯ ИЗ JSON:
Использовать для миссии, описания центра, структуры центра, контактов и адреса.

${createGeneralJsonContext(t)}
`;
}

function loadTranslations(): Record<string, Translation> {
  const basePath = findI18nPath();

  const result: Record<string, Translation> = {};

  for (const lang of ['ru', 'kk', 'en']) {
    const filePath = path.join(basePath, `${lang}.json`);

    try {
      console.log(`${lang}.json exists:`, fs.existsSync(filePath));

      if (fs.existsSync(filePath)) {
        result[lang] = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Translation;
      }
    } catch (error) {
      console.error(`Failed to load ${lang}.json`, error);
    }
  }

  return result;
}

function findI18nPath(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'public/assets/i18n'),
    path.join(process.cwd(), 'dist/ddc/browser/assets/i18n'),
    path.join(process.cwd(), 'dist/browser/assets/i18n'),
    path.join(process.cwd(), 'assets/i18n'),
  ];

  const found = possiblePaths.find(p => fs.existsSync(path.join(p, 'ru.json')));

  if (!found) {
    console.error('i18n path not found. Checked:', possiblePaths);
    return possiblePaths[0];
  }

  console.log('i18n path found:', found);
  return found;
}

function mergeContext(dbContext: string, jsonContext: string): string {
  return `
ПРИОРИТЕТ ИСТОЧНИКОВ:
1. Для проектов, команды, достижений, вакансий и услуг используй Supabase.
2. Для миссии, описания центра, главной страницы, контактов и адреса используй JSON, если этих данных нет в Supabase.
3. Если данные есть хотя бы в одном источнике, не отвечай "информация отсутствует".
4. Если информации нет ни в Supabase, ни в JSON — только тогда скажи, что информации нет в базе знаний DDC KZ.

${dbContext}

${jsonContext}
`;
}
function logSupabaseError(table: string, error: any): void {
  if (error) {
    console.error(`Supabase table "${table}" error:`, error);
  }
}

function compactList(items: any[] | null, fields: string[]): string {
  if (!items || items.length === 0) {
    return 'Нет данных.';
  }

  return items
    .map((item, index) => {
      const lines = fields
        .map(field => {
          const value = item?.[field];

          if (value === null || value === undefined || value === '') {
            return '';
          }

          return `${field}: ${truncate(normalizeValue(value), 500)}`;
        })
        .filter(Boolean)
        .join('\n');

      return `${index + 1}. ${lines}`;
    })
    .join('\n\n');
}

function normalizeValue(value: any): string {
  if (Array.isArray(value)) {
    return value
      .map(v => typeof v === 'object' ? JSON.stringify(v) : String(v))
      .join(', ');
  }

  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
}

function truncate(text: string, maxLength: number): string {
  if (!text) return '';

  return text.length > maxLength
    ? text.slice(0, maxLength) + '...'
    : text;
}