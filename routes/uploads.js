const express = require('express');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Upload = require('../models/Upload');

const router = express.Router();

// Configurar o multer para o armazenamento dos arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta de destino dos uploads
    },
    filename: (req, file, cb) => {
        const hash = crypto.randomBytes(8).toString('hex'); // Gerar um hash único para o nome do arquivo
        const ext = path.extname(file.originalname);
        const filename = `${hash}${ext}`; // Nome do arquivo final

        cb(null, filename);
    },
});

const upload = multer({storage});

// Rota para cadastrar uma nova imagem
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Extrair os dados do arquivo enviado
        const {filename} = req.file;

        // Criar uma nova instância do modelo Upload
        const newUpload = new Upload({
            schema: 'game',
            itemId: null, // Preencher com o ID do jogo se estiver vinculando a um jogo específico
            type: 'image',
            hash: filename, // Salvar o hash ou nome do arquivo
        });

        // Salvar o upload no banco de dados
        await newUpload.save();

        // Devolver o ID do upload
        res.json({id: newUpload._id});
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({error: 'Failed to upload image'});
    }
});

module.exports = router;
