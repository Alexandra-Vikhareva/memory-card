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
        localStorage.setItem('maxScore', maxScore)
    }, [maxScore])

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

    function getFruitsCount() {
        const fruitsCount = fetch('https://api.api-onepiece.com/v2/fruits/en/count')
        .then(response => response.json())

        return fruitsCount
    }

    function getFruitItem(id) {
        const fruitItem = fetch(`https://api.api-onepiece.com/v2/fruits/en/${id}`)
        .then(response => response.json())
        .then(data => ({id: data.id, 
                       image: data.filename,
                       isClicked: false}))

        return fruitItem
    }

    async function getFruitList(listLength = 4) {
        let count = 0;
        const res = new Set();
        const maxId = await getFruitsCount();
        const ids = new Set();
        while (count < listLength) {
            const newId = Math.floor(Math.random() * maxId);
            if (!ids.has(newId)) {
                ids.add(newId);
                const newItem = await getFruitItem(newId);
                if (!(newItem.image == null)) res.add(newItem)
            }
            count = res.size
        }
        
        return res
    }

    getFruitList()

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