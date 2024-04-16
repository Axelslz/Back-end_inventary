const mysql = require('mysql');
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventarysystem',
});

class Product {
  constructor(id, nombre, precio, cantidad, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
    this.imagen = imagen;
  }

  save(callback) {
    pool.query(
      'INSERT INTO productos (nombre, precio, cantidad, imagen) VALUES (?, ?, ?, ?)',
      [this.nombre, this.precio, this.cantidad, this.imagen],
      (error, results) => {
        if (error) return callback(error);
        callback(null, results.insertId); // Devuelve el ID del nuevo producto
      }
    );
  }

  // Aquí puedes añadir más métodos para interactuar con la base de datos
}

module.exports = Product;
