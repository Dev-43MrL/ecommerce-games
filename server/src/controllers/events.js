const { response } = require("express");
const { Event } = require("../models");

// obtenerEventos - paginado -total - populate
const eventsGet = async( req, res = response ) => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    try {

        const [ total, events ] = await Promise.all([
            Event.countDocuments( query ),
            Event.find( query )
                .populate('user', 'name')
                .skip(Number( desde ))
                .limit(Number( limite ))
        ]);

        res.json({
            ok: true,
            total,
            events
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// obtenerEvento - populate
const eventGet = async( req, res = response ) => {

    const { id } = req.params;
    try {

        const event = await Event.findById( id )
            .populate('user', 'name');
        
        res.json( event );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// crearEvento
const eventPost = async( req, res = response ) => {
    
    const {state, user, ...body } = req.body;
    
    try {
            
        const eventDB = await Event.findOne({ title: body.title });

        if( eventDB ){
            return res.status(400).json({
                msg: `The event ${ eventDB.title } it already exists`
            });
        }

        // Genera la data a guardar
        const data = {
            ...body,
            title: body.title.toUpperCase(),
            notes: body.notes.toUpperCase(),
            user: req.user._id
        }

        const event = new Event( data );

        // Guarda DB
        await event.save();

        res.status(201).json({
            ok: true,
            event
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

// actualizarEvento
const eventPut = async( req, res = response ) => {

    const { id } = req.params;
    const { state, user, ...body } = req.body;
    const uid = req.user._id;
    
    try {

        const event = await Event.findById( id );

        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist for that id'
            })
        }

        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'You cannot edit this event'
            })
        }

        const newEvent = {
            ...body,
            title: body.title.toUpperCase(),
            notes: body.notes.toUpperCase(),
            user: uid
        }

        const eventUpdate = await Event.findByIdAndUpdate( id, newEvent, { new: true } );

        res.json({
            ok: true,
            eventUpdate 
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// borrarEvento - estado:false
const eventDelete = async( req, res = response ) => {

    const { id } = req.params;
    const uid = req.user._id;
    
    try {

        const event = await Event.findById( id );
        
        if( !event ){
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exist for that id'
            })
        }
        
        if( event.user.toString() !== uid ){
            return res.status(401).json({
                ok: false,
                msg: 'You cannot delete this event'
            })
        }
        
        await Event.findByIdAndUpdate( id, {state: false}, {new: true});
        
        res.json({
            ok: true,
            msg: 'Event delete'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    eventsGet,
    eventGet,
    eventPost,
    eventPut,
    eventDelete
}