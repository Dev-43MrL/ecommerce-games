const { Router } = require('express');
const { check } = require('express-validator');

const { productsGet,
        productGet,
        productPost,
        productPut,
        productDelete } = require('../controllers/products');

const { existeCategoriaPorId, 
        existeProductoPorId } = require('../helpers/db-validators');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las productos - publico
router.get('/', productsGet );

// Obtener las porductos por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validateFields
], productGet );

// Crear producto - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('category', 'No es un id de Mongo válido').isMongoId(),
    check('category').custom(existeCategoriaPorId),
    validateFields
], productPost);

// Actualizar producto - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    //check('categoria', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validateFields
], productPut );

// Borrar producto - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeProductoPorId ),
    validateFields
], productDelete );

module.exports = router