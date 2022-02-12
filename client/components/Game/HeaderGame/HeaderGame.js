import React, {useState, useEffect} from 'react';
import { Grid, Image, Icon, Button } from 'semantic-ui-react';
import { size } from 'lodash';
import { isFavoriteApi, addFavoriteApi, deleteFavoriteApi } from '../../../api/favorite';
import useAuth from '../../../hooks/useAuth';
import classNames from 'classnames';
import useCart from '../../../hooks/useCart';

export default function HeaderGame(props) {
    const {game}= props;
    const {poster, title}=game;

    return (
        <Grid className='header-game'>
            <Grid.Column mobile={16} table={6} computer={5}>
                <Image src={poster} alt={title} fluid />
            </Grid.Column>

            <Grid.Column mobile={16} table={10} computer={11}>
                <Info game={game}/>
            </Grid.Column>
        </Grid>
    )
}

function Info(props){
    const {game}=props;
    const {title, summary, price, discount, url} =game;
    const [isFavorite, setIsFavorite]= useState(false);
    const {auth, logout}=useAuth();
    const [favoriteReload, setFavoriteReload] =useState(false);
    const {addProductCart} =useCart();

    useEffect(() => {
        (async () => {
            const response= await isFavoriteApi(auth?.idUser, game._id, logout);
            if(size(response) > 0) setIsFavorite(true);
            else setIsFavorite(false);

        })();
        setFavoriteReload(false);
    }, [game, favoriteReload]);


    const addFavorite=async()=>{
        if(auth){
            await addFavoriteApi(auth.idUser, game._id, logout);
            setFavoriteReload(true);
        }
    }

    const deleteFavorite=async()=>{
        if(auth){
            await deleteFavoriteApi(auth.idUser, game._id, logout);
            setFavoriteReload(true);
        }
    }


    return(
        <>
            <div className='header-game__title'>
                {title}
                <Icon 
                    name={isFavorite? 'heart':'heart outline'} 
                    className={classNames({
                        like:isFavorite,
                    })}    
                    link
                    onClick={isFavorite? deleteFavorite : addFavorite}
                />
            </div>
            <div className='header-game__delivery'>
                Entrega en 24/48 horas
            </div>
            <div 
                className='header-game__summary' 
                dangerouslySetInnerHTML={{__html:summary}}
            />
            <div className='header-game__buy'>
                <div className='header-game__buy-price'>
                    <p>Precio de venta al publico: {price}$</p>
                    <div className='header-game__buy-price-actions'>
                        <p>{discount}%</p>
                        <p>{(price - Math.floor(price * discount) / 100).toFixed(2)}$</p>
                    </div>
                </div>
                <Button 
                    className='header-game__buy-btn' 
                    color='orange'
                    onClick={()=> addProductCart(url)}
                >
                    <Icon name='dollar' />Comprar
                </Button>
            </div>
        </>
    )
}
