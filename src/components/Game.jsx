import { useState, useEffect } from 'react'
import Card from './Card'
import { cardsData } from '../data/cardData'
import '../styles/Game.css'
import shuffle from '../utils/shuffle'

export default function Game () {
    const [cards, setCards] = useState(cardsData)

    useEffect(() => {
        console.log(cards);
    }, [cards]);

    function handleCardClick(id) {
        let selectedCard = cards.find(item => 
                                item.id === id )

        if (selectedCard.isClicked) {
        console.log('Стоп игра')
        }
        else {
            setCards(prev => {
                const marked =  prev.map(item => 
                                item === selectedCard 
                                ? {...item, isClicked: true} 
                                : item)
                return shuffle(marked)
            });    
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