const bcrypt = require('bcryptjs');
const authService = require('../services/authService');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await authService.findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Usuario no encontrado' });
        }

        // Validar la contraseña
        const isMatch = bcrypt.compareSync(password, user.passwordHash);
        
        if (isMatch) {
            res.json({ success: true, message: 'Login exitoso' });
        } else {
            res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        res.status(500).json({ success: false, message: 'Error del servidor' });
    }
};

module.exports = {
    login
};
