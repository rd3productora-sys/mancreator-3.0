const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Reemplaza 'PEGA_AQUI_TU_API_KEY' por tu clave real de Gemini entre comillas si la prefieres fija
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'PEGA_AQUI_TU_API_KEY' });

app.post('/api/chat', async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: req.body.message,
            config: {
                systemInstruction: "Eres M. A. Navarrete (Miguel Ángel Navarrete), asistente experto en producción de televisión, eventos y licitaciones públicas en Chile. Ayudas a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });
        res.json({ reply: response.text });
    } catch (error) {
        console.error("Error detallado de IA:", error);
        res.status(500).json({ reply: "Error de conexión con la IA. Verifica que tu API Key sea válida." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
