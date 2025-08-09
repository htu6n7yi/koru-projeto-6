import { sendQuestion } from './services/api.js';

const toggleBtn = document.getElementById('toggleTema');
const html = document.documentElement;

const temaSalvo = localStorage.getItem('tema');

if (temaSalvo) {
    html.setAttribute('data-tema', temaSalvo);
    atualizarIcone(temaSalvo);
}

toggleBtn.addEventListener('click', () => {
    const temaAtual = html.getAttribute('data-tema') || 'light';
    const novoTema = temaAtual === 'light' ? 'dark' : 'light';
    html.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);
    atualizarIcone(novoTema);
});

function atualizarIcone(tema) {
    toggleBtn.textContent = tema === 'dark' ? '☀️' : '🌙';
}


sendQuestion("Quais as linguagens de programação mais usadas na atualidade?")
  .then(response => console.log("Resposta da API:", response))
  .catch(error => console.error("Erro:", error));

