const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { crearOModificarCalificacion, listarCalificacionesSitio } = require('../controllers/calificacionesController');

router.post('/', verificarToken, crearOModificarCalificacion);
router.get('/sitio/:sitio_id', listarCalificacionesSitio);

module.exports = router;
