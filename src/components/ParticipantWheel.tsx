import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Participant {
  id: string;
  nickname: string;
  bet: number;
}

interface ParticipantWheelProps {
  participants: Participant[];
  onSpinComplete: (winner: Participant) => void;
  disabled: boolean;
}

export default function ParticipantWheel({ participants, onSpinComplete, disabled }: ParticipantWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTcIF2i78OScTQwOUKnk8LdjHAU7k9n0zH0sBSl+zPLaizsKFF+27O6oVRYKR6Hh8sFuIgUsgs/y2ok3CBZnvPDknE0MDlGq5fG5Yx0GO5PZ9Mx+KwYpf83y24o8ChVftu3wqVQXCkih4vLBbiIGLILP8tqJNwgVZ7zw5ZxNDA5SqubyvWQdBj2U2vXNfywGKoDO8t2LPAoVYLjv8apVFwpJouLyw28iBi2C0PLajDcIF2i88OWcTQwPU6vn87hlHgY9ldv1zn8sBSuBz/LcizsJFGC58O+rVRcKSaPj8sRvIgYtg9Hy24w3CBdpvfHmnE4MD1Sr6fO5ZR4GPZXL9c5/LAUrgc/y3Ys7CRRgufDvq1UXCkqk5PLEcCIHLYPR8tyNNwgXab3y5p1ODA9Uq+n0uWYeBz6Wy/bPgC0GK4LQ8t6MPAoVYbry8axWGAtKpOTypHAiBz');
    audioRef.current = audio;
  }, []);

  const spinWheel = () => {
    if (isSpinning || participants.length === 0) return;
    
    setIsSpinning(true);
    
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const spins = 5;
    const degreesPerSegment = 360 / participants.length;
    const targetRotation = (spins * 360) + (winnerIndex * degreesPerSegment) + (degreesPerSegment / 2);
    
    setRotation(rotation + targetRotation);

    setTimeout(() => {
      setIsSpinning(false);
      onSpinComplete(participants[winnerIndex]);
    }, 4000);
  };

  const getColor = (index: number) => {
    const colors = ['#DC143C', '#FFD700', '#1E90FF', '#32CD32', '#FF6347', '#9370DB', '#FF8C00', '#20B2AA'];
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-96 h-96">
        <div className="absolute inset-0 rounded-full neon-border border-4 border-primary animate-pulse-glow" />
        
        <div 
          className="absolute inset-4 rounded-full bg-gradient-to-br from-card to-muted shadow-2xl transition-transform duration-[4000ms] ease-out overflow-hidden"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {participants.length > 0 ? (
            <>
              {participants.map((participant, index) => {
                const angle = (360 / participants.length) * index;
                const nextAngle = (360 / participants.length) * (index + 1);
                
                return (
                  <div
                    key={participant.id}
                    className="absolute inset-0"
                    style={{
                      background: `conic-gradient(from ${angle}deg, ${getColor(index)} ${angle}deg, ${getColor(index)} ${nextAngle}deg, transparent ${nextAngle}deg)`,
                    }}
                  />
                );
              })}
              
              {participants.map((participant, index) => {
                const angle = ((360 / participants.length) * index + (360 / participants.length) / 2) - 90;
                const radius = 140;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                
                return (
                  <div
                    key={`text-${participant.id}`}
                    className="absolute font-bold text-white text-sm px-2 py-1 bg-black/50 rounded backdrop-blur-sm"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {participant.nickname}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              Добавьте участников
            </div>
          )}
          
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full gold-gradient border-4 border-white shadow-2xl" />
          </div>
        </div>

        <div 
          className="absolute top-2 left-1/2 -translate-x-1/2 w-0 h-0 z-10"
          style={{
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '40px solid #FFD700',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))'
          }}
        />
      </div>

      <Button
        onClick={spinWheel}
        disabled={disabled || isSpinning || participants.length === 0}
        size="lg"
        className="gold-gradient text-black font-bold text-xl px-12 py-6 rounded-full neon-border hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSpinning ? 'КРУТИТСЯ...' : 'КРУТИТЬ РУЛЕТКУ'}
      </Button>
    </div>
  );
}
