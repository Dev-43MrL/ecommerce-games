import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router';
import BasicLayout from '../layouts/BasicLayout';
import {getGameByUrlApi} from '../api/game';
import HeaderGame from '../components/Game/HeaderGame';
import TabsGame from '../components/Game/TabsGame';
import Seo from '../components/Seo';

export default function Game() {
    const {query} = useRouter();
    const [game, setGame] = useState(null);

    useEffect(() => {
        (async () => {
            const response= await getGameByUrlApi(query.game);
            
            setGame(response);
        })()
    }, [])

    if(!game) return null;

    return (
        <BasicLayout className='game'>
            <Seo title={game.title}/>
            <HeaderGame game={game} />
            <TabsGame game={game} />
        </BasicLayout>
    )
}
