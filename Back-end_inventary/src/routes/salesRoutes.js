const express = require('express');
const salesController = require('../controllers/salesController');
const router = express.Router();

router.get('/venta/:id', salesController.getSaleById);
router.put('/venta/:id', salesController.updateSale);
router.get('/historial', salesController.getSalesHistory);

module.exports = router;
