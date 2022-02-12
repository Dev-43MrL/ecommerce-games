const { response } = require("express");
const { Platform } = require("../models");

// obtenerDirecciones - paginado -total - populate
const platformsGet = async( req, res = response ) => {

    const { _sort } = req.query;
    const query = { state: true, _sort };
    
    try {

        const platforms = await Platform.find( query );
        res.json(platforms);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    platformsGet
}