import { useState, useEffect } from 'react'
import Card from './Card'
import { cardsData } from '../data/cardData'
import '../styles/Game.css'
import shuffle from '../utils/shuffle'

export default function Game () {
    const [cards, setCards] = useState(cardsData);
    const [isGameFinished, setGameFinished] = useState(false);

    useEffect(() => {
        console.log(cards);
    }, [cards]);

    useEffect(() => {
        if (cards.every(el => el.isClicked)) {
            console.log('Вы победили!')
        }else if (isGameFinished){
                console.log('Вы проиграли!')
        }
    }, [cards, isGameFinished])

    function handleCardClick(id) {
        if (!isGameFinished) {
            let selectedCard = cards.find(item => 
                                item.id === id )

            if (selectedCard.isClicked) {
                setGameFinished(true)
            }
            else {
                setCards(prev => {
                    const marked =  prev.map(item => 
                                    item.id === id 
                                    ? {...item, isClicked: true} 
                                    : item);
                    const allClicked = marked.every(el => el.isClicked === true);
                    setGameFinished(allClicked);
                    return allClicked? marked : shuffle(marked)
                });    
            }
        }   
    }

    return (
        <div className='cardsGrid'>
            {
                cards.map((item)=> (
                <Card image={item.image} 
                        id={item.id}
                        key={item.id}
                        onClick={handleCardClick}></Card>
                ))   
            }
        </div>
    )
}