const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const inventoryService = require('../services/inventoryService');
const Product = require('../data/models/product');
 

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: 'dvjjpeyzh',
  api_key: '979357941973196',
  api_secret: 'OjpMoSrTxPaEPVUExisKHGj3Eak'
});

// Configuración de multer para almacenamiento en memoria
const upload = multer({ storage: multer.memoryStorage() });

const getProducts = async (req, res) => {
  try {
    const products = await inventoryService.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await inventoryService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

async function createProduct(req, res) {
  try {
    const { nombre, precio, cantidad } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("No se subió ninguna imagen");
    }

    // Sube el archivo a Cloudinary
    cloudinary.uploader.upload_stream({ resource_type: 'image' },
      async (error, result) => {
        if (error) {
          console.error('Error al subir imagen a Cloudinary:', error);
          return res.status(500).json({ error: 'Error al subir imagen' });
        }

        const imageUrl = result.secure_url;
        const newProduct = new Product(undefined, nombre, precio, cantidad, imageUrl);

        newProduct.save((err, productId) => {
          if (err) {
            console.error('Error al guardar en la base de datos:', err);
            return res.status(500).json({ error: 'Error al guardar el producto' });
          }

          res.status(201).json({ message: 'Producto agregado con éxito', id: productId, imageUrl: imageUrl });
        });
      }
    ).end(req.file.buffer);
  } catch (error) {
    console.error('Error al insertar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updateData = req.body;
    const updatedProduct = await inventoryService.updateProduct(req.params.id, updateData);
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    await inventoryService.deleteProduct(req.params.id);
    res.json({ message: 'Producto eliminado', id: req.params.id });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
