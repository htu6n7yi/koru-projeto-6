import { carregarHistorico, limparHistorico, atualizarFavorito } from '../services/storage.js';

function formatarTextoMarkdown(texto) {
  return texto
    .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>') 
    .replace(/`([^`]+)`/g, '<code>$1</code>')                
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') 
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')        
    .replace(/\*(.*?)\*/g, '<em>$1</em>');                   
}

export function mostrarResposta(texto) {
  const respostaConteudo = document.getElementById('respostaConteudo');
  const textoFormatado = formatarTextoMarkdown(texto);
  const paragrafo = document.createElement('p');
  paragrafo.textContent = texto;
  paragrafo.style.animation = 'fadeIn 0.6s ease-in-out';
  respostaConteudo.appendChild(paragrafo);
  respostaConteudo.scrollIntoView({ behavior: 'smooth' });
}

export function inicializarAcoesResposta() {
  const copiarBtn = document.getElementById('copiarResposta');
  const limparBtn = document.getElementById('limparResposta');
  const respostaConteudo = document.getElementById('respostaConteudo');
  const listaHistorico = document.getElementById('listaHistorico');

  copiarBtn.addEventListener('click', () => {
    const texto = respostaConteudo.textContent;
    navigator.clipboard.writeText(texto).then(() => {
      copiarBtn.textContent = '✅ Copiado!';
      setTimeout(() => copiarBtn.textContent = '📋 Copiar', 2000);
    });
  });

  limparBtn.addEventListener('click', () => {
    // Só limpa a área de resposta, não o histórico
    respostaConteudo.innerHTML = '';
  });

  renderHistorico();

  function renderHistorico() {
    const historico = carregarHistorico();
    if (historico.length === 0) {
      listaHistorico.textContent = "Nenhuma pergunta ainda";
      return;
    }
    listaHistorico.innerHTML = historico.map((item, index) => `
      <div class="item-historico" style="border-bottom: 1px solid #eee; padding: 8px 0; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>Pergunta:</strong> ${item.pergunta}<br>
          <strong>Resposta:</strong> ${item.resposta}
        </div>
        <button aria-label="Favoritar item" class="btn-favorito" data-index="${index}" style="min-width: 50px; max-width: 50px; margin: 0 2rem; padding: 0.3rem">
          ${item.favorito ? '⭐' : '☆'}
        </button>
      </div>
    `).join("");

    // Depois de renderizar, adiciona eventos aos botões favorito
    document.querySelectorAll('.btn-favorito').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index);
        const atualFavorito = historico[idx].favorito;
        atualizarFavorito(idx, !atualFavorito);
        renderHistorico(); // re-renderiza para atualizar o ícone
      });
    });
  }
}
