import React, {useState, useEffect} from 'react';
import BasicLayout from '../layouts/BasicLayout/BasicLayout';
import { size, forEach } from 'lodash';
import { getFavoriteApi } from '../api/favorite';
import useAuth from '../hooks/useAuth';
import ListGames from '../components/ListGames';
import { Loader } from 'semantic-ui-react';

export default function wishlist() {
    const [games, setGames] = useState(null);
    const {auth, logout}=useAuth();

    useEffect(() => {
        (async () => {
            const response =await getFavoriteApi(auth.idUser, logout);
            
            if(size(response)>0){ 
                const gamesList=[];

                forEach(response, (data) => {
                    gamesList.push(data.game);
                });
                setGames(gamesList);
            }else{
                setGames([]);
            }
        })()
    }, [])

    return (
        <BasicLayout className='wishlist'>
            <div className='wishlist__block'>
                <div className='title' > Lista de favoritos</div>
                <div className='data'>
                    {!games && <Loader active>Cargando Juegos</Loader>}
                    {games && size(games) === 0 &&(
                        <div>
                            <h3>No hay juegos</h3>
                        </div>
                    )}
                {size(games) > 0 && <ListGames games={games}/>}

                </div>
            </div>
        </BasicLayout>
    )
}
