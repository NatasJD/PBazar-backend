const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de MySQL (XAMPP)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // XAMPP por defecto no tiene contraseña
  database: 'pbazar_db'
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
