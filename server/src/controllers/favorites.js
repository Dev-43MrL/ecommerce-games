const { response } = require("express");
const { Favorite } = require("../models");

// obtenerFavorite - populate
const favoriteGet = async( req, res = response ) => {

    const { user, game } = req.query;

    try {

        const product = await Favorite.find({ user: user, game: game });
        res.json( product );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// obtenerFavoritosUser - populate
const favoriteUserGet = async( req, res = response ) => {

    const { id } = req.params;
    
    try {

        const favorite = await Favorite.find({ user: id })
            .populate('game');
        
        res.json( favorite );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

//crearFavorite
const favoritePost = async( req, res = response ) => {
    
    const { ...body } = req.body;
    
    try {

        const favoriteDB = await Favorite.findOne({ user: body.user, game: body.game });

        if( favoriteDB ){
            return res.status(400).json({
                msg: `Ya lo tienes de favorito`
            });
        }

        // Genera la data a guardar
        const data = {
            ...body
        }

        const favorite = new Favorite( data );

        // Guarda DB
        await favorite.save();

        res.status(201).json(favorite);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// actualizarProducto
// const productPut = async( req, res = response ) => {

//     const { id } = req.params;
//     const { state, user, ...data } = req.body;
    
//     try {
            
//         data.name = data.name.toUpperCase();
//         data.user = req.user._id;

//         const product = await Product.findByIdAndUpdate( id, data, { new: true } );

//         res.json( product );
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Por favor hable con el administrador'
//         });
//     }
// }

// borrarFavorite
const favoriteDelete = async( req, res = response ) => {

    const { id } = req.params;
    
    try {
    
        const favoriteDelete = await Favorite.findOneAndDelete( id );

        res.json( favoriteDelete );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });       
    }
}

module.exports = {
    favoriteUserGet,
    favoriteGet,
    favoritePost,
    // productPut,
    favoriteDelete
}