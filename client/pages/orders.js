import React, {useState, useEffect} from 'react';
import { Grid, Loader } from 'semantic-ui-react';
import { map, size } from 'lodash'; 
import BasicLayout from '../layouts/BasicLayout';
import { getOrdersApi } from '../api/order';
import useAuth from '../hooks/useAuth';
import Order from '../components/Orders/Order';
import Seo from '../components/Seo';

export default function orders() {
    const [orders, setOrders] = useState(null);
    const {auth, logout}= useAuth();

    useEffect(() => {
        (async ()=>{
            const response= await getOrdersApi(auth.idUser, logout);
            setOrders(response || []);
        })()
    }, [])

    return (
        <BasicLayout className='orders'>
            <div className='orders__block'>
                <div className='title'>Mis Pedidos</div>
                <div className='data'>
                <Seo title={`Orders`}/>
                {!orders && <Loader active>Cargando Configuracion</Loader>}
                    {size(orders) === 0 ?(
                        <h2 style={{textAlign: 'center'}}>
                            Todavia no has realizado ninguna compra
                        </h2>
                    ):(
                        <OrderList orders={orders}/>
                    )}
                </div>
            </div>
        </BasicLayout>
    )
}

function OrderList(props){
    const {orders}=props;

    return(
        <Grid>
            {map(orders, (order, i) =>(
                <Grid.Column key={i} mobile={16} tablet={6} computer={8}>
                    <Order order={order}/>
                </Grid.Column>
            ))}
        </Grid>
    )
}