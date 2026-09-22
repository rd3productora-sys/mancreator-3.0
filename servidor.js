const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const ai = new GoogleGenAI({ apiKey: 'AIzaSyDTp8p_q51p62wPzQZgY54Z_xxxxxxx' });

app.post('/api/chat', async (req, res) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: req.body.message,
            config: {
                systemInstruction: "Eres M. A. Navarrete (Miguel Ángel Navarrete), asistente experto en producción de televisión, eventos y licitaciones públicas en Chile. Ayudas a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });
        res.json({ reply: response.text });
    } catch (error) {
        res.status(500).json({ reply: "Error de conexión con la IA. Revisa la API Key." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
