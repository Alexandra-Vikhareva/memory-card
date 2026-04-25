import { useState, useEffect } from 'react'
import Card from './Card'
import { cardsData } from '../data/cardData'
import '../styles/Game.css'
import shuffle from '../utils/shuffle'

export default function Game () {
    const [cards, setCards] = useState(cardsData);
    const [isGameFinished, setGameFinished] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [maxScore, setMaxScore] = useState(() => {const localScore = localStorage.getItem('maxScore');
                                                if (!localScore) return 0
                                                return localScore
                                            });

    useEffect(() => {
        console.log(cards);
    }, [cards]);

    useEffect(() => {
        localStorage.setItem('maxScore', maxScore)
    }, [maxScore])

    // useEffect(() => {
    //     if (cards.every(el => el.isClicked)) {
    //         console.log('Вы победили!')
    //     }else if (isGameFinished){
    //             console.log('Вы проиграли!')
    //     }
    // }, [cards, isGameFinished])

    function handleCardClick(id) {
        if (!isGameFinished) {
            let selectedCard = cards.find(item => 
                                item.id === id )

            if (selectedCard.isClicked) {
                setGameFinished(true)
            }
            else {
                const newScore = currentScore + 1;
                setCurrentScore(newScore);
                if (newScore > maxScore) setMaxScore(newScore)
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

    function resetGame() {
        const newArr = shuffle(cardsData);
        setCards(newArr);
        setGameFinished(false);
        setCurrentScore(0);
    }

    return (
        
        <div>
            <div className='info'>
                <div>Счёт: {currentScore}</div>
                <div>Рекорд: {maxScore}</div>
            </div>
            {isGameFinished && (
                <div className={`game-message ${cards.every(card => card.isClicked) ? 'win' : 'loose'}`}>
                {cards.every(card => card.isClicked) 
                    ? '🎉 Победа! 🎉' 
                    : '💀 Вы проиграли! 💀'}
                </div>
            )}

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
            <button className='new-game btn' onClick={resetGame}>Новая игра</button>
        </div>
    )
}