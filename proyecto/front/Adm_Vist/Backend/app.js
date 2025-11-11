// app.js
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: "clave-secreta", resave: false, saveUninitialized: true }));

// Servir archivos estáticos desde la carpeta 'public' (o donde esté tu index.html)
app.use(express.static(path.join(__dirname, "Adm_reg")));

// Lista de 3 administradores predefinidos
const admins = [
  { user: "Geiler", pass: "1234" },
  { user: "admin2", pass: "5678" },
  { user: "admin3", pass: "abcd" }
];

// Página de login
app.get("/admins", (req, res) => {
  res.send(`
    <h2>Login Administradores</h2>
    <form method="POST" action="/login">
      <input type="text" name="user" placeholder="Usuario" required/><br/>
      <input type="password" name="pass" placeholder="Contraseña" required/><br/>
      <button type="submit">Ingresar</button>
    </form>
  `);
});

// Validación
app.post("/login", (req, res) => {
  const { user, pass } = req.body;
  const admin = admins.find(a => a.user === user && a.pass === pass);

  if (admin) {
    req.session.user = admin.user;
    res.send(`<h2>Bienvenido ${admin.user}</h2><a href="/logout">Cerrar sesión</a>`);
  } else {
    res.send("<h2>Usuario o contraseña incorrectos</h2><a href='/'>Volver</a>");
  }
});

// Cerrar sesión
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});



