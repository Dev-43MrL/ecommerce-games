/*
    Routes of auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn, register, revalidateToken } = require('../controllers/auth');
const { esEmailValido, esRoleValido } = require('../helpers/db-validators');
const { validateJWT } = require('../middlewares');
const { validateFields } = require('../middlewares/validate-fields');

const router = Router();

router.post('/signIn',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
], login);

router.post('/signUp', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('username', 'El usuario nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( esEmailValido ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    
    // Middlewares
    validateFields
], register );

router.get('/renew', 
    validateJWT, 
    revalidateToken );

router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validateFields
], googleSignIn);

module.exports = router