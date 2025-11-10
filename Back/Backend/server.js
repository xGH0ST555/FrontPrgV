require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PORT = process.env.PORT || 3000;

(async () => {
  try {
  
    await pool.query('SELECT 1');
    console.log('Conectado a PostgreSQL');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error conectando a DB', err);
    process.exit(1);
  }
})();
