const API_KEY = 'AIzaSyBclUX157X_IcpEgBCMycUfofdV7xGzsDo';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export async function sendQuestion(question) {
    try{ 
        const response = await fetch(`${API_URL}?key=${API_KEY}`, configJson(question));

        if(!response.ok) throw new Error(`Erro: ${response.status}`);
        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Resposta não encontrada';

    }catch(erro){
    console.error('Erro ao enviar pergunta: ', erro);
    return 'Erro na requisição.'
    }
}

function configJson(question) {
    return {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                    { text: question }
                    ] 
                }]
            })
    };
}