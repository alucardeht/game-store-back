const express = require('express');
const User = require('../models/User.js');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/auth.js');
const Role = require('../models/Role.js');
const {find} = require("../models/Library");

const router = express.Router();

// Rota para cadastrar um novo usuário
router.post('/register', async (req, res) => {
    try {
        const {name, email, password, confirmPassword, roleId} = req.body;

        // Verificar se as senhas correspondem
        if (password !== confirmPassword) {
            return res.status(400).json({message: 'As senhas não correspondem.'});
        }

        // Verificar se o usuário já está cadastrado
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'O usuário já está cadastrado.'});
        }

        // Verificar se a role existe
        const role = await Role.findById(roleId);
        if (!role) {
            return res.status(400).json({message: 'A role especificada não existe.'});
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar um novo usuário
        const newUser = new User({name, email, password: hashedPassword, role: role._id});
        await newUser.save();

        // Gerar um token de autenticação
        const token = authMiddleware.generateToken(newUser._id);

        // Retornar o token e as informações do usuário
        res.json({
            token,
            user: {_id: newUser._id, name, email, role: role.name}
        });
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao cadastrar o usuário.'});
    }
});

// Rota para atualizar um usuário
router.put('/:id', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {name, email, password, confirmPassword} = req.body;
        const {id} = req.params;

        // Verificar se as passwords correspondem
        if (password !== confirmPassword) {
            return res.status(400).json({message: 'As passwords não correspondem.'});
        }

        // Verificar se o usuário existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        // Atualizar as informações do usuário
        existingUser.name = name;
        existingUser.email = email;
        existingUser.password = await bcrypt.hash(password, 10);

        await existingUser.save();

        // Retornar as informações atualizadas do usuário
        res.json({_id: existingUser._id, name, email});
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao atualizar o usuário.'});
    }
});

// Rota para excluir um usuário
router.delete('/:id', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;

        // Verificar se o usuário existe
        const existingUser = await User.findById(id);
        if (!existingUser) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        // Excluir o usuário
        await existingUser.deleteOne();

        res.json({message: 'Usuário excluído com sucesso.'});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Ocorreu um erro ao excluir o usuário.'});
    }
});

// Rota para listar as roles
router.get('/roles', async (req, res) => {
    try {
        const roles = await Role.find();
        res.json(roles);
    } catch (error) {
        console.error('Error retrieving roles:', error);
        res.status(500).json({error: 'Failed to retrieve roles'});
    }
});

// Rota para obter os jogos da biblioteca do usuário
router.get('/library', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {userId} = req;
        const library = await find({user: userId}).populate('game');
        res.json(library);
    } catch (error) {
        console.error('Error retrieving user library:', error);
        res.status(500).json({error: 'Failed to retrieve user library'});
    }
});

// Rota para obter informações de um usuário
router.get('/:id', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {id} = req.params;

        // Verificar se o usuário existe
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({message: 'Usuário não encontrado.'});
        }

        res.json({_id: user._id, name: user.name, email: user.email});
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao obter as informações do usuário.'});
    }
});

// Rota para fazer login
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;

        // Verificar se o usuário existe
        const user = await User.findOne({email}).populate('role');
        if (!user) {
            return res.status(401).json({message: 'Credenciais inválidas.'});
        }

        // Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: 'Credenciais inválidas.'});
        }

        // Gerar um token de autenticação
        const token = authMiddleware.generateToken(user._id);

        // Retornar o token e as informações do usuário
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role.name
            }
        });
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao fazer login.'});
    }
});

// Rota para fazer logout (invalidar o token)
router.post('/logout', authMiddleware.authenticateToken, async (req, res) => {
    try {
        // Invalidar o token de autenticação
        const user = await User.findById(req.userId);
        user.token = null;
        await user.save();

        res.json({message: 'Logout realizado com sucesso.'});
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao fazer logout.'});
    }
});

module.exports = router;
