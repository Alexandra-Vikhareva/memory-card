import { useRef, useState, useEffect } from 'react'

export function useSound() {
    const soundEnabled = useRef(true);
    
    const clickSound = useRef(new Audio('src/sounds/click.mp3'));
    const winSound = useRef(new Audio('src/sounds/win.mp3'));
    const loseSound = useRef(new Audio('src/sounds/lose.mp3'));

    const backgroundMusic = useRef(new Audio('src/sounds/Kitadani_Hiroshi_One_Piece_OP1_-_We_Are.mp3'));
    const [isMusicOn, setIsMusicOn] = useState(true);

    useEffect(() => {
        backgroundMusic.current.loop = true;
        backgroundMusic.current.volume = 0.3;

        const startMusic = () => {
            if (isMusicOn && soundEnabled.current) {
                backgroundMusic.current.play().catch(err => {
                    console.log('Музыка не запустилась:', err);
                });
            }
            document.removeEventListener('click', startMusic);
        };

        document.addEventListener('click', startMusic);
        
        return () => {
            document.removeEventListener('click', startMusic);
        };
    }, [isMusicOn]);
    
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

    const toggleMusic = () => {
        const newMusicState = !isMusicOn;
        setIsMusicOn(newMusicState);
        
        if (newMusicState && soundEnabled.current) {
            backgroundMusic.current.play().catch(err => console.log('Музыка не запустилась:', err));
        } else {
            backgroundMusic.current.pause();
        }
    };

    return { play, toggle, toggleMusic, soundEnabled: isSoundOn, musicEnabled: isMusicOn};
}