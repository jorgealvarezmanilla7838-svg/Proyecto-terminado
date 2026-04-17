const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Servir archivos estáticos (Frontend)
// Esto asegura que Render encuentre tu index.html, script.js, etc.
app.use(express.static(path.join(__dirname, 'frontend')));

// Datos temporales (Se reinician al desplegar o reiniciar el server)
let usuarios = [
    { nombre: "Juan", apellidos: "Pérez", email: "paciente@test.com", pass: "user123", role: "paciente" }
];
let citas = [
    { id: 1, nombre: "Juan Pérez", fecha: "2026-04-20 10:30", emergencia: "Contacto en expediente" }
];

// --- RUTAS DE LA API ---

// Login
app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    if (email === "admin@nefro.com" && pass === "admin123") {
        return res.json({ role: 'admin', nombre: 'Secretaria General' });
    }
    const user = usuarios.find(u => u.email === email && u.pass === pass);
    if (user) {
        res.json({ role: 'paciente', nombre: user.nombre });
    } else {
        res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
});

// Registro
app.post('/api/registro', (req, res) => {
    usuarios.push({ ...req.body, role: 'paciente' });
    res.json({ success: true });
});

// Obtener Citas
app.get('/api/citas', (req, res) => res.json(citas));

// Crear Citas
app.post('/api/citas', (req, res) => {
    citas.push(req.body);
    res.json({ success: true });
});

// 2. RUTA PRINCIPAL (Importante para que cargue la web al entrar al link)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// 3. PUERTO DINÁMICO (Obligatorio para Render)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
