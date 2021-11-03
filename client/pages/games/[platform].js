import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import BasicLayout from '../../layouts/BasicLayout';
import { getGamesPlatformApi, getTotalGamesPlatformApi } from '../../api/game';
import { size } from 'lodash';
import { Loader } from 'semantic-ui-react';
import ListGames from '../../components/ListGames/ListGames';
import PaginationScreen from '../../components/PaginationScreen/PaginationScreen';


const limitPerPage=10;

export default function platForm() {
    const {query}=useRouter();
    const [games, setGames]=useState(null);
    const [totalGames, setTotalGames] = useState(null);

    const getStartItems=()=>{
        const currentPages= parseInt(query.page);
        if(!query.page || currentPages === 1) return 0;
        else return currentPages * limitPerPage - limitPerPage;
    };    

    useEffect(() => {       
        (async () => {
            if(query.platform){
                const response= await getGamesPlatformApi(query.platform, limitPerPage, getStartItems());
                setGames(response);
            }
        })()
    }, [query]);

    useEffect(() => {
        (async () => {
            const response= await getTotalGamesPlatformApi(query.platform);
            setTotalGames(response);
        })
    }, [query]);

    return (
        <BasicLayout className='platform'>
            {!games && <Loader active>Cargando Juegos</Loader>}
            {games && size(games) === 0 &&(
                <div>
                    <h3>No hay juegos</h3>
                </div>
            )}
            {size(games) > 0 && <ListGames games={games}/>}

            <PaginationScreen 
                totalGames={totalGames} 
                page={query.page? parseInt(query.page):1}
                limitPerPage={limitPerPage} 
            />
            
        </BasicLayout>
    )
}

