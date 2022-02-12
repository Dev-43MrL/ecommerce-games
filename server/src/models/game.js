const { Schema, model, SchemaTypes } = require('mongoose');

const GameSchema = Schema({
    title:{
        type: String,
        required: [true, 'The title is required']
    },
    platform:{
        type: SchemaTypes.ObjectId,
        ref: 'Platform',
        required: true
    },
    price:{
        type: Number,
        required: [true, 'The price is required']
    },
    discount:{
        type: Number,
        required: [true, 'The discount is required']
    },
    poster:{
        type: String,
        required: [true, 'The poster is required']
    },
    url:{
        type: String,
        required: [true, 'The url code is required'],
        unique: true
    },
    summary:{
        type: String,
        required: [true, 'The summary is required']
    },
    video:{
        type: String,
        required: [true, 'The video is required']
    },
    screenshots:[{
        name:{
            type: String,
            required: [true, 'The name is required']
        },
        url:{
            type: String,
            required: [true, 'The name is required']
        } 
    }],
    relaseDate:{
        type: Date
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
});

GameSchema.set('timestamps', true);

module.exports = model( 'Game', GameSchema );