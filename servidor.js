const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// Inicializamos la IA pasando tu clave directamente (reemplaza 'TU_API_KEY_AQUI' por tu clave real si no usas variable de entorno)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'TU_API_KEY_AQUI' });

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message || "Hola";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: userMessage,
            config: {
                systemInstruction: "Eres M. A. Navarrete (Miguel Ángel Navarrete), asistente experto en producción de televisión, eventos y licitaciones públicas en Chile. Ayudas a estructurar propuestas, evitar errores administrativos fatales y organizar proyectos como Kidsabadá y El Canal Feliz."
            }
        });

        // Aseguramos capturar la respuesta correctamente según la estructura del SDK
        const replyText = response.text || (response.candidates && response.candidates[0]?.content?.parts[0]?.text) || "Respuesta generada con éxito.";
        
        res.json({ reply: replyText });
    } catch (error) {
        console.error("Error completo en el servidor:", error);
        res.status(500).json({ reply: "Error al conectar con Gemini: " + error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor activo en puerto ${PORT}`));
