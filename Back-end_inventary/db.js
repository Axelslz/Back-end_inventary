const mysql = require('mysql2');

// Configuración de conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventarysystem',
  port: 3306
});

module.exports = connection;
