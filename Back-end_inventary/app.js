const express = require('express');
const cors = require('cors');
const loginRoutes = require('./login');
const inventarioRoutes = require('./inventario');
const ventasRoutes = require('./ventas'); // Importar las rutas de ventas

const app = express();
const PORT = process.env.PORT || 3000; // o cualquier otro puerto que desees utilizar

// Middleware para habilitar CORS
app.use(cors());

// Usar las rutas en la aplicación
app.use('/login', loginRoutes);
app.use('/inventario', inventarioRoutes);
app.use('/ventas', ventasRoutes); // Usar las rutas de ventas

app.listen(PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${PORT}`);
});

