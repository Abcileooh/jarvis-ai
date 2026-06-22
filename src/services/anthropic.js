// src/services/anthropic.js
import Constants from 'expo-constants';
import { SYSTEM_PROMPT } from '../constants/theme';

const API_KEY = Constants.expoConfig?.extra?.ANTHROPIC_API_KEY || '';

export async function sendMessage(messages) {
  if (!API_KEY || API_KEY === 'BURAYA_API_ANAHTARINIZI_YAZIN') {
    throw new Error('API anahtarı ayarlanmamış. app.json dosyasını güncelleyin.');
  }

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content?.map((b) => b.text || '').join('') || '';
}
