import React, {useState} from 'react';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { size } from 'lodash';
import useAuth from '../../../hooks/useAuth';
import useCart from '../../../hooks/useCart';
import { paymentCartApi } from '../../../api/cart';

export default function FormPayment(props) {
    const {products, address}=props;
    const [loading, setLoading] = useState(false);
    const {auth, logout}=useAuth();
    const stripe=useStripe();
    const elements =useElements();
    const {removeAllProductsCart}=useCart();
    const router= useRouter();

    const handleSubmit=async(event)=>{
        event.preventDefault();
        setLoading(true);
        
        if(!stripe || !elements) return;

        const cardElement=elements.getElement(CardElement);
        const result= await stripe.createToken(cardElement);

        if(result.error){
            toast.error('Error de pago', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }else{
            const response=await paymentCartApi(
                result.token,
                products,
                auth.idUser,
                address,
                logout
            );
            console.log(response, 'respknse')
            if(size(response)>0){
                toast.success('Pedido Completado', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                removeAllProductsCart();
                router.push("/orders");
            }else{
                toast.error('Error de pedido', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }

        setLoading(false);
    }

    return (
        <form className='form-payment' onSubmit={handleSubmit}>
            <CardElement style={{base: {fontSize: '18px'}}}/>
            <Button color='orange' loading={loading} disabled={!stripe} type='submit'>Pagar</Button>
        </form>
    )
}
