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
