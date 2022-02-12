const { response } = require("express");
const { Address } = require("../models");

// obtenerDirecciones - paginado -total - populate
const addressesGet = async( req, res = response ) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    try {

        const [ total, addresses ] = await Promise.all([
            Address.countDocuments( query ),
            Address.find( query )
                .populate('user', 'name')
                .skip(Number( desde ))
                .limit(Number( limite ))
        ]);

        res.json({
            total,
            addresses
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// obtenerDireccion - populate
const addressGet = async( req, res = response ) => {

    const { id } = req.params;
    
    try {

        const address = await Address.find({ user: id, state: true})
            .populate('user', 'name')
        
        res.json( address );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// crearDireccion
const addressPost = async( req, res = response ) => {
    
    const {state, user, ...body } = req.body;
    
    try {

        const addressDB = await Address.findOne({ name: body.name });

        if( addressDB ){
            return res.status(400).json({
                msg: `The address ${ addressDB.name } it already exists`
            });
        }

        // Genera la data a guardar
        const data = {
            ...body,
            name: body.name.toUpperCase(),
            user: req.user._id
        }

        const address = new Address( data );

        // Guarda DB
        await address.save();

        res.status(201).json(address);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// actualizarDireccion
const addressPut = async( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;
    
    try {
            
        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        const address = await Address.findByIdAndUpdate( id, data, { new: true } );

        res.json( address );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// borrarDireccion - estado:false
const addressDelete = async( req, res = response ) => {

    const { id } = req.params;
    
    try {
    
        const addressDelete = await Address.findByIdAndUpdate( id, {state: false}, {new: true});

        res.json( addressDelete );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });       
    }
}

module.exports = {
    addressesGet,
    addressGet,
    addressPost,
    addressPut,
    addressDelete
}