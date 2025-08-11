import { inicializarFormulario } from "./components/formPergunta.js";
import { inicializarAcoesResposta, mostrarResposta } from "./components/resultadoIA.js";
import { sendQuestion } from "./services/api.js";
import { salvarItem, lerItem } from "./services/storage.js";

/* === Configurações UI (Task 6) === */
function inicializarConfig() {
  const STORAGE_KEY_API = 'koru_apiKey';
  const STORAGE_KEY_MODEL = 'koru_model';

  // Se não existir modelo salvo, salva o padrão
  if (!localStorage.getItem(STORAGE_KEY_MODEL)) {
    localStorage.setItem(STORAGE_KEY_MODEL, 'gemini-2.0-flash');
  }

  const form = document.getElementById('configForm');
  const apiInput = document.getElementById('apiKey');
  const modeloSelect = document.getElementById('modeloIA');
  const descricaoModelo = document.getElementById('descricaoModelo');

  let chaveReal = null; // armazena chave original

  function maskKey(k) {
    if (!k) return '';
    if (k.length <= 8) return k.replace(/.(?=.{4})/g, '*');
    return `${k.slice(0,4)}****${k.slice(-4)}`;
  }

  const descricoes = {
    'gpt-3.5': 'GPT-3.5: modelo da OpenAI, balanceado entre velocidade e qualidade.',
    'gemini-2.0-flash': 'Gemini 2.0 Flash: modelo Google rápido e leve, bom para respostas rápidas e econômicas.'
};

  function atualizarDescricao() {
    const modeloAtual = modeloSelect.value;
    descricaoModelo.textContent = descricoes[modeloAtual] || 'Descrição não disponível.';
  }

  // Carrega valores salvos
  const savedKey = localStorage.getItem(STORAGE_KEY_API);
  const savedModel = localStorage.getItem(STORAGE_KEY_MODEL);

  if (savedKey) {
    chaveReal = savedKey;               // guarda a chave original na variável
    apiInput.value = maskKey(savedKey); // mostra mascarado no input
  }

  modeloSelect.value = savedModel;
  atualizarDescricao();

  modeloSelect.addEventListener('change', atualizarDescricao);

  apiInput.addEventListener('focus', () => {
    if (chaveReal) {
      apiInput.value = chaveReal; // mostra chave real ao focar
    }
  });

  apiInput.addEventListener('blur', () => {
    const val = apiInput.value.trim();
    if (val) {
      apiInput.value = maskKey(val);
      chaveReal = val; // atualiza chave real com o que está no input ao desfocar
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!chaveReal) {
      alert('Por favor, cole sua API Key antes de salvar.');
      return;
    }
    salvarItem(STORAGE_KEY_API, chaveReal);
    salvarItem(STORAGE_KEY_MODEL, modeloSelect.value);
    apiInput.value = maskKey(chaveReal);
    alert('Configurações salvas!');
  });
}

/* === Inicialização da página === */
inicializarConfig();              // 1) configurações
inicializarFormulario(sendQuestion); // 2) formulário de pergunta (usa sendQuestion)
inicializarAcoesResposta();       
mostrarResposta("Sua resposta será exibida aqui");
