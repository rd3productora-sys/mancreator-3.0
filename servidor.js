const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Inicialización directa con tu clave API configurada de forma segura
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PEGA_AQUI_TU_API_KEY_REAL' });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Por favor escribe un mensaje." });
        }

        // Llamada estable utilizando gemini-1.5-flash para evitar saturaciones
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Eres Mancreator, el asistente virtual y co-piloto experto en producción de televisión, eventos y licitaciones públicas en Chile. Trabajas codo a codo con M. A. Navarrete (Miguel Ángel Navarrete), ayudándole a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });

        // Respuesta segura y limpia
        const replyText = response.text || "¡Entendido! Vamos adelante con eso.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Error detallado en el servidor:", error);
        res.status(500).json({ reply: "Error de conexión con la IA: " + (error.message || error.toString()) });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
