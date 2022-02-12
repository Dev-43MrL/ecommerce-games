const mongoose = require('mongoose');
require('dotenv').config();

const dbConnection = async() => {
    try {
        
        await mongoose.connect( process.env.DB_CNN.toString(), {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Database Online 🟢')

    } catch (error) {
        console.log(error);
        throw new Error('Error al inicializar la base de datos 🔴');
    }
}

module.exports = {
    dbConnection
}