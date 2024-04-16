// Importaciones de módulos necesarios
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Carga configuración de las variables de entorno
dotenv.config();

// Configura Cloudinary con tus credenciales cargadas desde variables de entorno
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Nombre del espacio en Cloudinary
    api_key: process.env.API_KEY,       // Clave de API de Cloudinary
    api_secret: process.env.API_SECRET  // Secreto de API de Cloudinary
});

// Configuración de Multer para usar almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware para subir archivos directamente a Cloudinary
const uploadToCloudinary = (req, res, next) => {
    if (!req.file) {
        // Si no hay archivo, pasa al siguiente middleware con un error
        return next(new Error("No file uploaded."));
    }

    // Usa Cloudinary para subir el buffer del archivo directamente
    const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image" },
        (error, result) => {
            if (error) {
                return next(error);  // Maneja cualquier error que ocurra durante la subida
            }
            // Almacena la URL de la imagen de Cloudinary en el request para su uso posterior
            req.fileUrl = result.secure_url;
            next();  // Pasa al siguiente middleware
        }
    );

    // Envía el buffer del archivo al stream de Cloudinary
    stream.end(req.file.buffer);
};

// Exportación de los middlewares configurados
module.exports = { upload, uploadToCloudinary };

console.log(process.env.CLOUD_NAME, process.env.API_KEY, process.env.API_SECRET);
