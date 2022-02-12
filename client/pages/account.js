import React, {useState, useEffect} from 'react';
import BasicLayout from '../layouts/BasicLayout';
import {useRouter} from 'next/router';
import { getMeApi } from '../api/user';
import useAuth from '../hooks/useAuth';
import ChangeNameForm from '../components/Account/ChangeNameFor/ChangeNameForm';
import ChangeEmailForm from '../components/Account/ChangeEmailForm';
import ChangePasswordForm from '../components/Account/ChangePasswordForm';
import { Icon } from 'semantic-ui-react';
import BasicModal from '../components/Modal/BasicModal';
import AddressForm from '../components/Account/AddressForm';
import ListAddress from '../components/Account/ListAddress';
import { Loader } from 'semantic-ui-react';
import Seo from '../components/Seo';

export default function Account() {

    const [user, setUser]= useState(undefined);
    const {auth, logout, setReloadUser}= useAuth();
    const router = useRouter();

    //----------------- Detecta cuando cambio de usuario -----------------------
    useEffect(() => {
        (async () => {
            const response =await getMeApi(logout);
            setUser(response || null);
        })();
    }, [auth]);

    if(user === undefined)return null;
    if(!auth && !user){
        router.replace('/');
        return null;
    }

    return (
        <BasicLayout className='account'>
            <Seo title={`Account ${user.name} ${user.lastname}`}/>
            {!user && <Loader active>Cargando Configuracion</Loader>}
            <Configuration 
                user={user} 
                logout={logout} 
                setReloadUser={setReloadUser}
            />
        </BasicLayout>
    )
}


function Configuration(props){
    const {user, logout, setReloadUser}=props;

    return(
        <div className='account__configuration'>
            <div className='title'>Configuracion</div>
            <div className='data'>
                <ChangeNameForm 
                    user={user} 
                    logout={logout} 
                    setReloadUser={setReloadUser}
                />
                <ChangeEmailForm 
                    user={user} 
                    logout={logout} 
                    setReloadUser={setReloadUser}
                />
                <ChangePasswordForm
                    user={user} 
                    logout={logout}
                />
                <Addresses/>
            </div>
        </div>
    )
};

function Addresses(){
    const [showModal, setShowModal]=useState(false);
    const [titleModal, setTitleModal]=useState('');
    const [formModal, setFormModal]=useState(null);
    const [reloadAddresses, setReloadAddresses]=useState(false);

    const openModal=(title, address)=>{
        setTitleModal(title);
        setFormModal(
            <AddressForm 
                setShowModal={setShowModal}
                setReloadAddresses={setReloadAddresses}
                newAddress={address? false:true}
                address={address || null}
            />);
        setShowModal(true);
    }

    return(
        <div className='account__addresses'>
            <div className='title'>
                Direcciones
                <Icon name='plus' link onClick={()=> openModal('Nueva Direccion')}/>
            </div>
            <div className='data'>
                <ListAddress 
                    reloadAddresses={reloadAddresses} 
                    setReloadAddresses={setReloadAddresses}
                    openModal={openModal}
                />
            </div>

            <BasicModal 
                show={showModal} 
                setShow={setShowModal} 
                title={titleModal}
            >
                {formModal}
            </BasicModal>
        </div>
    )
}