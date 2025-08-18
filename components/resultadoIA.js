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
  paragrafo.innerHTML = textoFormatado;
  paragrafo.style.animation = 'fadeIn 0.6s ease-in-out';
  respostaConteudo.appendChild(paragrafo);
  respostaConteudo.scrollIntoView({ behavior: 'smooth' });

  
  renderHistorico();
}

export function inicializarAcoesResposta() {
  const copiarBtn = document.getElementById('copiarResposta');
  const limparBtn = document.getElementById('limparResposta');
  const respostaConteudo = document.getElementById('respostaConteudo');
  const limparHistoricoBtn = document.getElementById('limparHistorico');

  copiarBtn.addEventListener('click', () => {
    const texto = respostaConteudo.textContent;
    navigator.clipboard.writeText(texto).then(() => {
      copiarBtn.textContent = '✅ Copiado!';
      setTimeout(() => copiarBtn.textContent = '📋 Copiar', 2000);
    });
  });

  limparBtn.addEventListener('click', () => {
    respostaConteudo.innerHTML = '';
  });

  limparHistoricoBtn.addEventListener('click', () => {
    limparHistorico();
    renderHistorico();
  });

  renderHistorico();
}

export function renderHistorico() {
  const listaHistorico = document.getElementById('listaHistorico');
  const historico = carregarHistorico();

  if (historico.length === 0) {
    listaHistorico.textContent = "Nenhuma pergunta ainda";
    return;
  }

  listaHistorico.innerHTML = historico.map((item, index) => `
  <div class="hist-card ${index % 2 === 0 ? 'hist-usuario' : 'hist-ia'}">
    <div><strong>Pergunta:</strong><br>${item.pergunta}</div>
    <div><strong>Resposta:</strong><br>${formatarTextoMarkdown(item.resposta)}</div>
    <div class="hist-timestamp">${item.data}</div>
    <button class="btn-favorito" data-index="${index}">
      ${item.favorito ? '⭐' : '☆'}
    </button>
  </div>
`).join('');


  document.querySelectorAll('.btn-favorito').forEach(btn => {
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      const atualFavorito = historico[idx].favorito;
      atualizarFavorito(idx, !atualFavorito);
      renderHistorico();
    };
  });
}