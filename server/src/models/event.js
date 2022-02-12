const { Schema, model, SchemaTypes } = require('mongoose');

const EventSchema = Schema({
    title:{
        type: String,
        required: [true, 'Title is required']
    },
    notes: {
        type: String
    },
    start:{
        type: Date,
        required: true
    },
    end:{
        type: Date,
        required: true
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
    },
    img: { type: String }
});

EventSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Event', EventSchema );