import { useState, useEffect } from 'react'
import Card from './Card'
import '../styles/Game.css'
import shuffle from '../utils/shuffle'
import { useSound } from '../hooks/useSound'

export default function Game () {
    const { play, toggle, toggleMusic, soundEnabled, musicEnabled } = useSound();

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
    const [hoverLevel, setHoverLevel] = useState(null);

    useEffect(() => {
        localStorage.setItem('maxScore', maxScore)
    }, [maxScore])

    function handleCardClick(id) {
        if (!isGameFinished) {
            let selectedCard = cards.find(item => 
                                item.id === id )

            if (selectedCard.isClicked) {
                play('lose');
                setGameFinished(true)
            }
            else {
                play('click');
                const newScore = currentScore + 1;
                setCurrentScore(newScore);
                if (newScore > maxScore) setMaxScore(newScore)
                setCards(prev => {
                    const marked =  prev.map(item => 
                                    item.id === id 
                                    ? {...item, isClicked: true} 
                                    : item);
                    const allClicked = marked.every(el => el.isClicked === true);
                    if (allClicked) {
                        play('win')
                    };
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
            setHoverLevel(null);
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

    if (isMain) {

        let backgroundUrl = '';
        switch (hoverLevel) {
            case 4: 
                backgroundUrl = 'img/arlong-park.webp';
                break;
            case 8:
                backgroundUrl = 'img/Alabasta.jpg';
                break;
            case 12:
                backgroundUrl = 'img/skull-dome.webp';
                break;
            default: 
                backgroundUrl = 'img/wallpaper-one-piece.jpg';
        }
        
        return (
            <div className='menu-screen'
            style={{backgroundImage: `url(${backgroundUrl})`}}>
                <button onClick={toggle} className="sound-toggle">
                        {soundEnabled ? '🔊' : '🔇'}
                </button>
                <button onClick={toggleMusic} className="sound-btn">
                            {musicEnabled ? '🎵' : '⏸️'}
                        </button>
                <div className='main-menu'>
                    <p>Выберите уровень</p>
                    <button onClick={() => handleLevle(4)}
                            onMouseEnter={() => setHoverLevel(4)}
                            onMouseLeave={() => setHoverLevel(null)}>
                                Лёгкий</button>
                    <button onClick={() => handleLevle(8)}
                            onMouseEnter={() => setHoverLevel(8)}
                            onMouseLeave={() => setHoverLevel(null)}>
                                Средний</button>
                    <button onClick={() => handleLevle(12)}
                            onMouseEnter={() => setHoverLevel(12)}
                            onMouseLeave={() => setHoverLevel(null)}>
                                Сложный</button>
                </div>
            </div>
    )}

    if (isLoading) return (
        <div className='loading'>
            <img src="img/luffy-one-piece.gif" alt="Луффи бежит" />
            <div className='loading-dots'>Загрузка фруктов</div>
        </div>
        
    )
    else {
        return (
            <div className='game'>
                <div className='game-header'>
                        <button onClick={() => setMain(true)}>Выбрать уровень</button>
                        <button onClick={toggle} className="sound-toggle">
                            {soundEnabled ? '🔊' : '🔇'}
                        </button>
                        <button onClick={toggleMusic} className="sound-btn">
                            {musicEnabled ? '🎵' : '⏸️'}
                        </button>
                        <div className='info'>
                            <div>Счёт: {currentScore}</div>
                            <div>Рекорд: {maxScore}</div>
                        </div>
                </div>

                <div className='game-board'>
                    
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
                </div>

                <button className='new-game' onClick={() => resetGame(difficulty)}>
                    Новая игра
                </button>
            </div>
        )}
}