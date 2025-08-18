import { mostrarResposta } from './resultadoIA.js';
import { salvarConversa } from '../services/storage.js';

export function inicializarFormulario(enviarPerguntaAPI) {
  const perguntaForm = document.getElementById('perguntaForm');
  if (!perguntaForm) return;

  // 🔒 Evita listeners duplicados se esta função for chamada mais de 1x
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

  // Atalho Ctrl+Enter (só adiciona se o input existir)
  if (perguntaInput) {
    perguntaInput.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        perguntaForm.requestSubmit();
      }
    });
  }

  // Envio da pergunta
  perguntaForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pergunta = (perguntaInput?.value || '').trim();
    if (!pergunta) return;

    // 🚀 Mostra loader usando o sistema centralizado
    window.showLoader();

    erro?.classList.add('oculto');
    if (respostaConteudo) respostaConteudo.innerHTML = '';

    try {
      const resposta = await enviarPerguntaAPI(pergunta);
      mostrarResposta(resposta);
      mostrarConquista();
      salvarConversa(pergunta, resposta);
    } catch (err) {
      console.error(err);
      erro?.classList.remove('oculto');
    } finally {
      // 🚀 Esconde loader pelo sistema centralizado
      window.hideLoader();
    }
  });
}
