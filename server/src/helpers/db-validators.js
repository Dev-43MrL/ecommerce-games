const { User, Category, Product, Role, Event, Address, Platform, Game, Favorite } = require('../models');

// Verificar si el rol esta registrado
const esRoleValido = async( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if( !existeRol ){
        throw new Error(`The role ${ rol } is not registered in the DB`);
    }
};

// Verificar si el correo existe
const esEmailValido = async( email = '' ) => {
    const existeEmail = await User.findOne({ email });
    if( existeEmail ){
        throw new Error(`The email ${ email } is already in use`);       
    };
};

// Verificar si el ID existe
const existeUsuarioPorId = async( id ) => {
    const existeUsuarioId = await User.findById( id );
    if( !existeUsuarioId ){
        throw new Error(`The id: ${ id } not exist`);       
    };
};

// Verificar si el ID - Categoria existe
const existeCategoriaPorId = async( id ) => {
    const existeCategoriaId = await Category.findById( id );
    if( !existeCategoriaId ){
        throw new Error(`The id: ${ id } not exist`);       
    };
};

// Verificar si el ID - Producto existe
const existeProductoPorId = async( id ) => {
    const existeProductoId = await Product.findById( id );
    if( !existeProductoId ){
        throw new Error(`The id: ${ id } not exist`);       
    };
};

// Verificar si el ID - Evento existe
const existsEventForId = async( id ) => {
    const existsEventId = await Event.findById( id );
    if( !existsEventId ){
        throw new Error(`The id: ${ id } not exist `);       
    };
};

// Verificar si el ID - Direccion existe
const existsAddressForId = async( id ) => {
    const existsAddressId = await Address.findById( id );
    if( !existsAddressId ){
        throw new Error(`The id: ${ id } not exist `);       
    };
};

// Verificar si el ID - Plataforma existe
const existsPlatformForId = async( id ) => {
    const existsPlatformId = await Platform.findById( id );
    if( !existsPlatformId ){
        throw new Error(`The id: ${ id } not exist `);       
    };
};

// Verificar si el ID - Game existe
const existsGameForId = async( id ) => {
    const existsGameId = await Game.findById( id );
    if( !existsGameId ){
        throw new Error(`The id: ${ id } not exist `);       
    };
};

// Verificar si el ID - Favorite existe
const existsFavoriteForId = async( id ) => {
    const existsFavoriteId = await Favorite.findById( id );
    if( !existsFavoriteId ){
        throw new Error(`The id: ${ id } not exist `);       
    };
};

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`The collection ${ coleccion } is not allowed ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    esEmailValido,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    existsEventForId,
    coleccionesPermitidas,
    existsAddressForId,
    existsPlatformForId,
    existsGameForId,
    existsFavoriteForId
}