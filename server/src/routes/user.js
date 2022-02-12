const { userMe,
        usersGet,
        usersPost,
        usersPut,
        usersDelete,
        usersPatch
     } = require('../controllers/users');

const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, 
        esEmailValido, 
        existeUsuarioPorId 
    } = require('../helpers/db-validators');

const { validateFields, 
        validateJWT, 
        isAdminRole, 
        youAreRole 
    } = require('../middlewares'); 

const router = Router();

router.get('/', usersGet );

router.get('/me', [validateJWT], userMe );

router.put('/:id',[
    validateJWT,
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    // check('rol').custom( esRoleValido ),
    
    // Middlewares
    validateFields
], usersPut );

router.post('/', [
    validateJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    check('password', 'El password debe ser más de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom( esEmailValido ),
    //check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom( esRoleValido ),
    
    // Middlewares
    validateFields
], usersPost );

router.patch('/', usersPatch );

router.delete('/:id', [
    validateJWT,
    //esAdminRole,
    youAreRole('ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE'),
    check('id', 'No es un Id válido').isMongoId(),
    check('id').custom( existeUsuarioPorId ),
    
    // Middlewares
    validateFields
], usersDelete );

module.exports = router;