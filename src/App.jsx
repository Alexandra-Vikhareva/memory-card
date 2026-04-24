import { useState, useEffect } from 'react'
import './App.css'
import Card from './components/Card'
import { cardsData } from './data/cardData'

function App() {
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
      setCards(prev => 
                (prev.map(item => 
                  item === selectedCard 
                  ? {...item, isClicked: true} 
                  : item)))
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

export default App
