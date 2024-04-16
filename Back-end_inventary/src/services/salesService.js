const salesRepository = require('../data/repositories/salesRepository');
const inventoryService = require('./inventoryService'); // Asegúrate de importar el inventoryService

const recordSale = async (idProducto, cantidad) => {
  // Verificar disponibilidad del producto antes de grabar la venta
  const producto = await inventoryService.checkProductAvailability(idProducto, cantidad);

  // Grabar la venta
  const sale = await salesRepository.createSale(idProducto, cantidad);

  // Actualizar la cantidad de producto en inventario después de una venta exitosa
  const nuevaCantidad = producto.cantidad - cantidad;
  await inventoryService.updateProduct(idProducto, { cantidad: nuevaCantidad });

  return sale;
};

const updateSale = async (idVenta, cantidad) => {
  // Obtener la venta existente
  const existingSale = await salesRepository.getSaleById(idVenta);
  if (!existingSale) {
    throw new Error('Venta no encontrada');
  }

  // Verificar que la actualización no resulte en una cantidad negativa en inventario
  const producto = await inventoryService.getProductById(existingSale.idProducto);
  const ajusteCantidad = cantidad - existingSale.cantidad;
  if (producto.cantidad + ajusteCantidad < 0) {
    throw new Error('No hay suficiente stock para realizar la devolución o ajuste');
  }

  // Actualizar la venta
  const updatedSale = await salesRepository.updateSale(idVenta, cantidad);

  // Actualizar el inventario con la nueva cantidad
  await inventoryService.updateProduct(existingSale.idProducto, { cantidad: producto.cantidad + ajusteCantidad });

  return updatedSale;
};

const getSalesHistory = async () => {
  return await salesRepository.getSalesHistory();
};

module.exports = {
  recordSale,
  updateSale,
  getSalesHistory
};
