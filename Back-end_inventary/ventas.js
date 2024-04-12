const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const connection = require('./db'); // Importar la conexión a la base de datos desde otro archivo

// Ruta para registrar una venta
router.post('/ventas', (req, res) => {
  const { idProducto, cantidad } = req.body;
  if (!idProducto || !cantidad) {
    return res.status(400).json({ error: 'Por favor, proporcione el ID del producto y la cantidad vendida.' });
  }

  connection.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar la transacción:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Obtener la información del producto
    connection.query('SELECT cantidad FROM Productos WHERE id = ?', [idProducto], (error, results) => {
      if (error) {
        console.error('Error al obtener la cantidad del producto:', error);
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error interno del servidor' });
        });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const cantidadDisponible = results[0].cantidad;

      if (cantidad > cantidadDisponible) {
        return res.status(400).json({ error: 'La cantidad vendida supera la cantidad disponible en el inventario.' });
      }

      // Registrar la venta
      connection.query('INSERT INTO Ventas (idProducto, cantidad) VALUES (?, ?)', [idProducto, cantidad], (error, results) => {
        if (error) {
          console.error('Error al registrar la venta:', error);
          return connection.rollback(() => {
            res.status(500).json({ error: 'Error interno del servidor' });
          });
        }

        // Actualizar la cantidad disponible del producto
        const nuevaCantidad = cantidadDisponible - cantidad;
        connection.query('UPDATE Productos SET cantidad = ? WHERE id = ?', [nuevaCantidad, idProducto], (error, results) => {
          if (error) {
            console.error('Error al actualizar la cantidad del producto:', error);
            return connection.rollback(() => {
              res.status(500).json({ error: 'Error interno del servidor' });
            });
          }

          connection.commit((err) => {
            if (err) {
              console.error('Error al confirmar la transacción:', err);
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error interno del servidor' });
              });
            }

            res.json({ message: 'Venta registrada exitosamente.' });
          });
        });
      });
    });
  });
});

// Ruta para actualizar una venta existente
router.put('/ventas/:id', (req, res) => {
  const { cantidad } = req.body;
  const idVenta = req.params.id;

  if (!cantidad) {
    return res.status(400).json({ error: 'Por favor, proporcione la nueva cantidad vendida.' });
  }

  // Verifica primero que la venta exista
  connection.query('SELECT * FROM Ventas WHERE id = ?', [idVenta], (error, results) => {
    if (error) {
      console.error('Error al obtener la venta:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Venta no encontrada' });
    }

    // Si la venta existe, actualiza la cantidad
    connection.query('UPDATE Ventas SET cantidad = ? WHERE id = ?', [cantidad, idVenta], (error, results) => {
      if (error) {
        console.error('Error al actualizar la venta:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Venta no encontrada' });
      }

      res.json({ message: 'Venta actualizada exitosamente', id: idVenta, nuevaCantidad: cantidad });
    });
  });
});

// Ruta para obtener el historial de ventas
router.get('/ventas', (req, res) => {
  connection.query('SELECT * FROM Ventas', (error, results) => {
    if (error) {
      console.error('Error al obtener el historial de ventas:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json(results);
  });
});


module.exports = router;
