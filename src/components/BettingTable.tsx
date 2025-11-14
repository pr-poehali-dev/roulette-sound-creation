import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface BettingTableProps {
  selectedBets: Array<{ type: string; value: number | string; amount: number }>;
  onPlaceBet: (type: string, value: number | string) => void;
  onClearBets: () => void;
  disabled: boolean;
}

const chipValues = [10, 50, 100, 500, 1000];

export default function BettingTable({ selectedBets, onPlaceBet, onClearBets, disabled }: BettingTableProps) {
  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const numbers = [];
  for (let i = 1; i <= 36; i++) {
    numbers.push(i);
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-6">
        <div className="grid grid-cols-3 gap-2 mb-4">
          {numbers.map((num) => {
            const isRed = redNumbers.includes(num);
            const bet = selectedBets.find(b => b.type === 'number' && b.value === num);
            
            return (
              <Button
                key={num}
                onClick={() => onPlaceBet('number', num)}
                disabled={disabled}
                className={`relative h-16 font-bold text-lg ${
                  isRed 
                    ? 'bg-[#DC143C] hover:bg-red-700' 
                    : 'bg-[#1a1a1a] hover:bg-gray-900'
                } text-white border-2 border-primary/50`}
              >
                {num}
                {bet && (
                  <Badge className="absolute -top-2 -right-2 bg-primary text-black">
                    {bet.amount}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => onPlaceBet('color', 'red')}
            disabled={disabled}
            className="bg-[#DC143C] hover:bg-red-700 text-white font-bold h-14 border-2 border-primary/50"
          >
            КРАСНОЕ
          </Button>
          <Button
            onClick={() => onPlaceBet('number', 0)}
            disabled={disabled}
            className="bg-accent hover:bg-green-700 text-white font-bold h-14 border-2 border-primary/50"
          >
            0
          </Button>
          <Button
            onClick={() => onPlaceBet('color', 'black')}
            disabled={disabled}
            className="bg-[#1a1a1a] hover:bg-gray-900 text-white font-bold h-14 border-2 border-primary/50"
          >
            ЧЁРНОЕ
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-2">
          <Button
            onClick={() => onPlaceBet('range', '1-18')}
            disabled={disabled}
            className="bg-muted hover:bg-muted/80 text-primary font-bold h-12 border-2 border-primary/50"
          >
            1-18
          </Button>
          <Button
            onClick={() => onPlaceBet('range', '19-36')}
            disabled={disabled}
            className="bg-muted hover:bg-muted/80 text-primary font-bold h-12 border-2 border-primary/50"
          >
            19-36
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-lg p-4">
        <div className="flex gap-2">
          {chipValues.map((value) => (
            <div
              key={value}
              className="w-12 h-12 rounded-full gold-gradient border-2 border-white flex items-center justify-center font-bold text-black shadow-lg cursor-pointer hover:scale-110 transition-transform"
            >
              {value}
            </div>
          ))}
        </div>
        
        <Button
          onClick={onClearBets}
          disabled={disabled || selectedBets.length === 0}
          variant="destructive"
          className="font-bold"
        >
          ОЧИСТИТЬ СТАВКИ
        </Button>
      </div>
    </div>
  );
}
