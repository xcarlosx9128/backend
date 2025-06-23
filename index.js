const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ruta raíz
app.get('/', (req, res) => {
  res.send('✅ API de Tienda Electrónica funcionando');
});


// =========================
// 🔹 CLIENTES
// =========================
app.get('/clientes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, telefono, fecha_registro FROM clientes ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

app.post('/clientes', async (req, res) => {
  const { nombre, email, telefono, password } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, telefono, fecha_registro`,
      [nombre, email, telefono, password]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al agregar cliente:', err.message);
    res.status(500).json({ error: 'Error al agregar cliente' });
  }
});


// =========================
// 🔹 PRODUCTOS
// =========================
app.get('/productos', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, nombre, descripcion, precio, stock, imagen_url, fecha_creacion
       FROM productos ORDER BY id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener productos:', err.message);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, descripcion, precio, stock, imagen_url]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al agregar producto:', err.message);
    res.status(500).json({ error: 'Error al agregar producto' });
  }
});


// =========================
// 🔹 SOLICITUDES (Servicio técnico)
// =========================
app.get('/solicitudes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.id, c.nombre AS cliente, s.producto, s.problema, s.fecha
       FROM solicitudes s
       JOIN clientes c ON s.cliente_id = c.id
       ORDER BY s.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error al obtener solicitudes:', err.message);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
});

app.post('/solicitudes', async (req, res) => {
  const { cliente_id, producto, problema } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO solicitudes (cliente_id, producto, problema)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [cliente_id, producto, problema]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error al agregar solicitud:', err.message);
    res.status(500).json({ error: 'Error al agregar solicitud' });
  }
});


// ✅ Puerto (Render usa process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en puerto ${PORT}`);
});
