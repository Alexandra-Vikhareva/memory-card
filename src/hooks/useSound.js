import { useRef, useState } from 'react'

export function useSound() {
    const soundEnabled = useRef(true);
    
    const clickSound = useRef(new Audio('src/sounds/click.mp3'));
    const winSound = useRef(new Audio('src/sounds/win.mp3'));
    const loseSound = useRef(new Audio('src/sounds/lose.mp3'));
    
    const play = (type) => {
        if (!soundEnabled.current) return;
        
        let sound;
        switch(type) {
            case 'click': sound = clickSound.current; break;
            case 'win': sound = winSound.current; break;
            case 'lose': sound = loseSound.current; break;
            default: return;
        }
        
        sound.currentTime = 0;
        sound.play().catch(err => console.log('Звук не воспроизвёлся:', err));
    };
    
    const [isSoundOn, setIsSoundOn] = useState(true); // Создаём состояние

    const toggle = () => {
        soundEnabled.current = !soundEnabled.current;
        setIsSoundOn(soundEnabled.current); // 👈 Обновляем состояние
    };

    // Возвращаем состояние из useState, а не ref.current
    return { play, toggle, soundEnabled: isSoundOn };
}