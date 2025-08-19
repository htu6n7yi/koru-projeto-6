import { carregarHistorico, limparHistorico, atualizarFavorito } from '../services/storage.js';

function formatarTextoMarkdown(texto) {
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const seguro = esc(texto);
  return seguro
    .replace(/```([\s\S]*?)```/g, (_, code) => `<pre><code>${code}</code></pre>`)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

export function mostrarResposta(texto, titulo = 'Resposta da IA:') {
  const respostaConteudo = document.getElementById('respostaConteudo');
  if (!respostaConteudo) return;

  const card = document.createElement('div');
  card.className = 'resposta-card animate-fadeIn';

  const header = document.createElement('div');
  header.className = 'resposta-titulo';
  header.textContent = titulo;

  const body = document.createElement('div');
  body.className = 'resposta-conteudo';
  body.innerHTML = formatarTextoMarkdown(texto);

  card.appendChild(header);
  card.appendChild(body);
  respostaConteudo.appendChild(card);
  respostaConteudo.scrollTop = respostaConteudo.scrollHeight;

  renderHistorico();
}

export function inicializarAcoesResposta() {
  const copiarBtn = document.getElementById('copiarResposta');
  const limparBtn = document.getElementById('limparResposta');
  const respostaConteudo = document.getElementById('respostaConteudo');
  const limparHistoricoBtn = document.getElementById('limparHistorico');

  if (copiarBtn) {
    copiarBtn.addEventListener('click', async () => {
      const texto = respostaConteudo?.innerText || '';
      if (!texto) return;
      try {
        await navigator.clipboard.writeText(texto);
        copiarBtn.textContent = '✅ Copiado!';
        setTimeout(() => (copiarBtn.textContent = '📋 Copiar'), 2000);
      } catch {
        copiarBtn.textContent = '⚠️ Erro ao copiar';
        setTimeout(() => (copiarBtn.textContent = '📋 Copiar'), 2000);
      }
    });
  }

  if (limparBtn) {
    limparBtn.addEventListener('click', () => {
      if (respostaConteudo) respostaConteudo.innerHTML = '';
      window.showToast?.('🧹 Resposta limpa.');
    });
  }

  if (limparHistoricoBtn) {
    limparHistoricoBtn.addEventListener('click', () => {
      limparHistorico();
      renderHistorico();
      window.showToast?.('🧽 Histórico limpo.');
    });
  }

  renderHistorico();
}

export function renderHistorico() {
  const listaHistorico = document.getElementById('listaHistorico');
  if (!listaHistorico) return;

  const historico = carregarHistorico();
  if (!historico || historico.length === 0) {
    listaHistorico.textContent = 'Nenhuma pergunta ainda';
    return;
  }

  listaHistorico.innerHTML = '';

  historico.forEach((item, index) => {
    const cardPerg = document.createElement('div');
    cardPerg.className = 'hist-card hist-usuario animate-slideUp';
    const textoPerg = document.createElement('span');
    textoPerg.className = 'hist-texto';
    textoPerg.textContent = item.pergunta;
    const tsPerg = document.createElement('span');
    tsPerg.className = 'hist-timestamp';
    tsPerg.textContent = item.dataPergunta ? ` (${item.dataPergunta})` : '';
    cardPerg.appendChild(textoPerg);
    cardPerg.appendChild(tsPerg);

    const cardResp = document.createElement('div');
    cardResp.className = 'hist-card hist-ia animate-slideUp';
    const textoResp = document.createElement('span');
    textoResp.className = 'hist-texto';
    textoResp.textContent = item.resposta;
    const tsResp = document.createElement('span');
    tsResp.className = 'hist-timestamp';
    tsResp.textContent = item.dataResposta ? ` (${item.dataResposta})` : '';
    cardResp.appendChild(textoResp);
    cardResp.appendChild(tsResp);

    const favBtn = document.createElement('button');
    favBtn.className = 'btn-favorito';
    favBtn.setAttribute('aria-label', 'Favoritar item');
    favBtn.dataset.index = String(index);
    favBtn.textContent = item.favorito ? '⭐' : '☆';
    favBtn.style.minWidth = '50px';
    favBtn.style.maxWidth = '50px';
    favBtn.style.margin = '6px 2rem';
    favBtn.style.padding = '0.3rem';
    favBtn.onclick = () => {
      atualizarFavorito(index, !item.favorito);
      renderHistorico();
    };

    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'flex-start';
    wrap.style.gap = '8px';
    wrap.appendChild(cardPerg);
    wrap.appendChild(cardResp);
    wrap.appendChild(favBtn);

    listaHistorico.appendChild(wrap);
  });

  listaHistorico.scrollTop = listaHistorico.scrollHeight;
}