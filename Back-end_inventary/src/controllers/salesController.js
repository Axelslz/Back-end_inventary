const salesService = require('../services/salesService');

const recordSale = async (req, res) => {
    const { idProducto, cantidad } = req.body;
    
    try {
        const result = await salesService.recordSale(idProducto, cantidad);
        res.json({ message: 'Venta registrada exitosamente.', result });
    } catch (error) {
        console.error('Error al registrar la venta:', error);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const updateSale = async (req, res) => {
    const { cantidad } = req.body;
    const idVenta = req.params.id;

    try {
        const updatedSale = await salesService.updateSale(idVenta, cantidad);
        res.json({ message: 'Venta actualizada exitosamente', updatedSale });
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

const getSalesHistory = async (req, res) => {
    try {
        const salesHistory = await salesService.getSalesHistory();
        res.json(salesHistory);
    } catch (error) {
        console.error('Error al obtener el historial de ventas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getSaleById = async (req, res) => {
    try {
        const sale = await salesService.getSaleById(req.params.id);
        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json(sale);
    } catch (error) {
        console.error('Error al obtener la venta:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports = {
    recordSale,
    updateSale,
    getSalesHistory,
    getSaleById
};
