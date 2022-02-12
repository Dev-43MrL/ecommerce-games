const { Schema, model, SchemaTypes } = require('mongoose');

const PlatformSchema = Schema({
    title:{
        type: String,
        required: [true, 'The title is required']
    },
    url:{
        type: String,
        required: [true, 'The url is required'],
        unique: true
    },
    position:{
        type: Number
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    }
});

PlatformSchema.methods.toJSON = function(){
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Platform', PlatformSchema );