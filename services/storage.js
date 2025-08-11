const STORAGE_KEY = "historicoIA";

// Salva pergunta e resposta, adicionando favorito=false ao criar
export function salvarConversa(pergunta, resposta) {
  const historico = carregarHistorico();
  historico.push({ pergunta, resposta, favorito: false, data: new Date().toLocaleString() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
}

export function carregarHistorico() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function atualizarFavorito(index, valor) {
  const historico = carregarHistorico();
  if (historico[index]) {
    historico[index].favorito = valor;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(historico));
  }
}

export function limparHistorico() {
  localStorage.removeItem(STORAGE_KEY);
}

const CONFIG_API_KEY = 'koru_apiKey';
const CONFIG_MODEL = 'koru_model';

export function salvarItem(chave, valor) {
  try {
    localStorage.setItem(chave, valor ?? '');
  } catch (err) {
    console.error('Erro ao salvar no localStorage', err);
    throw err;
  }
}

export function lerItem(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (err) {
    console.error('Erro ao ler localStorage', err);
    return null;
  }
}


export function salvarApiKey(key) {
  salvarItem(CONFIG_API_KEY, key);
}

export function lerApiKey() {
  return lerItem(CONFIG_API_KEY);
}

export function salvarModelo(model) {
  salvarItem(CONFIG_MODEL, model);
}

export function lerModelo() {
  return lerItem(CONFIG_MODEL);
}
