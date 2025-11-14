import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import RouletteWheel from '@/components/RouletteWheel';
import BettingTable from '@/components/BettingTable';
import Icon from '@/components/ui/icon';

interface GameHistory {
  id: number;
  number: number;
  color: string;
  timestamp: Date;
  win: boolean;
  amount: number;
}

export default function Index() {
  const [currentSection, setCurrentSection] = useState('home');
  const [balance, setBalance] = useState(10000);
  const [selectedBets, setSelectedBets] = useState<Array<{ type: string; value: number | string; amount: number }>>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([]);
  const [leaderboard] = useState([
    { name: 'Александр К.', score: 125000, wins: 45 },
    { name: 'Мария С.', score: 98500, wins: 38 },
    { name: 'Дмитрий П.', score: 87300, wins: 32 },
    { name: 'Елена В.', score: 76200, wins: 29 },
    { name: 'Игорь Н.', score: 65400, wins: 25 }
  ]);
  const { toast } = useToast();

  const handlePlaceBet = (type: string, value: number | string) => {
    if (balance < 100) {
      toast({ title: 'Недостаточно средств', description: 'Пополните баланс', variant: 'destructive' });
      return;
    }

    const existingBetIndex = selectedBets.findIndex(b => b.type === type && b.value === value);
    
    if (existingBetIndex >= 0) {
      const newBets = [...selectedBets];
      newBets[existingBetIndex].amount += 100;
      setSelectedBets(newBets);
    } else {
      setSelectedBets([...selectedBets, { type, value, amount: 100 }]);
    }
    
    setBalance(balance - 100);
  };

  const handleClearBets = () => {
    const totalBets = selectedBets.reduce((sum, bet) => sum + bet.amount, 0);
    setBalance(balance + totalBets);
    setSelectedBets([]);
  };

  const handleSpin = (result: number, color: string) => {
    setIsSpinning(true);
    
    setTimeout(() => {
      let totalWin = 0;
      let hasWin = false;

      selectedBets.forEach(bet => {
        if (bet.type === 'number' && bet.value === result) {
          totalWin += bet.amount * 35;
          hasWin = true;
        } else if (bet.type === 'color' && bet.value === color) {
          totalWin += bet.amount * 2;
          hasWin = true;
        } else if (bet.type === 'range') {
          const [min, max] = (bet.value as string).split('-').map(Number);
          if (result >= min && result <= max) {
            totalWin += bet.amount * 2;
            hasWin = true;
          }
        }
      });

      if (totalWin > 0) {
        setBalance(balance + totalWin);
        toast({
          title: '🎉 ВЫИГРЫШ!',
          description: `Вы выиграли ${totalWin} ₽!`,
          className: 'bg-primary text-black font-bold'
        });
      } else {
        toast({
          title: 'Не повезло',
          description: `Выпало: ${result} (${color === 'red' ? 'красное' : color === 'black' ? 'чёрное' : 'зелёное'})`,
          variant: 'destructive'
        });
      }

      setGameHistory([
        { id: Date.now(), number: result, color, timestamp: new Date(), win: hasWin, amount: totalWin },
        ...gameHistory.slice(0, 9)
      ]);

      setSelectedBets([]);
      setIsSpinning(false);
    }, 4000);
  };

  const renderHome = () => (
    <div className="space-y-8 animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-glow text-primary">
            🎰 Vegas Roulette 🎰
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Ваш баланс</p>
              <p className="text-3xl font-bold text-primary">{balance.toLocaleString()} ₽</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Сумма ставок</p>
              <p className="text-2xl font-bold text-secondary">
                {selectedBets.reduce((sum, bet) => sum + bet.amount, 0).toLocaleString()} ₽
              </p>
            </div>
          </div>

          <RouletteWheel 
            onSpin={handleSpin} 
            disabled={isSpinning || selectedBets.length === 0}
          />

          <BettingTable
            selectedBets={selectedBets}
            onPlaceBet={handlePlaceBet}
            onClearBets={handleClearBets}
            disabled={isSpinning}
          />
        </CardContent>
      </Card>
    </div>
  );

  const renderRules = () => (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-primary">📖 Правила игры</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-foreground">
          <div>
            <h3 className="text-xl font-bold text-primary mb-2">Как играть</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Выберите числа, цвета или диапазоны для ставки</li>
              <li>Каждая ставка составляет 100 ₽</li>
              <li>Нажмите кнопку "КРУТИТЬ" для запуска рулетки</li>
              <li>Если выпадет ваше число/цвет - вы выигрываете!</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-2">Выплаты</h3>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Конкретное число:</strong> ставка × 35</li>
              <li><strong>Красное/Чёрное:</strong> ставка × 2</li>
              <li><strong>1-18 / 19-36:</strong> ставка × 2</li>
              <li><strong>Зелёный 0:</strong> ставка × 35</li>
            </ul>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm">
              <Icon name="Info" className="inline mr-2" size={16} />
              <strong>Совет:</strong> Начинайте с простых ставок на цвет, изучайте закономерности!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderLeaderboard = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-primary flex items-center gap-2">
            <Icon name="Trophy" size={28} />
            Таблица лидеров
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Badge className={`w-10 h-10 flex items-center justify-center text-lg font-bold ${
                    index === 0 ? 'gold-gradient text-black' : 
                    index === 1 ? 'bg-gray-400 text-black' :
                    index === 2 ? 'bg-orange-600' : 'bg-muted'
                  }`}>
                    {index + 1}
                  </Badge>
                  <div>
                    <p className="font-bold text-lg text-foreground">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.wins} побед</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {player.score.toLocaleString()} ₽
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHistory = () => (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-primary flex items-center gap-2">
            <Icon name="Clock" size={28} />
            История игр
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gameHistory.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              История пуста. Сделайте первую ставку!
            </p>
          ) : (
            <div className="space-y-2">
              {gameHistory.map((game) => (
                <div
                  key={game.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    game.win ? 'bg-accent/20 border border-accent/50' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white border-2 border-primary/50"
                      style={{
                        backgroundColor: 
                          game.color === 'red' ? '#DC143C' : 
                          game.color === 'black' ? '#1a1a1a' : '#047857'
                      }}
                    >
                      {game.number}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">
                        {game.color === 'red' ? '🔴 Красное' : game.color === 'black' ? '⚫ Чёрное' : '🟢 Зелёное'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {game.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {game.win ? (
                      <Badge className="bg-accent text-white font-bold">
                        +{game.amount} ₽
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Проигрыш</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderContacts = () => (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-2xl text-glow text-primary flex items-center gap-2">
            <Icon name="Mail" size={28} />
            Контакты
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary">Свяжитесь с нами</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="Phone" className="text-primary" size={20} />
                  <span className="text-foreground">+7 (495) 123-45-67</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="Mail" className="text-primary" size={20} />
                  <span className="text-foreground">support@vegasroulette.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="MapPin" className="text-primary" size={20} />
                  <span className="text-foreground">Москва, ул. Азартная, 777</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-primary">Режим работы</h3>
              <div className="space-y-2 text-foreground">
                <p>🎰 Онлайн казино работает 24/7</p>
                <p>📞 Поддержка: круглосуточно</p>
                <p>💳 Вывод средств: 10:00 - 22:00</p>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-primary mb-2">Играйте ответственно! 🎲</p>
            <p className="text-sm text-muted-foreground">
              Азартные игры могут вызывать зависимость. Играйте в меру своих возможностей.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      <main className="container mx-auto px-4 py-8">
        {currentSection === 'home' && renderHome()}
        {currentSection === 'rules' && renderRules()}
        {currentSection === 'leaderboard' && renderLeaderboard()}
        {currentSection === 'history' && renderHistory()}
        {currentSection === 'contacts' && renderContacts()}
      </main>

      <footer className="bg-card/50 backdrop-blur-sm border-t-2 border-primary/30 mt-12 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Vegas Roulette. Все права защищены. 🎰
          </p>
        </div>
      </footer>
    </div>
  );
}
