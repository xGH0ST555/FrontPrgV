const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();


const authRoutes = require('./routes/auth');
const sitiosRoutes = require('./routes/sitios');
const comentariosRoutes = require('./routes/comentarios');
const calificacionesRoutes = require('./routes/calificaciones');

app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/sitios', sitiosRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/calificaciones', calificacionesRoutes);

module.exports = app;
