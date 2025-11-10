const jwt = require('jsonwebtoken');
require('dotenv').config();

function verificarToken(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(403).json({ message: 'Token requerido' });

 
  const token = header.startsWith('Bearer ') ? header.split(' ')[1] : header;

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    req.user = decoded; // { id, rol, iat, exp }
    next();
  });
}

function soloRoles(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado' });
    }
    next();
  };
}

module.exports = { verificarToken, soloRoles };
