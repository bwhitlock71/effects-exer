import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Card from "./Card"


let baseAPI = 'https://deckofcardsapi.com/api/deck';

function Draw(){
    const [deck, setDeck] = useState(null);
    const [draw, setDraw] = useState([]);

    useEffect(() => {
        async function getData() {
            let results = await axios.get(`${baseAPI}/new/shuffle/`);
            setDeck(results.data);
        }
        getData();
    }, [setDeck]);

    const getCard = useCallback( 

        async () => {
            if(deck === null){
                return
            }
        let { deck_id } = deck;
            if(deck_id === null){
                return
            }
        try{
            let drawRes = await axios.get(`${baseAPI}/${deck_id}/draw/`)
            if(drawRes.data.remaining === 0) {
                throw new Error("no cards remaining!");
            }
            const card = drawRes.data.cards[0];

            setDraw(d => [
                ...d,
                {
                    id: card.code,
                    name: card.suit + " " + card.value,
                    image: card.image
                }
            ]);
            console.log("card drawn");
        } catch(err){
            alert(err);
        }
    }, [deck]);

    useEffect(() => {
    getCard();
    }, [getCard]);

    const card = draw.map(c => (
        <Card key={c.id} name={c.name} image={c.image} />
    ));

    return (
        <div className="Deck">
            <button className="Deck-draw" onClick={() => getCard()}>Draw Card!</button>
            <div>
                {card}
            </div>
        </div>

    )
}

export default Draw; 