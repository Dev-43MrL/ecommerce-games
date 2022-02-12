const { Router } = require('express');
const { check } = require('express-validator');

const { categoriesGet, 
        categoryGet,
        categoryPost,
        categoryPut,
        categoryDelete
} = require('../controllers/categories');

const { existeCategoriaPorId } = require('../helpers/db-validators');

const { validateFields,
        validateJWT, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', categoriesGet );

// Obtener las categorias por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validateFields
], categoryGet );

// Crear categoria - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validateFields
], categoryPost );

// Actualizar categoria - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom( existeCategoriaPorId ),
    validateFields
], categoryPut );

// Borrar categoria - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeCategoriaPorId ),
    validateFields
], categoryDelete );

module.exports = router