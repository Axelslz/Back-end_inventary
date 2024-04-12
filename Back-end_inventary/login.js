const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const cors = require('cors'); // Importa el middleware cors
const connection = require('./db')
const router = express.Router();


// Middleware para analizar el cuerpo de la solicitud como JSON
router.use(express.json());

// Agrega el middleware cors a todas las rutas
router.use(cors());

// Ruta de login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Realizar la consulta a la base de datos para encontrar el usuario
  connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results) => {
    if (error) {
      console.error('Error al buscar el usuario:', error);
      return res.status(500).json({ success: false, message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Validar la contraseña
    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (isMatch) {
      res.json({ success: true, message: 'Login exitoso' });
    } else {
      res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }
  });
});

module.exports = router;


