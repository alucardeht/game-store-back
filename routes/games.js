const express = require('express');
const router = express.Router();
const Games = require('../models/Game');
const Genre = require('../models/Genre');
const OperatingSystem = require('../models/OperatingSystem');
const authMiddleware = require('../middlewares/auth');

// Rota para cadastrar um novo jogo (somente para usuários do tipo "Developer")
router.post('/', authMiddleware.authenticateToken, authMiddleware.checkRole('Developer'), async (req, res) => {
    try {
        const {
            catalogImage,
            headerImage,
            screenshots,
            pageUrl,
            title,
            description,
            shortDescription,
            genres,
            operatingSystems,
            builds,
            releaseDate,
            price
        } = req.body;
        const author = req.userId;

        const newGame = new Games({
            catalogImage,
            headerImage,
            screenshots,
            pageUrl,
            title,
            description,
            shortDescription,
            author,
            genres,
            operatingSystems,
            builds,
            releaseDate,
            price,
        });

        await newGame.save();

        res.json(newGame);
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao cadastrar o jogo.'});
    }
});

// Rota para atualizar um jogo (somente para usuários do tipo "Developer" e autor do jogo)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.checkRole('Developer'), async (req, res) => {
    try {
        const {id} = req.params;
        const {
            catalogImage,
            headerImage,
            screenshots,
            pageUrl,
            title,
            description,
            shortDescription,
            genres,
            operatingSystems,
            builds,
            releaseDate,
            price
        } = req.body;
        const author = req.userId;

        const existingGame = await Games.findById(id);

        if (!existingGame) {
            return res.status(404).json({message: 'Jogo não encontrado.'});
        }

        if (existingGame.author.toString() !== author) {
            return res.status(403).json({message: 'Acesso não autorizado.'});
        }

        existingGame.catalogImage = catalogImage;
        existingGame.headerImage = headerImage;
        existingGame.screenshots = screenshots;
        existingGame.pageUrl = pageUrl;
        existingGame.title = title;
        existingGame.description = description;
        existingGame.shortDescription = shortDescription;
        existingGame.genres = genres;
        existingGame.operatingSystems = operatingSystems;
        existingGame.builds = builds;
        existingGame.releaseDate = releaseDate;
        existingGame.price = price;

        await existingGame.save();

        res.json(existingGame);
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao atualizar o jogo.'});
    }
});

// Rota para excluir um jogo (somente para usuários do tipo "Developer" e autor do jogo)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.checkRole('Developer'), async (req, res) => {
    try {
        const {id} = req.params;
        const author = req.userId;

        const existingGame = await Games.findById(id);

        if (!existingGame) {
            return res.status(404).json({message: 'Jogo não encontrado.'});
        }

        if (existingGame.author.toString() !== author) {
            return res.status(403).json({message: 'Acesso não autorizado.'});
        }

        await existingGame.deleteOne();

        res.json({message: 'Jogo excluído com sucesso.'});
    } catch (error) {
        res.status(500).json({message: 'Ocorreu um erro ao excluir o jogo.'});
    }
});

// Rota para obter os sistemas operacionais disponíveis
router.get('/operating-systems', async (req, res) => {
    try {
        const operatingSystems = await OperatingSystem.find();
        res.json(operatingSystems);
    } catch (error) {
        console.error('Error retrieving operating systems:', error);
        res.status(500).json({error: 'Failed to retrieve operating systems'});
    }
});

// Rota para obter os gêneros disponíveis
router.get('/genres', async (req, res) => {
    try {
        const genres = await Genre.find();
        res.json(genres);
    } catch (error) {
        console.error('Error retrieving genres:', error);
        res.status(500).json({error: 'Failed to retrieve genres'});
    }
});

// Rota para obter as builds disponíveis de um jogo
router.get('/:id/builds', async (req, res) => {
    try {
        const {id} = req.params;
        const game = await Games.findById(id).populate('builds');
        if (!game) {
            return res.status(404).json({message: 'Game not found'});
        }
        res.json(game.builds);
    } catch (error) {
        console.error('Error retrieving game builds:', error);
        res.status(500).json({error: 'Failed to retrieve game builds'});
    }
});

router.get('/', authMiddleware.authenticateToken, async (req, res) => {
    try {
        const {name, genre, minPrice, maxPrice, releaseDate} = req.query;

        const filters = {};

        // Adicionar filtro por nome do jogo
        if (name) {
            filters.title = {$regex: name, $options: 'i'};
        }

        // Adicionar filtro por gênero
        if (genre) {
            filters.genres = genre;
        }

        // Adicionar filtro por faixa de preço
        if (minPrice && maxPrice) {
            filters.price = {$gte: minPrice, $lte: maxPrice};
        } else if (minPrice) {
            filters.price = {$gte: minPrice};
        } else if (maxPrice) {
            filters.price = {$lte: maxPrice};
        }

        // Adicionar filtro por data de lançamento
        if (releaseDate) {
            filters.releaseDate = releaseDate;
        }

        const games = await Games.find(filters);
        res.json(games);
    } catch (error) {
        console.error('Error searching games:', error);
        res.status(500).json({error: 'Failed to search games'});
    }
});

// Rota para buscar um jogo pela URL
router.get('/:url', async (req, res) => {
    try {
        const {url} = req.params;

        const game = await Games.findOne({pageUrl: url});

        if (!game) {
            return res.status(404).json({message: 'Jogo não encontrado.'});
        }

        res.json(game);
    } catch (error) {
        console.error('Error finding game by URL:', error);
        res.status(500).json({error: 'Failed to find game by URL'});
    }
});

module.exports = router;
