import { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/Game.css'
import shuffle from '../utils/shuffle'

export default function Game () {
    const [cards, setCards] = useState([]);
    const [isGameFinished, setGameFinished] = useState(false);
    const [currentScore, setCurrentScore] = useState(0);
    const [maxScore, setMaxScore] = useState(() => {const localScore = localStorage.getItem('maxScore');
                                                if (!localScore) return 0
                                                return localScore
                                            });
    const [isLoading, setLoading] = useState(true);
    const [difficulty, setDifficulty] = useState(0);
    const [isMain, setMain] = useState(true);

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

    function handleLevle(level) {
        setDifficulty(level)
        setMain(false)
        resetGame(level)
    }

    useEffect(() => {
        console.log(difficulty)
    }, [difficulty])

    async function resetGame(level = difficulty) {
        setLoading(true);
        try {
            const newArr = await getFruitList(level);
            setCards(newArr);
            setGameFinished(false);
            setCurrentScore(0);
        } catch (err) {
            console.error('Ошибка сброса:', err);
        } finally {
            setLoading(false);
        }
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
        const res = new Set();
        const maxId = await getFruitsCount();
        const ids = new Set();

        while (res.size < listLength) {
            const newId = Math.floor(Math.random() * maxId) + 1;
            if (!ids.has(newId)) {
                ids.add(newId);
                const newItem = await getFruitItem(newId);
                if (newItem.image && newItem.image.trim() !== '') res.add(newItem)
            }
        }
        
        return Array.from(res)
    }

    if (isMain) return <div className='main-menu'>
        <p>Выберите уровень</p>
        <button onClick={() => handleLevle(4)}>Лёгкий</button>
        <button onClick={() => handleLevle(8)}>Средний</button>
        <button onClick={() => handleLevle(12)}>Сложный</button>
        </div>
    if (isLoading) return (
        <div className='loading'>
            <img src="src/img/luffy-one-piece.gif" alt="Луффи бежит" />
            <div className='loading-dots'>Загрузка фруктов</div>
        </div>
        
    )
    else {
        return (
            <div>
                <button onClick={() => setMain(true)}>Выбрать уровень</button>
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
                <button className='new-game btn' onClick={() => resetGame(difficulty)}>Новая игра</button>
            </div>
        )}
}