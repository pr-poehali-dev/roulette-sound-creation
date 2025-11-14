import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const numbers = [
  { num: 0, color: 'green' },
  { num: 32, color: 'red' }, { num: 15, color: 'black' }, { num: 19, color: 'red' }, { num: 4, color: 'black' },
  { num: 21, color: 'red' }, { num: 2, color: 'black' }, { num: 25, color: 'red' }, { num: 17, color: 'black' },
  { num: 34, color: 'red' }, { num: 6, color: 'black' }, { num: 27, color: 'red' }, { num: 13, color: 'black' },
  { num: 36, color: 'red' }, { num: 11, color: 'black' }, { num: 30, color: 'red' }, { num: 8, color: 'black' },
  { num: 23, color: 'red' }, { num: 10, color: 'black' }, { num: 5, color: 'red' }, { num: 24, color: 'black' },
  { num: 16, color: 'red' }, { num: 33, color: 'black' }, { num: 1, color: 'red' }, { num: 20, color: 'black' },
  { num: 14, color: 'red' }, { num: 31, color: 'black' }, { num: 9, color: 'red' }, { num: 22, color: 'black' },
  { num: 18, color: 'red' }, { num: 29, color: 'black' }, { num: 7, color: 'red' }, { num: 28, color: 'black' },
  { num: 12, color: 'red' }, { num: 35, color: 'black' }, { num: 3, color: 'red' }, { num: 26, color: 'black' }
];

interface RouletteWheelProps {
  onSpin: (result: number, color: string) => void;
  disabled: boolean;
}

export default function RouletteWheel({ onSpin, disabled }: RouletteWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIF2i78OScTQwOUKnk8LdjHAU7k9n0zH0sBSl+zPLaizsKFF+27O6oVRYKR6Hh8sFuIgUsgs/y2ok3CBZnvPDknE0MDlGq5fG5Yx0GO5PZ9Mx+KwYpf83y24o8ChVftu3wqVQXCkih4vLBbiIGLILP8tqJNwgVZ7zw5ZxNDA5SqubyvWQdBj2U2vXNfywGKoDO8t2LPAoVYLjv8apVFwpJouLyw28iBi2C0PLajDcIF2i88OWcTQwPU6vn87hlHgY9ldv1zn8sBSuBz/LcizsJFGC58O+rVRcKSaPj8sRvIgYtg9Hy24w3CBdpvfHmnE4MD1Sr6fO5ZR4GPZXL9c5/LAUrgc/y3Ys7CRRgufDvq1UXCkqk5PLEcCIHLYPR8tyNNwgXab3y5p1ODA9Uq+n0uWYeBz6Wy/bPgC0GK4LQ8t6MPAoVYbry8axWGAtKpOTypHAiBz'); 
    audioRef.current = audio;
  }, []);

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    const randomIndex = Math.floor(Math.random() * numbers.length);
    const result = numbers[randomIndex];
    const spins = 5;
    const degreesPerNumber = 360 / numbers.length;
    const targetRotation = (spins * 360) + (randomIndex * degreesPerNumber);
    
    setRotation(targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpin(result.num, result.color);
    }, 4000);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-80 h-80">
        <div className="absolute inset-0 rounded-full neon-border border-4 border-primary animate-pulse-glow" />
        
        <div 
          className="absolute inset-4 rounded-full bg-gradient-to-br from-accent via-accent to-green-900 shadow-2xl transition-transform duration-[4000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="absolute inset-0 rounded-full border-8 border-primary/30" />
          
          {numbers.map((item, index) => {
            const angle = (index * (360 / numbers.length)) - 90;
            const radius = 130;
            const x = Math.cos((angle * Math.PI) / 180) * radius;
            const y = Math.sin((angle * Math.PI) / 180) * radius;
            
            return (
              <div
                key={index}
                className="absolute w-10 h-10 flex items-center justify-center rounded-full font-bold text-white shadow-lg"
                style={{
                  left: `calc(50% + ${x}px - 20px)`,
                  top: `calc(50% + ${y}px - 20px)`,
                  backgroundColor: item.color === 'red' ? '#DC143C' : item.color === 'black' ? '#1a1a1a' : '#047857',
                  border: '2px solid #FFD700'
                }}
              >
                {item.num}
              </div>
            );
          })}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full gold-gradient border-4 border-white shadow-2xl" />
          </div>
        </div>

        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 z-10"
          style={{
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '30px solid #FFD700',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
          }}
        />
      </div>

      <Button
        onClick={spinWheel}
        disabled={disabled || isSpinning}
        size="lg"
        className="gold-gradient text-black font-bold text-xl px-12 py-6 rounded-full neon-border hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'КРУТИТСЯ...' : 'КРУТИТЬ'}
      </Button>
    </div>
  );
}
