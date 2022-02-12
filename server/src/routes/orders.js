const { Router } = require('express');
const { check } = require('express-validator');

const { ordersGet, 
        orderPost } = require('../controllers/orders');

const { existeUsuarioPorId  } = require('../helpers/db-validators');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todas las ordenes
router.get('/', validateJWT, ordersGet );

// // Obtener las porductos por id - publico
// router.get('/:id', [
//     check('id', 'No es un id de Mongo válido').isMongoId(),
//     check('id').custom( existeProductoPorId ),
//     validateFields
// ], productGet );

// Crear orden - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('idUser', 'No es un id de Mongo válido').isMongoId(),
    check('idUser').custom(existeUsuarioPorId)
], orderPost);

// // Actualizar producto - privado - cualquier persona con un token valido
// router.put('/:id', [
//     validateJWT,
//     //check('categoria', 'No es un id de Mongo válido').isMongoId(),
//     check('id').custom( existeProductoPorId ),
//     validateFields
// ], productPut );

// // Borrar producto - ADMIN
// router.delete('/:id', [
//     validateJWT,
//     isAdminRole,
//     check('id', 'No es un id de Mongo válido').isMongoId(),
//     check('id').custom( existeProductoPorId ),
//     validateFields
// ], productDelete );

module.exports = router