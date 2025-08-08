
import { mostrarResposta } from './resultadoIA.js';

export function inicializarFormulario(enviarPerguntaAPI) {
const perguntaForm = document.getElementById('perguntaForm');
const perguntaInput = document.getElementById('pergunta');
const loader = document.getElementById('loader');
const erro = document.getElementById('erro');
const respostaConteudo = document.getElementById('respostaConteudo');

// Atalho Ctrl+Enter
perguntaInput.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'Enter') {
    perguntaForm.requestSubmit();
  }
});

// Envio da pergunta
perguntaForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const pergunta = perguntaInput.value.trim();
  if (!pergunta) return;

  loader.classList.remove('oculto');
  erro.classList.add('oculto');
  respostaConteudo.innerHTML = '';

  try {
    const resposta = await enviarPerguntaAPI(pergunta); 
    mostrarResposta(resposta);
  } catch (err) {
    erro.classList.remove('oculto');
  } finally {
    loader.classList.add('oculto');
  }
});
