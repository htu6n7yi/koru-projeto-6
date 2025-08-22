// ===== Tema Claro / Escuro =====
const toggleBtn = document.getElementById('toggleTema');
const html = document.documentElement;

const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) {
    html.setAttribute('data-tema', temaSalvo);
    atualizarIcone(temaSalvo, false);
}

toggleBtn?.addEventListener('click', () => {
    const temaAtual = html.getAttribute('data-tema') || 'light';
    const novoTema = (temaAtual === 'light') ? 'dark' : 'light';
    html.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);
    atualizarIcone(novoTema, true);
});

function atualizarIcone(tema, animar = true) {
    const isDark = tema === 'dark';
    if (toggleBtn) {
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
        toggleBtn.setAttribute('aria-checked', isDark ? 'true' : 'false');

        if (animar) {
            toggleBtn.style.transition = "transform 0.3s ease, rotate 0.5s ease";
            toggleBtn.style.transform = "scale(1.4) rotate(20deg)";
            setTimeout(() => {
                toggleBtn.style.transform = "scale(1) rotate(0deg)";
            }, 300);
        }
    }
}

// ===== DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {

    const cta = document.getElementById('ctaPrincipal');
    const pergunta = document.getElementById('pergunta');
    const filtro = document.getElementById("filtroHistorico");
    const lupa = document.getElementById("botaoLupa");
    const limparHistoricoBtn = document.getElementById("limparHistorico");
    const lista = document.getElementById("listaHistorico");
    const exportPdfBtn = document.getElementById("exportPdf");
    const exportTxtBtn = document.getElementById("exportTxt");

    // ===== CTA e foco =====
    if (cta) {
        cta.addEventListener('click', (e) => {
            e.currentTarget.classList.add('cta-clicked');
            setTimeout(() => e.currentTarget.classList.remove('cta-clicked'), 180);
            if (pergunta) {
                pergunta.focus({ preventScroll: true });
                pergunta.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
        cta.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cta.click();
            }
        });
    }

    // ===== Histórico =====
    function fecharTodosDetails() {
        if (!lista) return;
        lista.querySelectorAll("details[open]").forEach(d => d.open = false);
    }

    function encontrarResposta(perguntaCard) {
        if (!perguntaCard) return null;
        let el = perguntaCard.nextElementSibling;
        while (el) {
            if (el.classList?.contains('hist-card')) {
                if (el.classList.contains('hist-ia')) return el;
                if (el.classList.contains('hist-usuario')) return null;
            }
            el = el.nextElementSibling;
        }
        return null;
    }

    function esconderResposta(resp) {
        if (!resp) return;
        resp.classList.add("collapsed");
        resp.removeAttribute('data-open');
    }

    function mostrarResposta(resp) {
        if (!resp) return;
        resp.classList.remove("collapsed");
        resp.setAttribute('data-open', 'true');
    }

    function estadoInicial() {
        if (!lista) return;
        lista.querySelectorAll(".hist-card.hist-usuario").forEach(p => p.style.display = "");
        lista.querySelectorAll(".hist-card.hist-ia").forEach(resp => resp.classList.add("collapsed"));
        fecharTodosDetails();
    }

    function filtrarHistorico() {
        if (!lista) return;
        const termo = (filtro?.value || "").trim().toLowerCase();
        const perguntas = lista.querySelectorAll(".hist-card.hist-usuario");
        if (!perguntas.length) {
            if (termo) showToast("⚠️ Nenhum histórico encontrado!");
            return;
        }

        let algumVisivel = false;
        perguntas.forEach(perguntaCard => {
            const respCard = encontrarResposta(perguntaCard);
            const textoPerg = (perguntaCard.querySelector(".hist-texto")?.textContent || "").toLowerCase();
            const textoResp = (respCard?.querySelector(".hist-texto")?.textContent || "").toLowerCase();
            if (!termo) {
                perguntaCard.style.display = "";
                esconderResposta(respCard);
                algumVisivel = true;
            } else {
                const match = (textoPerg + " " + textoResp).includes(termo);
                perguntaCard.style.display = match ? "" : "none";
                esconderResposta(respCard);
                if (match) algumVisivel = true;
            }
        });

        if (termo && !algumVisivel) showToast("⚠️ Nenhum histórico encontrado!");
    }

    if (lista) {
        lista.addEventListener("click", (e) => {
            const perguntaCard = e.target.closest(".hist-card.hist-usuario");
            if (perguntaCard) {
                const termo = (filtro?.value || "").trim();
                const resp = encontrarResposta(perguntaCard);
                if (!resp) return;
                if (termo) { esconderResposta(resp); return; }
                getComputedStyle(resp).display !== "none" ? esconderResposta(resp) : mostrarResposta(resp);
            }

            // Seleção de cards
            const card = e.target.closest(".hist-card");
            if (!card) return;
            if (e.ctrlKey || e.metaKey) card.classList.toggle("selected");
            else {
                lista.querySelectorAll(".hist-card.selected").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");
            }
        });
    }

    filtro?.addEventListener("input", filtrarHistorico);
    filtro?.addEventListener("keydown", (e) => { if (e.key === "Enter") e.preventDefault(); });
    lupa?.addEventListener("click", filtrarHistorico);

    limparHistoricoBtn?.addEventListener("click", () => {
        if (lista) lista.innerHTML = "";
        if (filtro) filtro.value = "";
        showToast("🗑️ Histórico limpo!");
    });

    estadoInicial();

    // ===== Exportar PDF =====
    exportPdfBtn?.addEventListener("click", () => {
        const historico = lista ? Array.from(lista.querySelectorAll(".hist-card.selected")) : [];
        if (!historico.length) return showToast("⚠️ Nenhum card selecionado!");

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const margin = 12;
        const gap = 8;        // espaçamento entre bolhas
        const padding = 6;    // margem interna
        let y = margin + 8;   // começa um pouco abaixo do título

        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        const bubbleW = pageW - margin * 2;        // largura da bolha
        const textW = bubbleW - padding * 2;     // largura útil do texto

        // altura de linha em mm (~1.25x o tamanho da fonte em mm)
        doc.setFontSize(12);
        const lineHeight = Math.max(
            5,
            Math.round(doc.getFontSize() * 0.3528 * 1.25)
        );

        // ===== título opcional =====
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Histórico de Conversas', pageW / 2, margin, { align: 'center' });
        doc.setFontSize(12);

        // Função que desenha uma bolha paginada
        function renderBubble({ text, bold = false, fill = [245, 245, 255], stroke = [150, 150, 150] }) {
            doc.setFont('helvetica', bold ? 'bold' : 'normal');

            // Quebra em linhas que caibam na largura da bolha
            const lines = doc.splitTextToSize(text, textW);

            let i = 0;
            while (i < lines.length) {
                // espaço disponível nesta página
                const available = (pageH - margin) - y;

                // quantas linhas cabem neste espaço (considerando padding)
                let maxLines = Math.floor((available - padding * 2) / lineHeight);

                // se não cabe nada, vai pra próxima página
                if (maxLines < 1) {
                    doc.addPage();
                    y = margin;
                    continue;
                }

                const chunk = lines.slice(i, i + maxLines);
                const boxH = chunk.length * lineHeight + padding * 2;

                // desenha a bolha
                doc.setDrawColor(...stroke);
                doc.setFillColor(...fill);
                doc.roundedRect(margin, y, bubbleW, boxH, 5, 5, 'F');

                // escreve o texto
                chunk.forEach((ln, idx) => {
                    doc.text(ln, margin + padding, y + padding + idx * lineHeight);
                });

                // avança
                y += boxH + gap;
                i += chunk.length;
            }
        }

        // Loop do histórico 
        historico.forEach(card => {
            const isPergunta = card.classList.contains('hist-usuario');

            const txtPerg = (card.querySelector('.hist-texto')?.innerText || '').trim();
            const tsPerg = (card.querySelector('.hist-timestamp')?.innerText || '').trim();
            const perguntaCompleta = [txtPerg, tsPerg].filter(Boolean).join('  •  ');

            // Pergunta (bolha 1)
            renderBubble({
                text: perguntaCompleta,
                bold: true,
                fill: [220, 235, 255],
                stroke: [70, 130, 255]
            });

            // Resposta (bolha 2), apenas se estiver "aberta" no histórico
            if (isPergunta) {
                const resp = card.nextElementSibling;
                if (resp?.classList.contains('hist-ia') && getComputedStyle(resp).display !== 'none') {
                    const txtResp = (resp.querySelector('.hist-texto')?.innerText || '').trim();
                    const tsResp = (resp.querySelector('.hist-timestamp')?.innerText || '').trim();
                    const respostaCompleta = [txtResp, tsResp].filter(Boolean).join('  •  ');

                    renderBubble({
                        text: respostaCompleta,
                        bold: false,
                        fill: [245, 245, 255],
                        stroke: [150, 150, 150]
                    });

                    y += 4; // um respiro extra entre Q&A
                }
            }
        });

        doc.save('historico_formatado.pdf');
        showToast('📝 PDF gerado com estilo e conteúdo completo!');

    });


    // ===== Exportar TXT =====
    exportTxtBtn?.addEventListener("click", () => {
        if (!lista) return showToast("⚠️ Nenhum card selecionado!");
        const historico = Array.from(lista.querySelectorAll(".hist-card.selected"));
        if (!historico.length) return showToast("⚠️ Nenhum card selecionado!");

        let conteudo = "=== HISTÓRICO DE CONVERSAS ===\n";
        conteudo += `Gerado em: ${new Date().toLocaleString()}\n`;
        conteudo += "====================================\n\n";

        historico.forEach(card => {
            const isPergunta = card.classList.contains("hist-usuario");
            const texto = card.querySelector(".hist-texto")?.innerText || "";
            const timestamp = card.querySelector(".hist-timestamp")?.innerText || "";
            conteudo += `${isPergunta ? "🧑‍💻 Pergunta" : "🤖 Resposta"} ${timestamp}\n${texto}\n------------------------------------\n`;

            if (isPergunta) {
                const resp = card.nextElementSibling;
                if (resp?.classList.contains("hist-ia") && getComputedStyle(resp).display !== "none") {
                    const textoResp = resp.querySelector(".hist-texto")?.innerText || "";
                    const timestampResp = resp.querySelector(".hist-timestamp")?.innerText || "";
                    conteudo += `🤖 Resposta ${timestampResp}\n${textoResp}\n------------------------------------\n`;
                }
            }
        });

        const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `historico_${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.txt`;
        a.click();
        showToast("📄 Histórico exportado em TXT!");
    });

}); // DOMContentLoaded

// Toasts 
let toastContainer = document.getElementById("toastContainer");
if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    document.body.appendChild(toastContainer);
}

function showToast(message, duration = 3000) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "toastOut 0.35s forwards";
        toast.addEventListener("animationend", () => toast.remove());
    }, duration);
}
window.showToast = showToast;

// Contador de caracteres
const textarea = document.getElementById("pergunta");
const contador = document.getElementById("contadorCaracteres");
const limite = 1000;

if (textarea && contador) {
    textarea.addEventListener("input", () => {
        const restantes = limite - textarea.value.length;
        contador.textContent = restantes >= 0 ? restantes : 0;
        contador.style.color = restantes <= 50 ? "red" : restantes <= 150 ? "orange" : "#555";
        if (textarea.value.length > limite) textarea.value = textarea.value.substring(0, limite);
    });
}

// Adicionar histórico 
function adicionarHistorico(texto, tipo = "usuario") {
    const lista = document.getElementById("listaHistorico");
    if (!lista) return;

    const card = document.createElement("div");
    card.className = `hist-card hist-${tipo} animate-slideUp`;

    const textoSpan = document.createElement("span");
    textoSpan.className = "hist-texto";
    textoSpan.textContent = texto;
    card.appendChild(textoSpan);

    const agora = new Date();
    const timestamp = document.createElement("span");
    timestamp.className = "hist-timestamp";
    timestamp.textContent = " (" + agora.toLocaleString() + ")";
    card.appendChild(timestamp);

    if (tipo === "ia") card.style.display = "none";

    lista.appendChild(card);
    lista.scrollTop = lista.scrollHeight;
}

// Copiar resposta
const copiarBtn = document.getElementById("copiarResposta");
if (copiarBtn) copiarBtn.addEventListener("click", () => showToast("📋 Copiado!"));

// Mensagem de erro divertida
function showError() { showToast("😅 Tô pensando… tenta de novo.", 3500); }
