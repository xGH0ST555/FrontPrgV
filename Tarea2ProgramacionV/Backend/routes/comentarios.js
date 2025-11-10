const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/auth');
const { crearComentario, listarComentariosPorSitio } = require('../controllers/comentariosController');

router.post('/', verificarToken, crearComentario);
router.get('/sitio/:sitio_id', listarComentariosPorSitio);

module.exports = router;
