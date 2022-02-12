const { Router } = require('express');
const { check } = require('express-validator');

const { addressesGet,
        addressGet,
        addressPost,
        addressPut,
        addressDelete } = require('../controllers/addresses');

const { existsAddressForId, existeUsuarioPorId } = require('../helpers/db-validators');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las direcciones - publico
router.get('/', addressesGet );

// Obtener las direcciones por id - publico
router.get('/:id', [
    validateJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    validateFields
], addressGet );

// Crear direccion - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('title', 'The title is require').not().isEmpty(),
    check('name', 'The name is require').not().isEmpty(),
    check('address', 'The address is require').not().isEmpty(),
    check('city', 'The city is require').not().isEmpty(),
    check('estate', 'The estate is require').not().isEmpty(),
    check('postalCode', 'The postal code is require').not().isEmpty(),
    check('phone', 'The phone is require').not().isEmpty(),
    validateFields
], addressPost);

// Actualizar direccion - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('id').custom( existsAddressForId ),
    validateFields
], addressPut );

// Borrar direccion - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsAddressForId ),
    validateFields
], addressDelete );

module.exports = router