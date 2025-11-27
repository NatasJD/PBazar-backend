require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a la Base de Datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Error conectando a la BD:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// --- ENDPOINTS ---

// 1. LOGIN
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    // NOTA: En producción, usar bcrypt para comparar contraseñas encriptadas
    const sql = 'SELECT * FROM usuarios WHERE username = ? AND password = ?';
    
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            const user = results[0];
            res.json({ 
                success: true, 
                user: { id: user.id, username: user.username, rol: user.rol, nombre: user.nombre_completo } 
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        }
    });
});

// 2. BUSCAR PRODUCTO (Por código)
app.get('/api/productos/:codigo', (req, res) => {
    const { codigo } = req.params;
    db.query('SELECT * FROM productos WHERE codigo = ?', [codigo], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    });
});

// 3. REGISTRAR VENTA
app.post('/api/ventas', (req, res) => {
    const { tipo_documento, vendedor_id, productos, cliente } = req.body;
    
    // Calcular totales en el backend (más seguro)
    let totalNeto = 0;
    productos.forEach(p => {
        totalNeto += p.precio_unitario * p.cantidad;
    });
    
    const totalIVA = Math.round(totalNeto * 0.19);
    const totalVenta = totalNeto + totalIVA;

    // Iniciar transacción (para asegurar que se guarde todo o nada)
    db.beginTransaction(err => {
        if (err) return res.status(500).json(err);

        // Insertar Venta
        const sqlVenta = `INSERT INTO ventas (tipo_documento, total_neto, total_iva, total_venta, vendedor_id, cliente_rut, cliente_razon_social, cliente_giro, cliente_direccion) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const clienteData = cliente || {}; // Si no hay cliente, objeto vacío
        
        db.query(sqlVenta, [tipo_documento, totalNeto, totalIVA, totalVenta, vendedor_id, clienteData.rut, clienteData.razon_social, clienteData.giro, clienteData.direccion], (err, result) => {
            if (err) {
                return db.rollback(() => res.status(500).json(err));
            }

            const ventaId = result.insertId;
            
            // Preparar datos para insertar detalles
            const detalles = productos.map(p => [ventaId, p.codigo, p.cantidad, p.precio_unitario, p.precio_unitario * p.cantidad]);
            
            const sqlDetalle = 'INSERT INTO detalle_ventas (venta_id, producto_codigo, cantidad, precio_unitario, subtotal) VALUES ?';
            
            db.query(sqlDetalle, [detalles], (err) => {
                if (err) {
                    return db.rollback(() => res.status(500).json(err));
                }

                // Actualizar Stock (Opcional pero recomendado)
                // Aquí se podría hacer un loop o queries múltiples para restar stock
                
                db.commit(err => {
                    if (err) {
                        return db.rollback(() => res.status(500).json(err));
                    }
                    res.json({ success: true, message: 'Venta registrada', ventaId });
                });
            });
        });
    });
});

// 4. CONTROL DÍA (Verificar estado)
app.get('/api/dia/estado', (req, res) => {
    // Busca el último registro del día de hoy
    const sql = "SELECT * FROM control_dia WHERE fecha = CURDATE() ORDER BY id DESC LIMIT 1";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ estado: 'Cerrado' }); // Si no hay registro, asumimos cerrado
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
