import { inicializarFormulario } from "./components/formPergunta.js";
import { inicializarAcoesResposta, mostrarResposta } from "./components/resultadoIA.js";
import { sendQuestion } from "./services/api.js";

inicializarFormulario(sendQuestion);
inicializarAcoesResposta();
mostrarResposta("Sua resposta será exibida aqui");
