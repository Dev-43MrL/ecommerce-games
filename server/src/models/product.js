const { Schema, model, SchemaTypes } = require('mongoose');

const ProductSchema = Schema({
    name:{
        type: String,
        required: [true, 'Name is required'],
        unique: true
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
    price:{
        type: Number,
        default: 0
    },
    category:{
        type: SchemaTypes.ObjectId,
        ref: 'Category',
        required: true
    },
    img: { type: String },
    description: { type: String },
    available: { type: Boolean, default: true } 
});

ProductSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Product', ProductSchema );