const express = require('express');
const multer = require('multer');
const router = express.Router();
const mysql = require('mysql2');
const fs = require('fs');
const app = express();
const ventasRoutes = require('./ventas');
const connection = require('./db')


// Asegúrate de que el directorio de uploads exista
const uploadDir = './uploads'; 
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({ storage: storage });

// Establecer conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error de conexión a la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Middleware para analizar el cuerpo de la solicitud como JSON
router.use(express.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'))

// Rutas para las operaciones CRUD relacionadas con el inventario

// Obtener lista de todos los productos
router.get('/productos', (req, res) => {
  connection.query('SELECT * FROM Productos', (error, results) => {
    if (error) throw error;
    res.json(results);
  });
});

// Obtener un producto específico por id
router.get('/productos/:id', (req, res) => {
  connection.query('SELECT * FROM Productos WHERE id = ?', [req.params.id], (error, results) => {
    if (error) throw error;
    res.json(results[0]);
  });
});

// Agregar un nuevo producto con imagen
router.post('/productos', upload.single('imagen'), (req, res) => {
  const { nombre, precio, cantidad } = req.body;
  const imagen = req.file ? req.file.filename : ''; 

  if (!nombre || !precio || !cantidad) {
    return res.status(400).json({ error: 'Por favor, proporcione nombre, precio y cantidad para el producto.' });
  }
  connection.query(
    'INSERT INTO Productos (nombre, precio, cantidad, imagen) VALUES (?, ?, ?, ?)',
    [nombre, precio, cantidad, imagen],
    (error, results) => {
      if (error) {
        console.error('Error al insertar el producto:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
      res.status(201).json({ id: results.insertId, nombre, precio, cantidad, imagen });
    },
  );
});

// Actualizar un producto existente y registrar una venta si la cantidad disminuye
router.put('/productos/:id', (req, res) => {
  const { nombre, precio, cantidad } = req.body;

  if (!nombre && !precio && !cantidad) {
    return res.status(400).json({ error: 'Por favor, proporcione al menos uno de los campos para actualizar el producto' });
  }

  connection.beginTransaction((err) => {
    if (err) {
      console.error('Error al iniciar la transacción:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    // Primero verifica la cantidad actual del producto
    connection.query('SELECT cantidad FROM Productos WHERE id = ?', [req.params.id], (error, results) => {
      if (error || results.length === 0) {
        console.error('Error al obtener el producto:', error);
        return connection.rollback(() => {
          res.status(500).json({ error: 'Error interno del servidor' });
        });
      }

      const cantidadActual = results[0].cantidad;
      let nuevaCantidad = cantidadActual;

      if (cantidad) {
        nuevaCantidad = cantidad;
      }

      // Si la nueva cantidad es menor que la actual, registra una venta
      if (cantidad && cantidad < cantidadActual) {
        connection.query(
          'INSERT INTO Ventas (idProducto, cantidad) VALUES (?, ?)',
          [req.params.id, cantidadActual - cantidad],
          (error, results) => {
            if (error) {
              console.error('Error al registrar la venta:', error);
              return connection.rollback(() => {
                res.status(500).json({ error: 'Error interno del servidor al registrar la venta' });
              });
            }
          }
        );
      }

      // Actualiza el producto en la base de datos
      const updateQuery = `UPDATE Productos SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?`;
      connection.query(updateQuery, [nombre, precio, nuevaCantidad, req.params.id], (error, results) => {
        if (error) {
          console.error('Error al actualizar el producto:', error);
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

          res.json({ message: 'Producto actualizado y venta registrada (si es necesario)', id: req.params.id });
        });
      });
    });
  });
});



// Eliminar un producto
router.delete('/productos/:id', (req, res) => {
  connection.query('DELETE FROM Productos WHERE id = ?', [req.params.id], (error, results) => {
    if (error) {
      console.error('Error al eliminar el producto:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    res.json({ message: 'Producto eliminado', id: req.params.id });
  });
});

router.use(ventasRoutes);

module.exports = router;
