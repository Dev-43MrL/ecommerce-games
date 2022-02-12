const { Schema, model, SchemaTypes } = require('mongoose');

const OrderSchema = Schema({
    totalPayment:{
        type: String
    },
    paymentUid:{
        type: String,
        unique: false
    },
    addressShipping:{

    },
    game:{
        type: SchemaTypes.ObjectId,
        ref: 'Game',
        required: true
    },
    user:{
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    state:{
        type: Boolean,
        default: true,
        required: true
    },
});

OrderSchema.set('timestamps', true);

module.exports = model( 'Order', OrderSchema );