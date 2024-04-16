const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorHandler');
const authenticateToken = require('./middlewares/authenticateToken');
const logger = require('./middlewares/logger');

// Importa los routers de las diferentes partes de la aplicación
const authRoutes = require('./routes/authRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares básicos
app.use(cors()); 
app.use(express.json()); 
app.use(morgan('dev')); // Logger para ver las solicitudes en la consola
app.use(logger);

// Rutas
app.use('/auth', authRoutes); 

app.use('/inventory', inventoryRoutes); 
app.use('/sales', salesRoutes); // Autenticación necesaria para acceder a ventas

// Middleware de manejo de errores
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;

