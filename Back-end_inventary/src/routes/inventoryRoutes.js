const express = require('express');
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/inventoryController');
const { upload } = require('../middlewares/uploadMiddleware');  // Importación corregida
const inventoryController = require('../controllers/inventoryController');

const router = express.Router();

router.get('/productos', getProducts);
router.get('/productos/:id', getProductById);
router.post('/productos', upload.single('imagen'), inventoryController.createProduct);  // Uso correcto del middleware upload
router.put('/productos/:id', updateProduct);
router.delete('/productos/:id', deleteProduct);

module.exports = router;

