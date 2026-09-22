const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Usamos tu clave de entorno o puedes pegarla fija entre comillas si prefieres
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PEGA_AQUI_TU_API_KEY_SI_LA_USAS_FIJA' });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ reply: "Por favor escribe un mensaje." });
        }

        // Usamos únicamente el modelo estable gemini-1.5-flash que es el que responde perfecto
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Eres M. A. Navarrete (Miguel Ángel Navarrete), asistente experto en producción de televisión, eventos y licitaciones públicas en Chile. Ayudas a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });

        res.json({ reply: response.text });

    } catch (error) {
        console.error("Error crítico:", error);
        res.status(500).json({ reply: "Error al conectar: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
