const { response } = require("express");
const { Category } = require("../models");

// obtenerCategorias - paginado -total - populate
const categoriesGet = async( req, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    try {
        const [ total, categories ] = await Promise.all([
            Category.countDocuments( query ),
            Category.find( query )
                .populate('user', 'name')
                .skip(Number( desde ))
                .limit(Number( limite ))
        ]);

    res.json({
        total,
        categories
    });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// obtenerCategoria - populate
const categoryGet = async( req, res = response ) => {

    const { id } = req.params;
    try {

        const category = await Category.findById( id )
            .populate('user', 'name');
    
        res.json( category );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// crearCategoria
const categoryPost = async( req, res = response ) => {

    try {

        const name = req.body.name.toUpperCase();

        const categoryDB = await Category.findOne({ name });

        if( categoryDB ){
            return res.status(400).json({
                msg: `La categoria ${ categoryDB.name } ya existe`
            });
        }

        // Genera la data a guardar
        const data = {
            name,
            user: req.user._id
        }

        const category = new Category( data );

        // Guarda DB
        await category.save();

        res.status(201).json(category);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// actualizarCategoria
const categoryPut = async( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;
    
    try {

        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const category = await Category.findByIdAndUpdate( id, data, { new: true } );

        res.json( category );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// borrarCategoria - estado:false
const categoryDelete = async( req, res = response ) => {

    try {

        const { id } = req.params;
        const categoryDelete = await Category.findByIdAndUpdate( id, {state: false}, {new: true});

    res.json( categoryDelete );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    categoriesGet,
    categoryGet,
    categoryPost,
    categoryPut,
    categoryDelete
}