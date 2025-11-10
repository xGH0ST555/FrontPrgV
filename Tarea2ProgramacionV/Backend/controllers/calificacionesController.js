const pool = require('../config/db');

async function crearOModificarCalificacion(req, res) {
  try {
    const usuario_id = req.user.id;
    const { sitio_id, puntuacion } = req.body;
    if (!sitio_id || !puntuacion) return res.status(400).json({ message: 'Faltan datos' });

    const up = await pool.query(
      'UPDATE Calificacion SET puntuacion=$1, fecha=NOW() WHERE usuario_id=$2 AND sitio_id=$3 RETURNING *',
      [puntuacion, usuario_id, sitio_id]
    );
    if (up.rows.length > 0) return res.json(up.rows[0]);

   
    const ins = await pool.query(
      'INSERT INTO Calificacion (usuario_id, sitio_id, puntuacion) VALUES ($1,$2,$3) RETURNING *',
      [usuario_id, sitio_id, puntuacion]
    );
    res.status(201).json(ins.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ message: 'Ya existe calificación' });
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function listarCalificacionesSitio(req, res) {
  try {
    const sitio_id = req.params.sitio_id;
    const result = await pool.query(
      'SELECT COUNT(*)::int as total, AVG(puntuacion)::numeric(3,2) as promedio FROM Calificacion WHERE sitio_id=$1',
      [sitio_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

module.exports = { crearOModificarCalificacion, listarCalificacionesSitio };
