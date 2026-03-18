export default async function handler(req, res) {
    // Permite apenas método GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const name = req.query.name || 'amigo';
    
    // Texto do prompt
    const text = `Olá ${name}. Agora você pode se sentar confortavelmente, relaxar os ombros e respirar profundamente. Este é o início do seu protocolo de hoje. Permita que sua mente desacelere enquanto você se prepara para essa experiência.`;

    try {
        // Chamada direta para a API da OpenAI (Text-to-Speech)
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'tts-1',
                input: text,
                voice: 'onyx' // Voz 'onyx' é masculina, grave e relaxante (perfeita para meditação). Pode trocar por 'nova' ou 'alloy'.
            })
        });

        if (!response.ok) {
            throw new Error('Falha ao gerar o áudio na OpenAI');
        }

        // Converte o arquivo de áudio recebido em Base64
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Audio = buffer.toString('base64');
        
        // Formata como Data URL para tocar direto no frontend
        const audioUrl = `data:audio/mp3;base64,${base64Audio}`;

        // Retorna o JSON com a URL
        return res.status(200).json({ audioUrl });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
}
