const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
const { dbConnection } = require('./database/config');
const fileUpload = require('express-fileupload');


const PORT = process.env.PORT;

// Conectar a la DB
dbConnection(); 

// Directorio Publico
app.use( express.static('public') );

// Cors
app.use( cors() );

// Parseo y lectura del body
app.use( express.json() );

// fileupload - Carga de archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/',
    createParentPath: true
}));

// Routes
const paths = {
    users: '/api/users',
    search: '/api/search',
    auth: '/api/auth',
    categories: '/api/categories',
    products: '/api/products',
    uploads: '/api/uploads',
    events: '/api/events',
    addresses: '/api/addresses',
    platforms: '/api/platforms',
    games: '/api/games',
    favorites: '/api/favorites',
    orders: '/api/orders',
}

app.use( paths.auth, require( './routes/auth' ) );
app.use( paths.search, require( './routes/search' ) );
app.use( paths.users, require( './routes/user' ) );
app.use( paths.categories, require( './routes/categories' ) );
app.use( paths.products, require( './routes/products' ) );
app.use( paths.uploads, require( './routes/uploads' ) );
app.use( paths.events, require( './routes/events' ) );
app.use( paths.addresses, require( './routes/addresses' ) );
app.use( paths.platforms, require( './routes/platforms' ) );
app.use( paths.games, require( './routes/games' ) );
app.use( paths.favorites, require( './routes/favorites' ) );
app.use( paths.orders, require( './routes/orders' ) );

// Initial Server
app.listen( PORT, () => {
    console.log( 'Server on Port 🖥', PORT );
});