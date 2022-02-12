const { response } = require("express");
const { Game, Platform } = require("../models");

// obtenerJuegos - paginado -total - populate
const gamesGet = async( req, res = response ) => {

    const { _limit, _sort, url, _start , platform, _q} = req.query;

    try {
        let games

        if( _limit && _sort ){
            games= await gamesGetLimitSort(_limit, _sort);
        }

        if( url ){
            games= await gamesGetUrl(url);
        }
        
        if( _limit && _sort && _start){
            games= await gamesPlatform(_limit, _sort, _start, platform);
        }

        if( _q ){
            games= await searchGamesPlatform(_q);
        }

        res.json( games );

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const searchGamesPlatform = async(_q) => {   
    
    try {
        const games = await Game.find( { title: new RegExp(_q, 'i'), state: true } )
        return games
    } catch (error) {
        console.log(error);
    }
}

const gamesPlatform = async(_limit, _sort, _start, platform) => {   
    
    try {
        let platformID
        const { _id } = await Platform.findOne({ url: platform, state: true })

        platformID= _id

        const games = await Game.find( { platform: platformID, state: true } )
            .limit(Number( _limit ))
            .sort(_sort)
            .skip(Number( _start ))
        
        return games
    } catch (error) {
        console.log(error);
    }
}

const gamesGetLimitSort = async(_limit, _sort) => {    
    try {
        const games = await Game.find( { state: true } )
            .limit(Number( _limit ))
            .sort(Number( _sort ))
        
        return games

    } catch (error) {
        console.log(error);
    }
}

const gamesGetUrl = async( url ) => {    
    try {
        const [ games ] = await Promise.all([
            Game.find({ state: true, url })
                .populate('platform')
        ]);

        return games

    } catch (error) {
        console.log(error);
    }
}

// obtenerJuegos - populate
const gameGet = async( req, res = response ) => {

    const { id } = req.params;
    
    try {

        const product = await Game.findById( id )
            .populate('user', 'name')
            .populate('platform', 'title');
        
        res.json( product );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// crearGame
const gamePost = async( req, res = response ) => {
    
    const {state, ...body } = req.body;
    
    try {

        const gameDB = await Game.findOne({ url: body.url });

        if( gameDB ){
            return res.status(400).json({
                msg: `The url ${ gameDB.url } it already exists`
            });
        }

        // Genera la data a guardar
        const data = {
            ...body
        }

        const game = new Game( data );

        // Guarda DB
        await game.save();

        res.status(201).json(game);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

module.exports = {
    gamesGet,
    gameGet,
    gamePost
}