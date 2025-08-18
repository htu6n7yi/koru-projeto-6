// inicializarFormulario.js
import { salvarConversa } from '../services/storage.js';

// Função que organiza o texto: listas, parágrafos, negrito, itálico e links
export function formatarTextoOrganizado(texto) {
  const linhas = texto.split('\n');
  let html = '';
  let dentroLista = false;
  let dentroListaNum = false;

  linhas.forEach(linha => {
    linha = linha.trim();
    if (!linha) return;

    // Listas não ordenadas
    if (linha.startsWith('* ')) {
      if (!dentroLista) { html += '<ul>'; dentroLista = true; }
      html += `<li>${linha.slice(2)}</li>`;
    }
    // Listas numeradas
    else if (/^\d+\./.test(linha)) {
      if (!dentroListaNum) { html += '<ol>'; dentroListaNum = true; }
      html += `<li>${linha.replace(/^\d+\.\s*/, '')}</li>`;
    }
    else {
      if (dentroLista) { html += '</ul>'; dentroLista = false; }
      if (dentroListaNum) { html += '</ol>'; dentroListaNum = false; }
      html += `<p>${linha}</p>`;
    }
  });

  if (dentroLista) html += '</ul>';
  if (dentroListaNum) html += '</ol>';

  // Mantém markdown simples e links
  html = html
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

  return html;
}

// Função que mostra a resposta já organizada
export function mostrarResposta(resposta, container) {
  const htmlFormatado = formatarTextoOrganizado(resposta);
  container.innerHTML += htmlFormatado;
  container.scrollIntoView({ behavior: 'smooth' });
}

// Inicializa o formulário e trata envio de perguntas
export function inicializarFormulario(enviarPerguntaAPI) {
  const perguntaForm = document.getElementById('perguntaForm');
  if (!perguntaForm) return;

  if (perguntaForm.dataset.initialized === '1') return;
  perguntaForm.dataset.initialized = '1';

  const perguntaInput = document.getElementById('pergunta');
  const erro = document.getElementById('erro');
  const respostaConteudo = document.getElementById('respostaConteudo');
  const conquista = document.getElementById('conquista');

  function mostrarConquista() {
    if (!conquista) return;
    conquista.classList.remove('oculto');
    setTimeout(() => conquista.classList.add('oculto'), 2000);
  }

  // Atalho Ctrl+Enter
  if (perguntaInput) {
    perguntaInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        perguntaForm.requestSubmit();
      }
    });
  }

  perguntaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pergunta = (perguntaInput?.value || '').trim();
    if (!pergunta) return;

    window.showLoader();
    erro?.classList.add('oculto');

    if (respostaConteudo) {
      respostaConteudo.innerHTML = '';
      respostaConteudo.scrollTop = 0;
    }

    try {
      const resposta = await enviarPerguntaAPI(pergunta);

      // Suporta streaming (async iterable)
      if (Symbol.asyncIterator in Object(resposta)) {
        for await (const chunk of resposta) {
          mostrarResposta(chunk, respostaConteudo);
        }
      } else {
        mostrarResposta(resposta, respostaConteudo);
      }

      mostrarConquista();
      salvarConversa(pergunta, resposta);
    } catch (err) {
      console.error(err);
      erro?.classList.remove('oculto');
    } finally {
      window.hideLoader();
    }
  });
}
