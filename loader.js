// loader.js (ES Module)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("perguntaForm");
  const respostaConteudo = document.getElementById("respostaConteudo");
  const erro = document.getElementById("erro");
  const statusLoaderInline = document.getElementById("loader"); // o que já existe na sua página

  // ---- Estilos do overlay (injetados para não depender do seu CSS) ----
  const style = document.createElement("style");
  style.textContent = `
    /* Overlay tela cheia */
    #loadingOverlay.loader-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      background: rgba(0,0,0,0.35);
      backdrop-filter: blur(2px);
      z-index: 9999; /* acima do botão de tema (1000) */
      opacity: 1;
      transition: opacity .2s ease;
    }
    #loadingOverlay.loader-overlay.oculto { display: none; }

    /* Cartão central do loader */
    .loader-modal {
      width: min(520px, 96vw);
      background: var(--secondary);
      color: var(--text);
      border-radius: 16px;
      border-left: 6px solid var(--accent);
      box-shadow: 0 10px 30px rgba(0,0,0,.25);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .75rem;
      animation: loaderPop .18s ease;
    }

    /* Spinner */
    .loader-spinner {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      border: 5px solid rgba(0,0,0,.08);
      border-top-color: var(--accent);
      animation: loaderSpin 1s linear infinite;
    }

    .loader-text { font-weight: 600; }
    .loader-hint { opacity: .8; font-size: .9rem; }

    @keyframes loaderSpin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes loaderPop {
      from { transform: translateY(6px); opacity: .0; }
      to   { transform: translateY(0);   opacity: 1;  }
    }
  `;
  document.head.appendChild(style);

  // ---- Estrutura do overlay ----
  const overlay = document.createElement("div");
  overlay.id = "loadingOverlay";
  overlay.className = "loader-overlay oculto";
  overlay.setAttribute("role", "status");
  overlay.setAttribute("aria-live", "polite");
  overlay.setAttribute("aria-busy", "true");
  overlay.innerHTML = `
    <div class="loader-modal">
      <div class="loader-spinner" aria-hidden="true"></div>
      <p class="loader-text">Gerando resposta…</p>
      <small class="loader-hint">Isso pode levar alguns segundos.</small>
    </div>
  `;
  document.body.appendChild(overlay);

  // ---- Funções globais para você reutilizar se quiser ----
  function showLoader(text = "Gerando resposta…") {
    const textEl = overlay.querySelector(".loader-text");
    if (textEl) textEl.textContent = text;
    overlay.classList.remove("oculto");
    // trava o scroll do body
    document.body.dataset.scrollLock = "1";
    document.body.style.overflow = "hidden";
    // mostra também o loader inline (se você quiser manter)
    if (statusLoaderInline) statusLoaderInline.classList.remove("oculto");
  }

  function hideLoader() {
    overlay.classList.add("oculto");
    if (statusLoaderInline) statusLoaderInline.classList.add("oculto");
    if (document.body.dataset.scrollLock === "1") {
      document.body.style.overflow = "";
      delete document.body.dataset.scrollLock;
    }
  }

  // expõe para outros scripts (ex.: você pode chamar window.hideLoader() após o fetch)
  window.showLoader = showLoader;
  window.hideLoader = hideLoader;

  // ---- Mostra ao enviar o formulário ----
  if (form) {
    form.addEventListener("submit", () => {
      showLoader();
    });
  }

  // ---- Esconde quando a resposta aparecer ----
  if (respostaConteudo) {
    const respostaObserver = new MutationObserver(() => {
      if (overlay.classList.contains("oculto")) return;
      const hasText = (respostaConteudo.textContent || "").trim().length > 0;
      const hasNodes = respostaConteudo.children.length > 0;

      if (hasText || hasNodes) {
        hideLoader();
      }
    });

    respostaObserver.observe(respostaConteudo, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // ---- Esconde se aparecer erro ----
  if (erro) {
    const erroObserver = new MutationObserver(() => {
      if (!erro.classList.contains("oculto")) hideLoader();
    });
    erroObserver.observe(erro, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // ---- Permite fechar com ESC (útil em testes/dev) ----
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.classList.contains("oculto")) {
      hideLoader();
    }
  });
});
