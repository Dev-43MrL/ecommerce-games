import React, {useEffect, useState} from 'react';
import Basiclayout from '../layouts/BasicLayout';
import { searchGamesApi } from '../api/game';
import { useRouter } from 'next/router';
import { size } from 'lodash';
import ListGames from '../components/ListGames';
import { Loader } from 'semantic-ui-react';

export default function search() {
    const [games, setGames] = useState(null);
    const {query}= useRouter();
    
    useEffect(() => {
        document.getElementById('search-game').focus();
    }, []);

    useEffect(() => {
        (async () => {
            if(size(query.query)>0){
                const response=await searchGamesApi(query.query);
                console.log(response);
                if(size(response)>0) setGames(response);
                else setGames([]);
            }else{
                setGames([]);
            }
        })()
    }, [query])

    return (
        <Basiclayout className='search'>
            {!games && <Loader active>Buscando Juegos</Loader>}
            {games && size(games) === 0 &&(
                <div>
                    <h3>No se han encontrado juegos</h3>
                </div>
            )}
            {size(games) > 0 && <ListGames games={games}/>}
        </Basiclayout>
    )
}
