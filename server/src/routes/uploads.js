const { Router } = require('express');
const { check } = require('express-validator');

const { cargarArchivo, 
        actualizarImagenCloudinary, 
        mostrarImagenCloudinary 
    } = require('../controllers/uploads');

const { coleccionesPermitidas } = require('../helpers');

const { validateFields, 
        validateFile 
    } = require('../middlewares');

const router = Router();

router.post('/', validateFile, cargarArchivo);

router.put('/:coleccion/:id', [
    validateFile,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','products'] ) ),
    validateFields
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas( c, ['users','products'] ) ),
    validateFields
], mostrarImagenCloudinary);
// ], mostrarImagen);

module.exports = router;