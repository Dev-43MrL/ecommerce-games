import React, {useState, useEffect} from 'react'
import { deleteAddressApi, getAddressApi } from '../../../api/address';
import useAuth from '../../../hooks/useAuth';
import {map, size} from 'lodash';
import { Grid, Button, Icon } from 'semantic-ui-react';

export default function ListAddress(props) {
    const {reloadAddresses, setReloadAddresses, openModal}=props;
    const [addresses, setAddresses] = useState(null);
    const {auth, logout}=useAuth();

    useEffect(() => {
        (async ()=>{
            const response=await getAddressApi(auth.idUser, logout);
            setAddresses(response || []);
            setReloadAddresses(false);
        })();
    }, [reloadAddresses]);

    if(!addresses) return null;

    return (
        <div className='list-address'>
            {size(addresses) === 0 ?(
                <h4>No hay ninguna direccion creada</h4>
            ):(
                <Grid>
                    {map(addresses, (address) =>(
                        <Grid.Column key={address.id} mobile={16} tablet={8} computer={4}>
                            <Address 
                                address={address} 
                                logout={logout}
                                setReloadAddresses={setReloadAddresses}
                                openModal={openModal}
                            />
                        </Grid.Column>
                    ))}
                </Grid>
            )}
        </div>
    );
}

function Address(props){
    const {address, logout, setReloadAddresses, openModal} =props;
    const [loadingDelete, setLoadingDelete] = useState(false);

    const deleteAddress=async()=>{
        setLoadingDelete(true);

        const response= await deleteAddressApi(address._id, logout);
        
        if(response) setReloadAddresses(true);

        setLoadingDelete(false);
    }

    return(
        <div className='address'>
            <p>{address.title}</p>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>
                {address.state}, {address.city}, {address.postalCode}
            </p>
            <p>{address.phone}</p>
            <div className='actions'>
                <Button.Group>
                    <Button 
                        type='button' 
                        onClick={()=>openModal(`Editar: ${address.title}`, address)} 
                        color='orange'
                    >
                        <Icon name='edit' /> Editar
                    </Button>
                    <Button.Or />
                    <Button    
                        type='button' 
                        onClick={deleteAddress} 
                        loading={loadingDelete} 
                        color='red'
                    >
                        <Icon name='trash' /> Borrar
                    </Button>
                </Button.Group>
            </div>
        </div>
    )
}
