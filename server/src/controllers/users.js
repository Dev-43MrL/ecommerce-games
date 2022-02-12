const { response, request } = require('express');
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const userMe = async(req = request, res = response ) => {
    
    try {
    
        const query = { _id: req.user._id };

        const user= await User.findById( query )

        res.json(
            user
        );
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const usersGet = async(req = request, res = response ) => {
    
    try {
        
        const query = { state: true };
        const { limite = 5, desde = 0 } = req.query;

        const [ total, users ] = await Promise.all([
            User.countDocuments( query ),
            User.find( query )
                .skip(Number( desde ))
                .limit(Number( limite ))
        ]);


        res.json({
            msg: 'get API - Controlador',
            total,
            users
        });
            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const usersPut = async(req, res = response ) => {

    const { id } = req.params;
    const { _id, password, google, ...resto } = req.body;
    
    try {
        
        // Validar contra la base de datos
        if( password ){
            // Encriptar la contraseña
            const salt = bcrypt.genSaltSync();
            resto.password = bcrypt.hashSync( password, salt );
        }

        const user = await User.findByIdAndUpdate( id, resto );

        res.json({
            msg: 'put API - Controlador',
            user
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const usersPost = async(req, res = response ) => {
    
    const { name, email, lastname, password, rol } = req.body;
    
    try {
    
        const user = new User({ name, lastname, email, password, rol });
        
        // Encriptar la contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        // Guardar en DB
        await user.save();

        res.json({
            msg: 'post API - Controlador',
            user
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const usersPatch = (req, res = response ) => {
    try {

        res.json({
            msg: 'patch API - Controlador'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const usersDelete = async(req, res = response ) => {

    const { id } = req.params;
    
    try {
            
        const user = await User.findByIdAndUpdate( id, { state: false } );

        res.json({
            msg: 'delete API - Controlador',
            user
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

module.exports = {
    userMe,
    usersGet,
    usersPut,
    usersPost,
    usersPatch,
    usersDelete
}