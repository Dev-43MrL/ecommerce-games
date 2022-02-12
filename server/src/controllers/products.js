const { response } = require("express");
const { Product } = require("../models");

// obtenerProductos - paginado -total - populate
const productsGet = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    try {

        const [ total, products ] = await Promise.all([
            Product.countDocuments( query ),
            Product.find( query )
                .populate('user', 'name')
                .skip(Number( desde ))
                .limit(Number( limite ))
        ]);

        res.json({
            total,
            products
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// obtenerProducto - populate
const productGet = async( req, res = response ) => {

    const { id } = req.params;
    
    try {

        const product = await Product.findById( id )
            .populate('user', 'name')
            .populate('category', 'name');
        
        res.json( product );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// crearProducto
const productPost = async( req, res = response ) => {
    
    const {state, user, ...body } = req.body;
    
    try {

        const productDB = await Product.findOne({ name: body.name });

        if( productDB ){
            return res.status(400).json({
                msg: `The product ${ productDB.name } it already exists`
            });
        }

        // Genera la data a guardar
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        }

        const product = new Product( data );

        // Guarda DB
        await product.save();

        res.status(201).json(product);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// actualizarProducto
const productPut = async( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;
    
    try {
            
        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const product = await Product.findByIdAndUpdate( id, data, { new: true } );

        res.json( product );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// borrarProducto - estado:false
const productDelete = async( req, res = response ) => {

    const { id } = req.params;
    
    try {
    
        const productDelete = await Product.findByIdAndUpdate( id, {state: false}, {new: true});

        res.json( productDelete );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });       
    }
}

module.exports = {
    productsGet,
    productGet,
    productPost,
    productPut,
    productDelete
}