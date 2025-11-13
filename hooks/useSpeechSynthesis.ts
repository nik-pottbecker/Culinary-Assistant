
import { useState, useEffect, useCallback } from 'react';

interface SpeakProps {
    text: string;
    onEnd?: () => void;
}

const useSpeechSynthesis = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setSupported(true);
        }
    }, []);

    const speak = useCallback(({ text, onEnd }: SpeakProps) => {
        if (!supported) return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };
        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
            if (onEnd) {
                onEnd();
            }
        };
        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };
        
        window.speechSynthesis.speak(utterance);
    }, [supported]);
    
    const pause = useCallback(() => {
        if(isSpeaking && !isPaused) {
            window.speechSynthesis.pause();
            setIsPaused(true);
        }
    }, [isSpeaking, isPaused]);

    const resume = useCallback(() => {
        if(isPaused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
        }
    }, [isPaused]);

    const cancel = useCallback(() => {
        if (supported) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setIsPaused(false);
        }
    }, [supported]);

    return {
        isSpeaking,
        isPaused,
        speak,
        pause,
        resume,
        cancel,
        supported,
    };
};

export default useSpeechSynthesis;
