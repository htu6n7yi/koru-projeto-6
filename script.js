// Tema Claro / Escuro
const toggleBtn = document.getElementById('toggleTema');
const html = document.documentElement;

// Recupera tema salvo no localStorage
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) {
    html.setAttribute('data-tema', temaSalvo);
    atualizarIcone(temaSalvo, false);
}

// Alterna tema ao clicar no botão
toggleBtn.addEventListener('click', () => {
    const temaAtual = html.getAttribute('data-tema') || 'light';
    const novoTema = temaAtual === 'light' ? 'dark' : 'light';
    html.setAttribute('data-tema', novoTema);
    localStorage.setItem('tema', novoTema);
    atualizarIcone(novoTema, true);
});

function atualizarIcone(tema, animar = true) {
    const isDark = tema === 'dark';
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


// 2️⃣ DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // CTA e foco
    const cta = document.getElementById('ctaPrincipal');
    const pergunta = document.getElementById('pergunta');

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

    // Integração com o formulário de pergunta
    const perguntaForm = document.getElementById('perguntaForm');
    if (perguntaForm) {
        perguntaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const texto = document.getElementById('pergunta').value.trim();
            if (texto) {
                adicionarHistorico(texto, 'usuario');
                perguntaForm.reset(); 
            }
        });
    }

    // Filtro do histórico
    const filtro = document.getElementById("filtroHistorico");
    const lupa = document.getElementById("botaoLupa");

    function filtrarHistorico() {
        const filtroInput = document.getElementById("filtroHistorico");
        const lista = document.getElementById("listaHistorico");
        if (!filtroInput || !lista) return;

        const termo = filtroInput.value.trim().toLowerCase();
        const cards = lista.querySelectorAll(".hist-card");

        // Se não tiver nenhum card, mostra mensagem
        if (!cards.length) {
            showToast("⚠️ Nenhum histórico encontrado!");
            return;
        }

        let algumVisivel = false;

        cards.forEach(card => {
            const textoCard = card.querySelector(".hist-texto").textContent.toLowerCase();
            if (termo === '' || textoCard.includes(termo)) {
                card.style.display = "block";
                algumVisivel = true;
            } else {
                card.style.display = "none";
            }
        });

        if (!algumVisivel && termo !== '') {
            showToast("⚠️ Nenhum histórico encontrado!");
        }
    }


    // Clique na lupa
    if (lupa) lupa.addEventListener("click", filtrarHistorico);

    // Pressionar Enter no input
    if (filtro) {
        filtro.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                filtrarHistorico();
            }
        });
    }

    // Exportação PDF
    const exportPdfBtn = document.getElementById("exportPdf");
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener("click", () => {
            const lista = document.getElementById("listaHistorico");
            const historico = lista ? lista.innerText.trim() : "";
            console.log("Conteúdo do histórico:", historico); 
            if (!historico) {
                showToast("⚠️ Histórico vazio!");
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            let y = 10;
            historico.split("\n").forEach(linha => {
                doc.text(linha, 10, y);
                y += 10;
                if (y > 280) { doc.addPage(); y = 10; }
            });
            doc.save("historico.pdf");
            showToast("📝 Histórico exportado em PDF!");
        });
    }

    // Exportação TXT
    const exportTxtBtn = document.getElementById("exportTxt");
    if (exportTxtBtn) {
        exportTxtBtn.addEventListener("click", () => {
            const lista = document.getElementById("listaHistorico");
            const historico = lista ? lista.innerText.trim() : "";
            console.log("Conteúdo do histórico:", historico); // Depuração
            if (!historico) {
                showToast("⚠️ Histórico vazio!");
                return;
            }
            const blob = new Blob([historico], { type: "text/plain;charset=utf-8" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "historico.txt";
            a.click();
            URL.revokeObjectURL(url);
            showToast("📄 Histórico exportado em TXT!");
        });
    }
});


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

if (textarea) {
    textarea.addEventListener("input", () => {
        const restantes = limite - textarea.value.length;
        contador.textContent = restantes >= 0 ? restantes : 0;

        if (restantes <= 50) {
            contador.style.color = "red";
        } else if (restantes <= 150) {
            contador.style.color = "orange";
        } else {
            contador.style.color = "#555";
        }

        if (textarea.value.length > limite) {
            textarea.value = textarea.value.substring(0, limite);
        }
    });
}


// Adicionar histórico
function adicionarHistorico(texto, tipo = "usuario") {
    const lista = document.getElementById("listaHistorico");
    if (!lista) return;

    if (!lista.querySelector(".hist-card")) {
        lista.innerHTML = "";
    }

    const card = document.createElement("div");
    card.className = `hist-card hist-${tipo}`;

    const textoSpan = document.createElement("span");
    textoSpan.className = "hist-texto";
    textoSpan.textContent = texto;
    card.appendChild(textoSpan);

    const agora = new Date();
    const timestamp = document.createElement("span");
    timestamp.className = "hist-timestamp";
    timestamp.textContent = " (" + agora.toLocaleString() + ")";
    card.appendChild(timestamp);

    lista.appendChild(card);
    lista.scrollTop = lista.scrollHeight;
}


// Copiar resposta
const copiarBtn = document.getElementById("copiarResposta");
if (copiarBtn) copiarBtn.addEventListener("click", () => showToast("📋 Copiado!"));

// Mensagem de erro divertida
function showError() {
    showToast("😅 Tô pensando… tenta de novo.", 3500);
}