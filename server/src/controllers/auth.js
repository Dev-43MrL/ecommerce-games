const { response } = require('express');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { User } = require('../models');
const bcryptjs = require('bcryptjs');

const login = async(req, res = response ) => {

    const { email, password } = req.body;
    
    try {

        // Verificar si el email existe
        const user = await User.findOne({ email });
        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'User / Password son incorrectos'
            });
        }; 

        // Si el usuario esta activo
        if( !user.state ){
            return res.status(400).json({
                ok: false,
                msg: 'User / Password son incorrectos'
            });
        };

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'User / Password son incorrectos'
            });
        };

        // Generar el JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok: true,
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const register = async(req, res = response ) => {
    
    const { email, password } = req.body;
    console.log(req.body)
    
    try {
    
        // Verificar si el email existe
        let user = await User.findOne({ email });
        
        if( user ){
            return res.status(400).json({
                ok: false,
                msg: 'User exists with that email'
            });
        }; 

        user = new User( req.body );

        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        user.password = bcryptjs.hashSync( password, salt );

        // Guardar en DB
        await user.save();

        // Generar el JWT
        const token = await generateJWT( user.id, user.name );

        res.json({
            ok:true,
            msg: 'Successfully Registered',
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalidateToken = async(req, res = response ) => {

    const { _id: uid, name } = req.user;

    // Generar JWT
    const token = await generateJWT( uid, name );

    res.json({
        ok:true,
        uid,
        name,
        token
    });
}

const googleSignIn = async( req, res = response ) => {
    
    const { id_token } = req.body;

    try {

        const { name, img, email } = await googleVerify( id_token );

        let user = await User.findOne({ email });

        if( !user ){
            // Tengo que crearlo
            const data = {
                name,
                email,
                password: ':p',
                img,
                google: true
            };

            user = new User( data );
            await user.save();
        }

        // Si el usuario existe en DB
        if( !user.state ){
            return res.status(401).json({
                ok: false,
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generateJWT( user.id );

        res.json({
            ok: true,
            user,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        });
    }
}

module.exports = {
    login,
    register,
    revalidateToken,
    googleSignIn
};