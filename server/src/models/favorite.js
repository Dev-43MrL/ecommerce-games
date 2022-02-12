const { Schema, model, SchemaTypes } = require('mongoose');

const FavoriteSchema = Schema({
    game:{
        type: SchemaTypes.ObjectId,
        ref: 'Game',
        required: true
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
});

FavoriteSchema.set('timestamps', true);
FavoriteSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Favorite', FavoriteSchema );