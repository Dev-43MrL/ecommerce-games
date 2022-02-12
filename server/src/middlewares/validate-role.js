const { response } = require("express");

const  isAdminRole = ( req, res = response, next ) => {
    
    if( !req.user ){
        return res.status(500).json({
            msg: 'Token without roles'
        });
    }

    const { rol, name } = req.user;
    if( rol !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ name } is not ADMIN`
        });
    } 

    next();
}

const youAreRole = ( ...roles ) => {
    return ( req, res = response, next ) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Toquen without roles'
            });
        }

        if ( !roles.includes( req.user.rol ) ) {
            return res.status(401).json({
                msg: `Role is required ${ roles }`
            });
        }
        next();
    }
}

module.exports = {
    isAdminRole,
    youAreRole
}