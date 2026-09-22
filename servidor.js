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

        // Usamos el modelo exacto que solicita Google en el mensaje de error
        const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: [
                {
                    role: 'user',
                    parts: [{ text: userMessage }]
                }
            ],
            config: {
                systemInstruction: "Eres M. A. Navarrete (Miguel Ángel Navarrete), asistente experto en producción de televisión, eventos y licitaciones públicas en Chile. Ayudas a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });

        const replyText = response.text || "Respuesta generada correctamente.";
        res.json({ reply: replyText });

    } catch (error) {
        console.error("Error detallado al conectar con Gemini:", error);
        res.status(500).json({ reply: "Error al conectar con Gemini: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
