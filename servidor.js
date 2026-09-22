const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Inicializamos el cliente de la IA
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PEGA_AQUI_TU_API_KEY_SI_LA_USAS_FIJA' });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Por favor escribe un mensaje." });
        }

        // Llamada al modelo con la identidad correcta de Mancreator asistiendo a M. A. Navarrete
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Eres Mancreator, el asistente virtual y co-piloto experto en producción de televisión, eventos y licitaciones públicas en Chile. Trabajas codo a codo con M. A. Navarrete (Miguel Ángel Navarrete), ayudándole a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });

        // Extracción segura del texto de respuesta
        let replyText = "¡Entendido! Vamos adelante con eso.";
        if (response && response.text) {
            replyText = response.text;
        } else if (response && response.candidates && response.candidates[0]?.content?.parts[0]?.text) {
            replyText = response.candidates[0].content.parts[0].text;
        }

        res.json({ reply: replyText });

    } catch (error) {
        console.error("Error detallado en el servidor:", error);
        res.status(500).json({ reply: "Error interno del servidor: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
