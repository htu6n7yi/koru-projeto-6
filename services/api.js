// services/api.js
import { lerItem } from './storage.js';

// chave/storage names
const STORAGE_KEY_API = 'koru_apiKey';
const STORAGE_KEY_MODEL = 'koru_model';

// modelo padrão (quando nada estiver salvo)
const DEFAULT_MODEL = 'gemini-2.0-flash';

/**
 * Gera a URL do endpoint conforme o modelo escolhido.
 */
function getApiUrl(model = DEFAULT_MODEL) {
  if (model.startsWith('gemini')) {
    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  } else if (model === 'gpt-3.5') {
    return 'https://api.openai.com/v1/chat/completions';
  }
  throw new Error('Modelo não suportado no front-end.');

}

function getApiKeyOrThrow() {
  const key = lerItem(STORAGE_KEY_API);
  if (!key) {
    throw new Error('API Key não configurada. Vá em Configurações e cole sua API Key.');
  }
  return key;
}


/**
 * Envia a pergunta para a API adequada conforme o modelo selecionado.
 * Retorna a resposta ou uma mensagem de erro amigável.
 */
export async function sendQuestion(question) {
  try {
    const apiKey = getApiKeyOrThrow();
    const model = lerItem(STORAGE_KEY_MODEL) || DEFAULT_MODEL;
    const apiUrl = getApiUrl(model);

    let response;

    if (model.startsWith('gemini')) {
      // Requisição para API Gemini
      response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: question }
              ]
            }
          ]
        })
      });
    } else if (model === 'gpt-3.5') {
      // Requisição para API OpenAI GPT-3.5
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: question }]
        })
      });
    } else {
      throw new Error('Modelo não suportado no front-end.');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Erro na API: ${response.status} - ${text}`);
    }

    const data = await response.json();

    if (model.startsWith('gemini')) {
      return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Resposta não encontrada';
    } else if (model === 'gpt-3.5') {
      return data?.choices?.[0]?.message?.content || 'Resposta não encontrada';
    }

  } catch (erro) {
    console.error('Erro ao enviar pergunta: ', erro);

    // Detecta se é erro de chave ou modelo
    if (erro.message.includes('API_KEY_INVALID') || erro.message.includes('API key not valid')) {
      return 'Chave da API inválida. Vá em Configurações e cole a chave correta.';
    }

    if (erro.message.includes('Modelo não suportado')) {
      return 'O modelo selecionado não é suportado. Verifique as configurações.';
    }

    if (erro.message.includes('400')) {
      return 'Erro de requisição (400). Verifique se a chave e o modelo estão corretos.';
    }

    return 'Erro na requisição. Verifique se a API Key e o modelo estão configurados.';
  }

}
