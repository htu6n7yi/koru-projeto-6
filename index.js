import { sendQuestion } from './services/api.js'; // ajuste o caminho se precisar

async function main() {
  const question = "Quais as linguagens de programação mais usadas na atualidade?";
  
  const response = await sendQuestion(question);
  
  console.log("Resposta da API:", response);
}

main();