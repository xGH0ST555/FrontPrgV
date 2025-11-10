const pool = require('../config/db');

async function crearComentario(req, res) {
  try {
    const usuario_id = req.user.id;
    const { sitio_id, comentario } = req.body;
    if (!sitio_id || !comentario) return res.status(400).json({ message: 'Faltan datos' });

    const result = await pool.query(
      'INSERT INTO Comentario (usuario_id, sitio_id, comentario) VALUES ($1,$2,$3) RETURNING *',
      [usuario_id, sitio_id, comentario]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function listarComentariosPorSitio(req, res) {
  try {
    const sitio_id = req.params.sitio_id;
    const result = await pool.query(
      `SELECT c.*, u.nombre as usuario_nombre 
       FROM Comentario c JOIN Usuario u ON c.usuario_id = u.id
       WHERE c.sitio_id = $1
       ORDER BY c.fecha DESC`,
      [sitio_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

module.exports = { crearComentario, listarComentariosPorSitio };
