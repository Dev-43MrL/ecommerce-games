const { Router } = require('express');

const { platformsGet } = require('../controllers/platforms');

const router = Router();

// Obtener todas las plataformas - publico
router.get('/', platformsGet );

module.exports = router