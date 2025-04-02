import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

// Permitir CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Endpoint para verificar el estado de un video
app.get('/check-video', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Falta el parámetro 'url'" });
  
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Analizamos el HTML recibido buscando mensajes de error
    if (
      response.status !== 200 ||
      text.includes("Video not found!") ||
      text.includes("Maybe it got deleted by the creator") ||
      text.includes("file does not exist") ||
      text.includes("File was deleted")
    ) {
      return res.json({ estado: "❌ Caído" });
    } else {
      return res.json({ estado: "✅ Activo" });
    }
  } catch (error) {
    return res.json({ estado: "❌ Caído", error: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Servidor de verificación corriendo en http://localhost:${port}`);
});
