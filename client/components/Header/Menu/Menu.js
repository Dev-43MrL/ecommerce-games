import React, {useState, useEffect} from 'react'
import { Container, Menu, Grid, Icon, Label} from "semantic-ui-react";
import Link from 'next/link'; 
import BasicModal from '../../Modal/BasicModal';
import Auth from '../../Auth/Auth';
import useAuth from '../../../hooks/useAuth';
import { getMeApi } from '../../../api/user';
import { getPlatformApi } from '../../../api/platform';
import {map} from 'lodash';
import useCart from '../../../hooks/useCart';

export default function MenuWeb() {

    // ------------------ Hooks ------------------
    const [platforms, setPlatforms] =useState({});
    const [showModal, setShowModal] = useState(false);
    const [titleModal, setTitleModal] = useState("Iniciar Sesion");
    const {auth, logout} = useAuth();
    const [user, setUser] = useState(undefined);

    //---------------------- Funcion Anonima que se auto llama ----------------------------
    useEffect(() => {
        (async () => {
            const response = await getMeApi(logout);
            setUser(response);
        })()
    }, [auth]);

    useEffect(() => {
        (async () => {
            const response = await getPlatformApi();
            setPlatforms(response);
        })()
    }, []);

    const onShowModal=()=> setShowModal(true);
    const onCloseModal=()=> setShowModal(false);

    return (   
        <div className='menu'>
            <Container>
                <Grid>
                    <Grid.Column className='menu__left' width={6}>
                        <MenuPlatforms 
                            platforms={platforms}
                        />
                    </Grid.Column>
                    <Grid.Column className='menu__right' width={16}>
                        {user !== undefined && (
                            <MenuOptions 
                                onShowModal={onShowModal}
                                user={user}
                                logout={logout}
                            />
                        )}
                    </Grid.Column>
                </Grid>
            </Container>
            <BasicModal show={showModal} setShow={setShowModal} title={titleModal}>
                <Auth onCloseModal={onCloseModal} setTitleModal={setTitleModal}/>
            </BasicModal>
        </div>
    )
}

function MenuPlatforms(props){
    const {platforms}=props;
    return(
        <Menu>
            {map(platforms, (platform)=>(
                <Link href={`/games/${platform.url}`} key={platform._id}>                 
                    <Menu.Item as='a' name={platform.url}>
                        {platform.title}
                    </Menu.Item>
                </Link>
            ))}
        </Menu>
    );
}

function MenuOptions(props){
    const {onShowModal, user, logout}=props;
    const {productsCart}= useCart();

    return(
        <Menu>
            {
                user?(
                    <>
                        <Link href='/bills'>
                            <Menu.Item as='a'>
                                <Icon name='sticky note outline'/> 
                                Mis Facturas
                            </Menu.Item>
                        </Link>
                        <Link href='/orders'>
                            <Menu.Item as='a'>
                                <Icon name='game'/> 
                                Mis Pedidos
                            </Menu.Item>
                        </Link>
                        <Link href='/wishlist'>
                            <Menu.Item as='a'>
                                <Icon name='heart outline'/> 
                               Favoritos
                            </Menu.Item>
                        </Link>
                        <Link href='/account'>
                            <Menu.Item as='a'>
                                <Icon name='user outline'/>
                                {user.name} {user.lastname}
                            </Menu.Item>
                        </Link>
                        <Link href='/cart' className='m-0'>
                            <Menu.Item as='a'>
                                <Icon name='cart'/>
                                {productsCart>0 &&(
                                    <Label color='red' floating circular>
                                    {productsCart}
                                </Label> 
                                )}
                            </Menu.Item>
                        </Link>
                        <Menu.Item onClick={logout}  className='m-0'>
                            <Icon name='power off'/>
                        </Menu.Item>
                    </>

                ):(
                    <Menu.Item onClick={onShowModal}>
                        <Icon name='user outline'/>
                        Mi Cuenta
                    </Menu.Item>
                )
            }
        </Menu>
    );
}
