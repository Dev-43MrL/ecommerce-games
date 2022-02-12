const { Router } = require('express');
const { check } = require('express-validator');

const { favoriteGet,
        favoriteUserGet,
        favoritePost,
        favoriteDelete } = require('../controllers/favorites');

const { existsGameForId,
        existeUsuarioPorId, 
        existsFavoriteForId } = require('../helpers/db-validators');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las productos - publico
router.get('/', [
    validateJWT,
], favoriteGet );

//Obtener los favoritos por user - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validateFields
],  favoriteUserGet);

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('game', 'No es un id de Mongo válido').isMongoId(),
    check('game').custom(existsGameForId),
    check('user', 'No es un id de Mongo válido').isMongoId(),
    check('user').custom(existeUsuarioPorId),
    validateFields
], favoritePost);

// // Actualizar producto - privado - cualquier persona con un token valido
// router.put('/:id', [
//     validateJWT,
//     //check('categoria', 'No es un id de Mongo válido').isMongoId(),
//     check('id').custom( existeProductoPorId ),
//     validateFields
// ], productPut );

// Borrar favorite
router.delete('/:id', [
    validateJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsFavoriteForId ),
    validateFields
], favoriteDelete );

module.exports = router