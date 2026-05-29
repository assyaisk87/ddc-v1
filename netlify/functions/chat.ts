import { Handler } from '@netlify/functions';
import Groq from 'groq-sdk';

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
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Initialize Groq client with API key from environment variable
    const groq = new Groq({
      apiKey: process.env['GROQ_API_KEY'],
    });

    // Get system prompt based on language (default to Russian)
    const systemPrompt = `
      Ты — AI-ассистент компании DDC KZ (Digital Development Center).
      Компания специализируется на финтех-решениях, цифровизации банковского сектора и инновациях.
      
      Твоя задача:
      - Отвечать на вопросы о компании, проектах, технологиях и возможностях партнерства
      - Быть профессиональным, дружелюбным и информативным
      - Отвечать на том же языке, на котором задан вопрос
      - Если не знаешь ответа — предложи связаться через контакты      
    `;

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

    const reply = chatCompletion.choices[0]?.message?.content || 'Извините, я не могу ответить на этот вопрос.';

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
