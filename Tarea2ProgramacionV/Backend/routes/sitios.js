const express = require('express');
const router = express.Router();
const { verificarToken, soloRoles } = require('../middlewares/auth');
const { listarSitios, verSitio, crearSitio, actualizarSitio, eliminarSitio } = require('../controllers/sitiosController');

router.get('/', listarSitios);
router.get('/:id', verSitio);


router.post('/', verificarToken, soloRoles('admin','guia'), crearSitio);


router.put('/:id', verificarToken, soloRoles('admin'), actualizarSitio);
router.delete('/:id', verificarToken, soloRoles('admin'), eliminarSitio);

module.exports = router;
