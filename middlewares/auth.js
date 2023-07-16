const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Função para gerar o token de autenticação
const generateToken = (userId) => {
    return jwt.sign({userId}, 'oppai-man');
};

// Middleware para verificar o token de autenticação
const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({message: 'Token de autenticação não fornecido.'});
    }

    try {
        const decoded = jwt.verify(token, 'sua-chave-secreta');
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({message: 'Usuário não encontrado.'});
        }

        req.userId = user._id;
        req.token = token;
        next();
    } catch (error) {
        return res.status(403).json({message: 'Token de autenticação inválido.'});
    }
};

const checkRole = (role) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (userRole !== role) {
            return res.status(403).json({message: 'Acesso não autorizado.'});
        }

        next();
    };
};

module.exports = {
    generateToken,
    authenticateToken,
    checkRole
};
