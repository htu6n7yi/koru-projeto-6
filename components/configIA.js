import { salvarItem, lerItem } from '../services/storage.js';

const STORAGE_KEY_API = 'koru_apiKey';
const STORAGE_KEY_MODEL = 'koru_model';

const MODELOS = {
  'gpt-3.5': 'GPT-3.5 — bom custo/benefício para a maioria das tarefas.',
  'gpt-4o': 'GPT-4o — respostas mais detalhadas e melhores raciocínios.',
  'gemini-2.0-flash': 'Gemini 2.0 Flash — modelo do Google, forte em contexto e textos longos.'
};

export function renderConfigIA(targetSelector = '#config-root') {
  const target = document.querySelector(targetSelector) || document.body;
  const container = document.createElement('div');
  container.className = 'config-ia card'; // mantém possibilidade de estilos já existentes

  container.innerHTML = `
    <h3>🔧 Configurações</h3>

    <label for="apiKeyInput" class="sr-only">API Key</label>
    <input id="apiKeyInput" type="text" placeholder="Cole sua API Key aqui" aria-label="API Key">

    <label for="modeloSelect" class="sr-only">Modelo de IA</label>
    <select id="modeloSelect" aria-label="Selecione o modelo de IA">
      ${Object.keys(MODELOS).map(k => `<option value="${k}">${k}</option>`).join('')}
    </select>

    <p id="descricaoModelo" class="descricao-modelo" aria-live="polite"></p>

    <div class="actions">
      <button id="salvarConfig" class="btn-primary">Salvar</button>
      <button id="limparConfig" class="btn-secondary">Limpar</button>
    </div>

    <p id="msgConfig" role="status" aria-live="polite" class="msg-config"></p>
  `;

  target.appendChild(container);

  const apiInput = container.querySelector('#apiKeyInput');
  const modeloSelect = container.querySelector('#modeloSelect');
  const descricao = container.querySelector('#descricaoModelo');
  const msg = container.querySelector('#msgConfig');

  // Carregar valores salvos
  const savedKey = lerItem(STORAGE_KEY_API);
  const savedModel = lerItem(STORAGE_KEY_MODEL) || 'gpt-3.5';
  if (savedKey) apiInput.value = maskKeyForUI(savedKey);
  modeloSelect.value = savedModel;
  atualizarDescricao(savedModel);

  // Mudança de modelo
  modeloSelect.addEventListener('change', (e) => {
    atualizarDescricao(e.target.value);
  });

  // Salvar (validação simples)
  container.querySelector('#salvarConfig').addEventListener('click', () => {
    const rawKey = apiInput.value.trim();
    if (!rawKey) {
      setMessage('Por favor, cole sua API Key antes de salvar.', true);
      return;
    }
    // Se o campo estiver mascarado (ex: ****), assumimos que é a mesma key já salva.
    const keyToSave = rawKey.includes('****') ? lerItem(STORAGE_KEY_API) : rawKey;

    try {
      salvarItem(STORAGE_KEY_API, keyToSave);
      salvarItem(STORAGE_KEY_MODEL, modeloSelect.value);
      setMessage('Configurações salvas com sucesso!', false);
    } catch (err) {
      setMessage('Erro ao salvar configurações. Veja o console.', true);
      console.error(err);
    }
  });

  // Limpar configs
  container.querySelector('#limparConfig').addEventListener('click', () => {
    salvarItem(STORAGE_KEY_API, '');
    salvarItem(STORAGE_KEY_MODEL, '');
    apiInput.value = '';
    modeloSelect.value = 'gpt-3.5';
    atualizarDescricao('gpt-3.5');
    setMessage('Configurações limpas.', false);
  });

  // Ao focar no input, mostrar a chave real se existir (opcional)
  apiInput.addEventListener('focus', () => {
    const real = lerItem(STORAGE_KEY_API);
    if (real) apiInput.value = real;
  });
  apiInput.addEventListener('blur', () => {
    const val = apiInput.value.trim();
    if (val) apiInput.value = maskKeyForUI(val);
  });

  function atualizarDescricao(mod) {
    descricao.textContent = MODELOS[mod] || '';
  }

  function setMessage(text, isError = false) {
    msg.textContent = text;
    msg.style.color = isError ? 'crimson' : 'green';
    setTimeout(() => { msg.textContent = ''; }, 3500);
  }

  function maskKeyForUI(key) {
    if (!key) return '';
    if (key.length <= 8) return key.replace(/.(?=.{4})/g, '*');
    return `${key.slice(0,4)}****${key.slice(-4)}`;
  }

  return container;
}
