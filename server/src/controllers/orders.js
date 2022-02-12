const { response } = require("express");
const { Order } = require("../models");
const Stripe = require('stripe')("sk_test_51Ja2zYI8lb3K90427bEmBf22IPXO9c69eT6bsAvzUWg6cjQOoEjs1aRmF8EWDYGyhVcGipppbRFtUCPunbOpHyt100VaaNw6ER");

// obtenerOrders - paginado -total - populate
const ordersGet = async( req, res = response ) => {

    const { _sort, user } = req.query;
    const query = { state: true, user };
    
    try {

        const orders = await Order.find( query )
                .populate('user', 'name')
                .populate('game')
                .sort(_sort)

        res.json(
            orders
        );
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// // obtenerProducto - populate
// const productGet = async( req, res = response ) => {

//     const { id } = req.params;
    
//     try {

//         const product = await Product.findById( id )
//             .populate('user', 'name')
//             .populate('category', 'name');
        
//         res.json( product );
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Por favor hable con el administrador'
//         });
//     }
// }

// crearOrden
const orderPost = async( req, res = response ) => {
    
    const { token, products, idUser, addressShipping } = req.body;
    
    try {

        let totalPayment = 0;

        products.forEach((product) => {
            totalPayment= totalPayment + product.price;
        });

        const charge = await Stripe.charges.create({
            amount: totalPayment * 100,
            currency: "eur",
            source: token.id,
            description: `ID Usuario: ${idUser}`,
        });
        for await (const product of products){
            const data= {
                game: product._id,
                user: idUser,
                totalPayment,
                paymentUid: charge.id,
                addressShipping,
            }

            const order = new Order( data );

            // Guarda DB
            await order.save();
    
        }
        res.status(201).json([{ ok: true }]);       
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

// // actualizarProducto
// const productPut = async( req, res = response ) => {

//     const { id } = req.params;
//     const { state, user, ...data } = req.body;
    
//     try {
            
//         data.name = data.name.toUpperCase();
//         data.user = req.user._id;

//         const product = await Product.findByIdAndUpdate( id, data, { new: true } );

//         res.json( product );
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Por favor hable con el administrador'
//         });
//     }
//}

// // borrarProducto - estado:false
// const productDelete = async( req, res = response ) => {

//     const { id } = req.params;
    
//     try {
    
//         const productDelete = await Product.findByIdAndUpdate( id, {state: false}, {new: true});

//         res.json( productDelete );
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             ok: false,
//             msg: 'Por favor hable con el administrador'
//         });       
//     }
// }

module.exports = {
    ordersGet,
    // productGet,
    orderPost,
    // productPut,
    // productDelete
}