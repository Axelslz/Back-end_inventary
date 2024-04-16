const productRepository = require('../data/repositories/productRepository');

const getAllProducts = async () => {
  return await productRepository.findAll();
};

const getProductById = async (id) => {
  return await productRepository.findById(id);
};

const createProduct = async (productData) => {
  return await productRepository.create(productData);
};

// Actualiza la función updateProduct para manejar específicamente la actualización de la cantidad
const updateProduct = async (id, updateData) => {
  // Obtén el producto actual para no sobreescribir otros campos
  const product = await getProductById(id);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  // Fusiona los datos actuales del producto con los nuevos datos
  const newProductData = { ...product, ...updateData };
  return await productRepository.update(id, newProductData);
};

const deleteProduct = async (id) => {
  return await productRepository.delete(id);
};

// Añade la función checkProductAvailability
const checkProductAvailability = async (idProducto, cantidadRequerida) => {
  const product = await getProductById(idProducto);
  if (!product) {
    throw new Error('Producto no encontrado');
  }
  if (product.cantidad < cantidadRequerida) {
    throw new Error('No hay suficiente stock del producto');
  }
  return product; // Devuelve el producto si hay suficiente stock
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  checkProductAvailability // Asegúrate de exportar la nueva función
};
