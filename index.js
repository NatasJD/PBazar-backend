require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de MySQL desde variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'bazar_user',
  password: process.env.DB_PASSWORD || 'ChupaloKarolDance123',
  database: process.env.DB_NAME || 'pbazar_db',
  port: process.env.DB_PORT || 3306
});

// Conectar a MySQL
db.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API PBazar Backend funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
