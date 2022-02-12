const { Router } = require('express');
const { check } = require('express-validator');

const { gamesGet,
        gameGet,
        gamePost } = require('../controllers/games');

const { existsPlatformForId } = require('../helpers/db-validators');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas los ultimos juegos - publico
router.get('/', gamesGet );

// Obtener los juegos por query - publico
router.get('/:id', [
    validateJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsPlatformForId ),
    validateFields
], gameGet );

router.post('/', gamePost);

module.exports = router