const db = require('../database');

const findAll = async () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Productos', (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const findById = async (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM Productos WHERE id = ?', [id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results[0]);
      }
    });
  });
};

const create = async ({ nombre, precio, cantidad, imagen }) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO Productos (nombre, precio, cantidad, imagen) VALUES (?, ?, ?, ?)',
      [nombre, precio, cantidad, imagen],
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve({ id: results.insertId, nombre, precio, cantidad, imagen });
        }
      }
    );
  });
};

const update = async (id, { nombre, precio, cantidad }) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE Productos SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';
    db.query(query, [nombre, precio, cantidad, id], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve({ id, nombre, precio, cantidad });
      }
    });
  });
};

const deleteProduct = async (id) => {
    return new Promise((resolve, reject) => {
      db.query('DELETE FROM Productos WHERE id = ?', [id], (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.affectedRows > 0);
        }
      });
    });
  };
  
  module.exports = {
    findAll,
    findById,
    create,
    update,
    deleteProduct  
  };
