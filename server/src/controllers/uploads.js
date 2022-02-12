const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const { response } = require('express');
const { uploadFile } = require('../helpers');
const { User, Product } = require('../models');

const cargarArchivo = async( req, res = response ) => {

    try {

        // Imagenes
        const name = await uploadFile( req.files, undefined, 'imgs' );

        res.json({
            name
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const actualizarImagen = async( req, res = response ) => {
    
    const { id, coleccion } = req.params;
    let modelo;

    try {

        switch ( coleccion ) {
            case 'users':
                modelo = await User.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
                
            break;

            case 'products':
                modelo = await Product.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }

            break;
        
            default:
                return res.status(500).json({
                    msg: 'Se me olvido validar esto'
                });
        }

        // Limpiar imagenes previas
        if( modelo.img ){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ) {
                fs.unlinkSync( pathImagen );
            }
        }

        const nombre = await uploadFile( req.files, undefined, coleccion );
        modelo.img = nombre;

        await modelo.save();

        res.json({
            id,
            coleccion
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const actualizarImagenCloudinary = async( req, res = response ) => {
    
    const { id, coleccion } = req.params;
    let modelo;
    
    try {

        switch ( coleccion ) {
            case 'users':
                modelo = await User.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
                
            break;

            case 'products':
                modelo = await Product.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }

            break;
        
            default:
                return res.status(500).json({
                    msg: 'Se me olvido validar esto'
                });
        }

        // Limpiar imagenes previas
        if( modelo.img ){
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[ nombreArr.length - 1 ];
            const [ public_id ] = nombre.split('.');
            cloudinary.uploader.destroy( public_id );
        }

        const { tempFilePath } = req.files.file;
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );
        modelo.img = secure_url;

        await modelo.save();

        res.json( modelo );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const mostrarImagen = async( req, res = response ) => {
    const { id, coleccion } = req.params;
    let modelo;
    
    try {

        switch ( coleccion ) {
            case 'users':
                modelo = await User.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
                
            break;

            case 'products':
                modelo = await Product.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }

            break;
        
            default:
                return res.status(500).json({
                    msg: 'Se me olvido validar esto'
                });
        }

        // Limpiar imagenes previas
        if( modelo.img ){
            // Hay que borrar la imagen del servidor
            const pathImagen = path.join( __dirname, '../uploads/', coleccion, modelo.img );
            if( fs.existsSync( pathImagen ) ) {
                return res.sendFile( pathImagen );
            }
        }

        const pathImagen = path.join( __dirname, '../assets/no-imagen.png');
        res.sendFile( pathImagen );
            
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const mostrarImagenCloudinary = async( req, res = response ) => {
    const { id, coleccion } = req.params;
    let modelo;
    
    try {

        switch ( coleccion ) {
            case 'users':
                modelo = await User.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un usuario con el id ${ id }`
                    });
                }
                
            break;

            case 'products':
                modelo = await Product.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe un producto con el id ${ id }`
                    });
                }

            break;
        
            default:
                return res.status(500).json({
                    msg: 'Se me olvido validar esto'
                });
        }

        const pathImagen = path.join( __dirname, '../assets/no-imagen.png');
        res.sendFile( pathImagen );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary,
    mostrarImagenCloudinary
}