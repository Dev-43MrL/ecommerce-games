import React, {useState, useEffect} from 'react';
import BasicLayout from '../layouts/BasicLayout';
import {getGameByUrlApi} from '../api/game';
import useCart from '../hooks/useCart';
import SummaryCart from '../components/Cart/SummaryCart/SummaryCart';
import AddressShipping from '../components/Cart/AddressShipping/AddressShipping';
import Payment from '../components/Payment/Payment';
import Seo from '../components/Seo';

export default function cart() {
    const {getProductsCart}=useCart();
    const products= getProductsCart();

    return !products? 
        <EmptyCart />
        : 
        <FullCart products={products} />;
}

function EmptyCart(){
    return (
        <BasicLayout className='empty-cart'>
            <Seo title={`Cart`}/>
            <h2>No hay productos en el carrito</h2>
        </BasicLayout>
    )
}

function FullCart(props){
    const {products} =props;
    const [reloadCart, setReloadCart] = useState(false);
    const [productsData, setProductsData] = useState(null);
    const [address, setAddress]= useState(null);

    useEffect(() => {
        (async ()=>{
            const productsTemp=[];
            for await (const product of products){
                const data= await getGameByUrlApi(product);
                productsTemp.push(data);
            }
            setProductsData(productsTemp);
        })();
        setReloadCart(false);
    }, [reloadCart]);

    return (
        <BasicLayout className='full-cart'>
            <Seo title={`Cart`}/>
            <SummaryCart 
                products={productsData}
                reloadCart={reloadCart}
                setReloadCart={setReloadCart}
            />
            <AddressShipping setAddress={setAddress}/>
            {address && <Payment products={productsData} address={address}/>}
        </BasicLayout>
    )
}
