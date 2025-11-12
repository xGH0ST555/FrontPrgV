const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');



require('dotenv').config();

router.post('/register', async (req, res) => {
  try {
    // Extraer 'contrasena' del body, no 'password'
    const { nombre, correo, contrasena, rol } = req.body;
    // Usar la variable 'contrasena' para el hash
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO turistico.usuario (nombre, correo, contrasena, rol)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, correo, rol
    `;
    const result = await pool.query(query, [nombre, correo, hashedPassword, rol || 'cliente']);
    res.status(201).json(result.rows[0]);
  }catch (error) {
  console.error('Error detallado al registrar usuario:', error.message);
  res.status(500).json({ error: error.message });
}
});


router.post('/login', async (req, res) => {
  try {
   
    const { correo, contrasena } = req.body;

    const userQuery = await pool.query(`SELECT * FROM turistico.usuario WHERE correo = $1`, [correo]);
    const user = userQuery.rows[0];

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasena);
    if (!passwordMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Inicio de sesión exitoso', token });
  }catch (error) {
  console.error('Error detallado en login:', error.message);
  res.status(500).json({ error: error.message });
}

});

module.exports = router;

