import express from "express"; 
import cors from "cors"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import pool from "./db.js"; 
import multer from "multer"; 
import { GoogleGenAI } from "@google/genai"; 

const app = express(); 
app.use(cors()); 
app.use(express.json()); 

const ai = new GoogleGenAI({ apiKey: "" }); 
const SECRET = "puedesercualquiercontraseña"; 

// Middleware para verificar JWT 
function verifyToken(req, res, next) { 
  const authHeader = req.headers["authorization"]; 
  if (!authHeader) return res.status(401).json({ message: "Token requerido" }); 

  const parts = authHeader.split(" "); 
  if (parts.length !== 2 || parts[0] !== "Bearer") 
    return res.status(403).json({ message: "Formato de token inválido" }); 

  const token = parts[1]; 
  jwt.verify(token, SECRET, (err, decoded) => { 
    if (err) return res.status(403).json({ message: "Token inválido" }); 
    req.user = decoded; 
    next(); 
  }); 
} 

// Registro 
app.post("/api/register", async (req, res) => { 
  try { 
    const { usuario, correo, password } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); 

    await pool.query( 
      "INSERT INTO usuario (usuario, mail, password) VALUES (?, ?, ?)", 
      [usuario, correo, hashedPassword] 
    ); 

    res.json({ message: "Usuario registrado con éxito" }); 

  } catch (err) { 
    if (err.code === "ER_DUP_ENTRY") 
      return res.status(400).json({ message: "El usuario ya existe" }); 

    res.status(500).json({ 
      message: "COMPROBACION", 
      error: err.sqlMessage || err.message 
    }); 
  } 
}); 

// Login 
app.post("/api/login", async (req, res) => { 
  try { 
    const { usuario, password } = req.body; 

    const [rows] = await pool.query( 
      "SELECT * FROM usuario WHERE usuario = ?", 
      [usuario] 
    ); 

    if (rows.length === 0) 
      return res.status(400).json({ message: "Usuario no encontrado" }); 

    const user = rows[0]; 
    const validPass = await bcrypt.compare(password, user.password); 

    if (!validPass) 
      return res.status(400).json({ message: "Contraseña incorrecta" }); 

    // Token 
    const token = jwt.sign( 
      { id: user.id, usuario: user.usuario, correo: user.mail }, 
      SECRET, 
      { expiresIn: "2h" } 
    ); 

    res.json({ message: "Login exitoso", token }); 

  } catch (err) { 
    res.status(500).json({ message: "Error en el servidor" }); 
  } 
}); 

// Gemini 
const storage = multer.memoryStorage(); 
const upload = multer({ storage }); 

function cleanGeminiResponse(text) { 
  return text 
    .replace(/```javascript|```js|```/g, "") 
    .trim(); 
} 

app.post("/api/analyze-pdf", verifyToken, upload.single("pdfFile"), async (req, res) => { 
  try { 
    if (!req.file) 
      return res.status(400).json({ error: "No se subió ningún archivo PDF." }); 

    console.log("Archivo recibido:", req.file.originalname); 

    const pdfBase64 = req.file.buffer.toString("base64"); 

    const prompt = ` 
      A partir del contenido del PDF, responde ÚNICAMENTE con código JavaScript válido. 
      No incluyas explicaciones, ni texto adicional, ni comillas de plantilla. 

      Genera las siguientes constantes: 

      juego1: arreglo con [palabraClave, pista] - NO INCLUYAS ACENTOS 
      juego2: arreglo de 8 palabras clave - NO INCLUYAS NUMEROS 
      juego3: matriz 8x2 con [[palabra, pista], ...] - NO INCLUYAS NUMEROS, PALABRAS DE MAXIMO 9 
      juego4: arreglo donde el primer valor es un párrafo completo y los siguientes 5 valores 
      son 5 palabras clave dentro del párrafo 

      Formato: 
      const juego1 = [...]; 
      const juego2 = [...]; 
      const juego3 = [...]; 
      const juego4 = [...]; 
    `; 

    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash", 
      contents: [ 
        { 
          role: "user", 
          parts: [ 
            { text: prompt }, 
            { 
              inlineData: { 
                mimeType: "application/pdf", 
                data: pdfBase64, 
              }, 
            }, 
          ], 
        }, 
      ], 
    }); 

    let geminiRaw = response.candidates[0].content.parts[0].text; 

    const cleaned = cleanGeminiResponse(geminiRaw); 

    const scope = {}; 
    const fn = new Function( 
      "scope", 
      `"use strict"; ${cleaned}; Object.assign(scope,{juego1,juego2,juego3,juego4});` 
    ); 

    fn(scope); 

    const finalData = { 
      ahorcado: scope.juego1, 
      sopaDeLetras: scope.juego2, 
      crucigrama: scope.juego3, 
      completarFrase: scope.juego4, 
    }; 

    console.log("Ahorcado:", scope.juego1); 
    console.log("Sopa de letras:", scope.juego2); 
    console.log("Crucigrama:", scope.juego3); 
    console.log("Completar frase:", scope.juego4); 

    return res.status(200).json(finalData); 

  } catch (error) { 
    console.error("ERROR GENERAL:", error); 
    const msg = error?.body?.error?.message || error.message; 
    return res.status(500).json({ 
      error: "Error procesando la solicitud.", 
      detalle: msg 
    }); 
  } 
}); 

// Iniciar 
app.listen(3000, () => 
  console.log("API escuchando en http://localhost:3000") 
);
