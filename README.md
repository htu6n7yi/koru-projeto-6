# 📚 Assistente de Estudos com IA

Este projeto é uma aplicação web desenvolvida em grupo como parte dos desafios propostos pela tutora Luara Kerlen. <br> 
Trata-se de um assistente de estudos com integração de Inteligência Artificial, que ajuda estudantes a tirar dúvidas, gerar resumos, <br> organizar rotinas e acompanhar o histórico de perguntas e respostas — com recursos como favoritos, personalização de interface e consumo de API de IA.

> Trabalhar em grupo foi essencial para unir diferentes habilidades e transformar ideias individuais em uma solução completa e funcional. 🚀

🔗 **Acesse o projeto:** [https://koru-projeto-6.vercel.app/](https://koru-projeto-6.vercel.app/)

---

## 🚀 Funcionalidades
- Envio de perguntas para API de IA e exibição de respostas formatadas.
- Histórico de perguntas e respostas armazenado localmente.
- Sistema de favoritos ⭐/☆ para salvar respostas importantes.
- Modo claro/escuro com alternância via botão.
- Loader animado durante requisições.
- Botões para **copiar** e **limpar** respostas.
- Layout responsivo para diferentes tamanhos de tela.

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

---

## 🎥 Demonstração

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

#### 🔹 Estruturação HTML e Layout  
- **Renata Rocha** ([RenataARocha](https://github.com/RenataARocha))  
  - Estrutura inicial do projeto (`index.html`) com HTML semântico e SEO básico  
  - Estilos principais (`style.css`) e responsividade (`responsive.css`)  
  - Layout completo da aplicação (configurações, formulário, resposta, histórico e footer)  
  - Implementação de botão de alternância claro/escuro no design  
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

---

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

