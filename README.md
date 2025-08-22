# 📚 Assistente de Estudos com IA

Este projeto é uma aplicação web desenvolvida em grupo como parte dos desafios propostos pela tutora Luara Kerlen. <br> 
Trata-se de um assistente de estudos com integração de Inteligência Artificial, que ajuda estudantes a tirar dúvidas, gerar resumos, <br> organizar rotinas e acompanhar o histórico de perguntas e respostas — com recursos como favoritos, personalização de interface e consumo de API de IA.

> Trabalhar em grupo foi essencial para unir diferentes habilidades e transformar ideias individuais em uma solução completa e funcional. 🚀

🔗 **Acesse o projeto:** [https://koru-projeto-6.vercel.app/](https://koru-projeto-6.vercel.app/)

---

## 🚀 Funcionalidades
- Envio de perguntas para API de IA com exibição de respostas já formatadas (listas, negrito, itálico e links).  
- Histórico de perguntas e respostas armazenado localmente, com filtro, favoritos e exportação em PDF e TXT.  
- Feedback visual de “Pergunta respondida com sucesso!” após envio.  
- Modo claro/escuro com alternância via botão.  
- Loader animado avançado durante requisições, com overlay e bloqueio de scroll.  
- Botões para **copiar** e **limpar** respostas, com feedback visual.  
- Layout responsivo e acessível, otimizado para diferentes tamanhos de tela e contraste adequado.  
- Melhorias de SEO, labels ARIA e rolagem automática no topo ao recarregar.  

---

## 🛠 Tecnologias Utilizadas
- **HTML5** – Estrutura semântica e otimização SEO.
- **CSS3** – Estilos personalizados e responsividade.
- **JavaScript (ES6+)** – Lógica de interação, consumo de API e manipulação de DOM.
- **LocalStorage** – Armazenamento de histórico e favoritos no navegador.
- **API de IA** – Integração com modelo de inteligência artificial.

---

## 📂 Estrutura de Pastas
```
koru-projeto-6/
├── assets/              ← Imagens e ícones
│   └── livro.png
├── components/          ← Componentes JS (configuração, formulário, resultado)
│   ├── configIA.js
│   ├── formPergunta.js
│   └── resultadoIA.js
├── services/            ← Lógica de API e armazenamento local
│   ├── api.js
│   └── storage.js
├── node_modules/
├── style.css            ← Estilos principais
├── responsive.css       ← Estilos responsivos
├── index.html           ← Estrutura HTML da aplicação
├── index.js             ← Integração geral dos scripts
├── script.js
├── package.json
├── package-lock.json
└── README.md
```

---

## 📋 Como Usar (localmente)
1. **Clonar o repositório**
   ```bash
   git clone https://github.com/htu6n7yi/koru-projeto-6.git
   ```
2. **Entrar na pasta do projeto**
   ```bash
   cd koru-projeto-6
   ```
3. **Instalar dependências**
   ```bash
   npm install
   ```
4. **Rodar localmente**
   - Abra o `index.html` no navegador  
     ou  
   - Use uma extensão como **Live Server** no VS Code para desenvolvimento.

## 🎥 Demonstração


https://github.com/user-attachments/assets/bfe55342-0485-429e-a513-096d35d4a7ac

---

## 👥 Integrantes e Contribuições

### 🤝 Organização do Projeto
- **Carlos José** ([CarlosJSilvaDev](https://github.com/htu6n7yi))  
  - Responsável pelo repositório  
  - Organização da estrutura de pastas e módulos  
  - Controle de versionamento e integração no GitHub  

---

### 💡 Funcionalidades e Responsáveis  

#### 🔹 Integração com API de IA  
- **Ana Paula Dantas** ([dantaspereiraana](https://github.com/dantaspereiraana))  
  - Função `sendQuestion` para envio de perguntas e exibição da resposta no console  
  - Testes iniciais de consumo da API  
  - Conexão inicial entre front-end e `services/api.js`  

#### 🔹 Estruturação HTML, Layout e UX  
- **Renata Rocha** ([RenataARocha](https://github.com/RenataARocha))  
  - Estrutura inicial do projeto (`index.html`) com HTML semântico e SEO básico  
  - Estilos principais (`style.css`) e responsividade (`responsive.css`)  
  - Layout completo da aplicação (configurações, formulário, resposta, histórico e footer)  
  - Implementação de botão de alternância claro/escuro  
  - Ajustes de cores, contraste e acessibilidade  
  - Implementação de melhorias no filtro do histórico  
  - Ajustes de exportação de histórico em PDF e TXT  
  - Feedback visual de “Pergunta respondida com sucesso!”  
  - Correções no carregamento da API e melhorias na exibição do resultado da IA  
  - Redação e estruturação deste README.md  

#### 🔹 Formulário de Pergunta  
- **Maira Alves** ([Maira-Alves](https://github.com/Maira-Alves))  
  - Implementação do formulário de pergunta com atalho `Ctrl+Enter`  
  - Integração com função de envio e tratamento de erros  
  - Loader inline durante requisições  
  - Botões **Copiar** e **Limpar** resposta com feedback visual  

#### 🔹 Histórico e Favoritos  
- **Carlos José** ([CarlosJSilvaDev](https://github.com/htu6n7yi))  
  - Armazenamento no `localStorage` para histórico de perguntas/respostas  
  - Funções para salvar, carregar, limpar histórico e favoritar respostas  
  - Renderização de lista de histórico com botão ⭐/☆ para marcar favoritos  

#### 🔹 Loader Avançado e Estados  
- **Ângelo Paixão** ([angelogpaixao](https://github.com/angelogpaixao))  
  - Loader avançado com overlay modal, spinner e bloqueio de scroll  
  - Integração com envio de formulário e desaparecimento ao receber resposta  
  - Código modular e reutilizável  

#### 🔹 Configurações de API Key e Modelos de IA  
- **Letícia Capeletto** ([leticiacapeletto](https://github.com/leticiacapeletto))  
  - Implementação da interface para inserção da API Key e seleção do modelo de IA  
  - Armazenamento seguro das configurações no `localStorage` com máscara da chave para segurança visual  
  - Atualização dinâmica da descrição do modelo selecionado  
  - Validação, salvamento e limpeza das configurações via formulário  
  - Integração com o envio de perguntas para ajustar a requisição conforme o modelo e API Key configurados  

#### 🔹 Ajustes e Funcionalidades Extras  
- **Josue Santos** ([josuepsantos](https://github.com/josuepsantos))  
  - Refatoração da função de exibição de respostas (`mostrarResposta`)  
  - Organização e formatação de texto com suporte a listas, parágrafos, negrito, itálico e links  
  - Integração com histórico, exportação PDF/TXT e botões de copiar/limpar  
  - Melhorias no streaming de respostas da IA e scroll automático  

## 🤝 Como contribuir
1. Faça um **fork** do projeto.  
2. Crie uma **branch** para sua modificação:
   ```bash
   git checkout -b minha-feature
   ```
3. Salve as alterações e crie um **commit**:
   ```bash
   git commit -m "Minha nova feature"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um **Pull Request**.

---

## ✨ Inspirado por
Este projeto foi inspirado no propósito de usar tecnologia para facilitar o aprendizado. <br>
A ideia é criar soluções inteligentes que otimizem o tempo de estudo e tornem o processo mais produtivo e personalizado. <br>
Porque quem desenvolve com propósito... desenvolve melhor. 💖

---

> _"Compartilhar conhecimento é também espalhar cuidado."_  
> — Equipe Assistente de Estudos com IA

