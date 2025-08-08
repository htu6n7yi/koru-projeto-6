export function mostrarResposta(texto) {
  const respostaConteudo = document.getElementById('respostaConteudo');
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
}

