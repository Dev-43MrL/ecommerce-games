import React, {useState, useEffect} from 'react';
import { Grid, Button } from 'semantic-ui-react';
import { map, size } from 'lodash';
import Link from 'next/link';
import {getAddressApi} from '../../../api/address';
import useAuth from '../../../hooks/useAuth';
import classNames from 'classnames';

export default function AddressShipping(props) {
    const {setAddress}=props;
    const [addressActive, setAddressActive] = useState(null);
    const [addresses, setAddresses] = useState(null);
    const {auth, logout}=useAuth();

    useEffect(() => {
        (async ()=>{
            const response= await getAddressApi(auth.idUser, logout);
            setAddresses(response || []);
        })()
    }, [])

    return (
        <div className='address-shipping'>
            <div className='title'>Direccion de envio</div>
            <div className='data'>
                {size(addresses) === 0 ?(
                    <h3>No hay direcciones creadas
                        <Link href='/account'>
                            <a>Añadir tu primera direccion.</a>
                        </Link>
                    </h3>
                ):(
                    <Grid>
                        {map(addresses, (address)=>(
                            <Grid.Column 
                                key={address._id}
                                mobile={16}
                                tablet={8}
                                computer={4}
                            >
                                <Address 
                                    address={address} 
                                    addressActive={addressActive} 
                                    setAddressActive={setAddressActive}
                                    setAddress={setAddress}
                                />
                            </Grid.Column>
                        ))}
                    </Grid>
                )}
            </div>
        </div>
    )
}


function Address(props){
    const {address, addressActive, setAddressActive, setAddress}=props;
    const changeAddress=()=>{
        setAddressActive(address._id);
        setAddress(address);
    }


    return(
        <div className={classNames('address', {
            active:addressActive === address._id,
        })}
            onClick={changeAddress}
        >
            <p>{address.title}</p>
            <p>{address.name}</p>
            <p>{address.address}</p>
            <p>{address.city}, {address.estate}, {address.postalCode}</p>
            <p>{address.phone}</p>
        </div>
    )
}