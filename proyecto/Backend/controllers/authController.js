const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function register(req, res) {
  const { nombre, correo, contrasena, rol } = req.body;
  if (!nombre || !correo || !contrasena) return res.status(400).json({ message: 'Faltan datos' });

  try {
    const hashed = await bcrypt.hash(contrasena, 10);
    const sql = 'INSERT INTO Usuario (nombre, correo, contrasena, rol) VALUES ($1,$2,$3,$4) RETURNING id, nombre, correo, rol';
    const result = await pool.query(sql, [nombre, correo, hashed, rol || 'cliente']);
    res.json({ message: 'Usuario registrado', user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Correo ya registrado' });
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

async function login(req, res) {
  const { correo, contrasena } = req.body;
  if (!correo || !contrasena) return res.status(400).json({ message: 'Faltan datos' });

  try {
    const result = await pool.query('SELECT * FROM Usuario WHERE correo=$1', [correo]);
    if (result.rows.length === 0) return res.status(401).json({ message: 'Usuario no encontrado' });

    const user = result.rows[0];
    const valid = await bcrypt.compare(contrasena, user.contrasena);
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '4h' });
    res.json({ token, rol: user.rol, nombre: user.nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error en servidor' });
  }
}

module.exports = { register, login };
