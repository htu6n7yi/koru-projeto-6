import { carregarHistorico, limparHistorico, } from '../services/storage.js';

// Função para formatar texto com Markdown seguro
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

// Mostra a resposta da IA
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

// Inicializa ações dos botões de resposta e histórico
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

// Renderiza o histórico completo
export function renderHistorico() {
  const listaHistorico = document.getElementById('listaHistorico');
  if (!listaHistorico) return;

  const historico = carregarHistorico();
  if (!historico || historico.length === 0) {
    listaHistorico.textContent = 'Nenhuma pergunta ainda';
    return;
  }

  listaHistorico.innerHTML = '';

  historico.forEach((item) => {
    // Pergunta
    const cardPerg = document.createElement('div');
    cardPerg.className = 'hist-card hist-usuario animate-slideUp';
    const textoPerg = document.createElement('span');
    textoPerg.className = 'hist-texto';
    textoPerg.textContent = item.pergunta;
    cardPerg.appendChild(textoPerg);

    // Resposta
    const cardResp = document.createElement('div');
    cardResp.className = 'hist-card hist-ia animate-slideUp';
    const textoResp = document.createElement('span');
    textoResp.className = 'hist-texto';
    textoResp.textContent = item.resposta;
    cardResp.appendChild(textoResp);
    cardResp.style.display = 'none'; // começa escondida

    // Toggle: mostra/esconde ao clicar na pergunta
    cardPerg.addEventListener('click', () => {
      cardResp.style.display = cardResp.style.display === 'none' ? 'block' : 'none';
    });

    // Agrupamento
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.flexDirection = 'column';
    wrap.style.gap = '4px';
    wrap.appendChild(cardPerg);
    wrap.appendChild(cardResp);

    listaHistorico.appendChild(wrap);
  });

  listaHistorico.scrollTop = listaHistorico.scrollHeight;
}

// Função para filtrar o histórico
export function filtrarHistorico(termo) {
  const lista = document.getElementById('listaHistorico');
  if (!lista) return;

  const cards = lista.querySelectorAll('.hist-card .hist-texto');
  if (!cards.length) {
    window.showToast?.("⚠️ Nenhum histórico encontrado!");
    return;
  }

  let algumVisivel = false;
  termo = termo.trim().toLowerCase();

  cards.forEach(textoSpan => {
    const card = textoSpan.parentElement;
    const textoCard = textoSpan.textContent.toLowerCase();
    if (termo === '' || textoCard.includes(termo)) {
      card.style.display = 'block';
      algumVisivel = true;
    } else {
      card.style.display = 'none';
    }
  });

  if (!algumVisivel && termo !== '') {
    window.showToast?.("⚠️ Nenhum histórico encontrado!");
  }
}
