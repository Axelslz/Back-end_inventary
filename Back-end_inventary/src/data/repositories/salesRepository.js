const db = require('../database');

const createSale = async (idProducto, cantidad) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO Ventas (idProducto, cantidad) VALUES (?, ?)';
    db.query(query, [idProducto, cantidad], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve({ id: results.insertId, idProducto, cantidad });
      }
    });
  });
};

const updateSale = async (idVenta, nuevaCantidad) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE Ventas SET cantidad = ? WHERE id = ?';
    db.query(query, [nuevaCantidad, idVenta], (error, results) => {
      if (error) {
        reject(error);
      } else if (results.affectedRows === 0) {
        reject(new Error('Venta no encontrada o cantidad igual a la anterior.'));
      } else {
        resolve({ idVenta, nuevaCantidad });
      }
    });
  });
};

const getSalesHistory = async () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM Ventas';
    db.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  createSale,
  updateSale,
  getSalesHistory
};
