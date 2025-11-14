import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Participant {
  id: string;
  nickname: string;
  bet: number;
}

interface ParticipantFormProps {
  participants: Participant[];
  onAddParticipant: (participant: Omit<Participant, 'id'>) => void;
  onRemoveParticipant: (id: string) => void;
  onClearAll: () => void;
}

export default function ParticipantForm({ 
  participants, 
  onAddParticipant, 
  onRemoveParticipant,
  onClearAll 
}: ParticipantFormProps) {
  const [nickname, setNickname] = useState('');
  const [bet, setBet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nickname.trim() || !bet) return;

    const betAmount = parseFloat(bet);
    if (isNaN(betAmount) || betAmount <= 0) return;

    onAddParticipant({ nickname: nickname.trim(), bet: betAmount });
    setNickname('');
    setBet('');
  };

  const totalBets = participants.reduce((sum, p) => sum + p.bet, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center gap-2">
            <Icon name="UserPlus" size={24} />
            Добавить участника
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nickname" className="text-foreground">Никнейм</Label>
              <Input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Введите никнейм"
                className="mt-1"
                maxLength={20}
              />
            </div>

            <div>
              <Label htmlFor="bet" className="text-foreground">Ставка (₽)</Label>
              <Input
                id="bet"
                type="number"
                value={bet}
                onChange={(e) => setBet(e.target.value)}
                placeholder="Введите сумму"
                className="mt-1"
                min="1"
                step="1"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full gold-gradient text-black font-bold"
              disabled={!nickname.trim() || !bet}
            >
              <Icon name="Plus" size={18} className="mr-2" />
              Добавить
            </Button>
          </form>
        </CardContent>
      </Card>

      {participants.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-primary">
              Участники ({participants.length})
            </CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={onClearAll}
            >
              Очистить всех
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-bold text-foreground">{participant.nickname}</p>
                    <p className="text-sm text-primary">{participant.bet.toLocaleString()} ₽</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveParticipant(participant.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Icon name="Trash2" size={18} />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Общий банк:</span>
                <span className="text-2xl font-bold text-primary">
                  {totalBets.toLocaleString()} ₽
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
