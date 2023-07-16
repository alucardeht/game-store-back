const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const Library = require('../models/Library');

// Rota para adicionar um jogo à biblioteca do usuário
router.post('/add', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {userId} = req;
        const {gameId} = req.body;

        // Verificar se o jogo já está na biblioteca do usuário
        const existingGame = await Library.findOne({user: userId, game: gameId});
        if (existingGame) {
            return res.status(400).json({message: 'O jogo já está na biblioteca do usuário.'});
        }

        // Criar um novo registro na biblioteca
        const newLibraryEntry = new Library({user: userId, game: gameId});
        await newLibraryEntry.save();

        res.json({message: 'Jogo adicionado à biblioteca com sucesso.'});
    } catch (error) {
        console.error('Error adding game to user library:', error);
        res.status(500).json({error: 'Failed to add game to user library'});
    }
});

module.exports = router;
