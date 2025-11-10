const pool = require('../config/db');

async function listarSitios(req, res) {
  try {
    const result = await pool.query('SELECT * FROM SitioTuristico ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function verSitio(req, res) {
  try {
    const id = req.params.id;
    const result = await pool.query('SELECT * FROM SitioTuristico WHERE id=$1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'No encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function crearSitio(req, res) {
  try {
    const { nombre, ubicacion, descripcion, imagen } = req.body;
    const result = await pool.query(
      'INSERT INTO SitioTuristico (nombre, ubicacion, descripcion, imagen) VALUES ($1,$2,$3,$4) RETURNING *',
      [nombre, ubicacion, descripcion, imagen]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function actualizarSitio(req, res) {
  try {
    const id = req.params.id;
    const { nombre, ubicacion, descripcion, imagen } = req.body;
    await pool.query(
      'UPDATE SitioTuristico SET nombre=$1, ubicacion=$2, descripcion=$3, imagen=$4 WHERE id=$5',
      [nombre, ubicacion, descripcion, imagen, id]
    );
    res.json({ message: 'Actualizado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

async function eliminarSitio(req, res) {
  try {
    const id = req.params.id;
    await pool.query('DELETE FROM SitioTuristico WHERE id=$1', [id]);
    res.json({ message: 'Eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error' });
  }
}

module.exports = { listarSitios, verSitio, crearSitio, actualizarSitio, eliminarSitio };
