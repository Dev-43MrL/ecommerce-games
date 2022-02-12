const { Schema, model, SchemaTypes } = require('mongoose');

const AddressSchema = Schema({
    title:{
        type: String,
        required: [true, 'The title is required']
    },
    name:{
        type: String,
        required: [true, 'The name is required']
    },
    address:{
        type: String,
        required: [true, 'The address is required']
    },
    city:{
        type: String,
        required: [true, 'The city is required']
    },
    estate:{
        type: String,
        required: [true, 'The estate is required']
    },
    postalCode:{
        type: String,
        required: [true, 'The postal code is required']
    },
    phone:{
        type: String,
        required: [true, 'The phone is required']
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

AddressSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Address', AddressSchema );