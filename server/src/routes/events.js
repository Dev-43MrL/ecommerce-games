const { Router } = require('express');
const { check } = require('express-validator');

const { eventsGet,
        eventGet,
        eventPost,
        eventPut,
        eventDelete } = require('../controllers/events');

const { existsEventForId, 
        isDate } = require('../helpers');

const { validateJWT, 
        validateFields, 
        isAdminRole } = require('../middlewares');

const router = Router();

// Obtener todos los eventos - publico
router.get('/', eventsGet );

// Obtener los eventos por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsEventForId ),
    validateFields
], eventGet );

// Crear evento - privado - cualquier persona con un token valido
router.post('/', [ 
    validateJWT,
    check('title', 'The title is required').not().isEmpty(),
    check('notes', 'The notes is required').not().isEmpty(),
    check('start', 'The start date is required').custom( isDate ),
    check('end', 'The end date is required').custom( isDate ),
    validateFields
], eventPost);

// Actualizar evento - privado - cualquier persona con un token valido
router.put('/:id', [
    validateJWT,
    check('id').custom( existsEventForId ),
    validateFields
], eventPut );

// Borrar evento - ADMIN
router.delete('/:id', [
    validateJWT,
    isAdminRole,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom( existsEventForId ),
    validateFields
], eventDelete );

module.exports = router