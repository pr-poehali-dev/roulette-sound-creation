import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import ParticipantWheel from '@/components/ParticipantWheel';
import ParticipantForm from '@/components/ParticipantForm';
import Icon from '@/components/ui/icon';

interface Participant {
  id: string;
  nickname: string;
  bet: number;
}

interface GameResult {
  id: number;
  winner: Participant;
  timestamp: Date;
  totalBank: number;
  participantsCount: number;
}

export default function Index() {
  const [currentSection, setCurrentSection] = useState('home');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [gameHistory, setGameHistory] = useState<GameResult[]>([]);
  const [leaderboard] = useState([
    { name: 'Александр К.', totalWins: 125000, gamesWon: 45 },
    { name: 'Мария С.', totalWins: 98500, gamesWon: 38 },
    { name: 'Дмитрий П.', totalWins: 87300, gamesWon: 32 },
    { name: 'Елена В.', totalWins: 76200, gamesWon: 29 },
    { name: 'Игорь Н.', totalWins: 65400, gamesWon: 25 }
  ]);
  const { toast } = useToast();

  const handleAddParticipant = (participant: Omit<Participant, 'id'>) => {
    const newParticipant: Participant = {
      ...participant,
      id: Date.now().toString()
    };
    setParticipants([...participants, newParticipant]);
    
    toast({
      title: 'Участник добавлен',
      description: `${participant.nickname} со ставкой ${participant.bet} ₽`,
    });
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleClearAll = () => {
    setParticipants([]);
    toast({
      title: 'Список очищен',
      description: 'Все участники удалены',
    });
  };

  const handleSpinComplete = (winner: Participant) => {
    const totalBank = participants.reduce((sum, p) => sum + p.bet, 0);
    
    toast({
      title: '🎉 ПОБЕДИТЕЛЬ!',
      description: `${winner.nickname} выигрывает ${totalBank.toLocaleString()} ₽!`,
      className: 'bg-primary text-black font-bold text-lg',
      duration: 5000,
    });

    const result: GameResult = {
      id: Date.now(),
      winner,
      timestamp: new Date(),
      totalBank,
      participantsCount: participants.length
    };

    setGameHistory([result, ...gameHistory.slice(0, 19)]);
    setParticipants([]);
  };

  const renderHome = () => (
    <div className="grid lg:grid-cols-3 gap-8 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-2 border-primary/30">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-glow text-primary">
              🎰 Vegas Roulette 🎰
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ParticipantWheel 
              participants={participants}
              onSpinComplete={handleSpinComplete}
              disabled={participants.length < 2}
            />

            {participants.length < 2 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
                <p className="text-yellow-200 flex items-center justify-center gap-2">
                  <Icon name="AlertCircle" size={20} />
                  Добавьте минимум 2 участника для начала игры
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <ParticipantForm
          participants={participants}
          onAddParticipant={handleAddParticipant}
          onRemoveParticipant={handleRemoveParticipant}
          onClearAll={handleClearAll}
        />
      </div>
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
              <li>Каждый игрок вводит свой никнейм и размер ставки</li>
              <li>Минимум 2 участника для запуска розыгрыша</li>
              <li>Нажмите "КРУТИТЬ РУЛЕТКУ" для старта</li>
              <li>Победитель забирает весь банк!</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-primary mb-2">Правила розыгрыша</h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Все участники имеют равные шансы на победу</li>
              <li>Победитель определяется случайным образом</li>
              <li>Общий банк = сумма всех ставок участников</li>
              <li>Победитель получает весь банк целиком</li>
            </ul>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
            <p className="text-sm">
              <Icon name="Info" className="inline mr-2" size={16} />
              <strong>Важно:</strong> Рулетка использует честный алгоритм случайного выбора. Каждый участник имеет одинаковые шансы!
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
                    <p className="text-sm text-muted-foreground">{player.gamesWon} побед</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {player.totalWins.toLocaleString()} ₽
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
              История пуста. Сыграйте первую игру!
            </p>
          ) : (
            <div className="space-y-3">
              {gameHistory.map((game) => (
                <div
                  key={game.id}
                  className="p-4 bg-accent/20 border border-accent/50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon name="Trophy" className="text-primary" size={24} />
                      <div>
                        <p className="font-bold text-lg text-foreground">
                          🎉 {game.winner.nickname}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {game.timestamp.toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-primary text-black font-bold text-lg px-4 py-2">
                        {game.totalBank.toLocaleString()} ₽
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Участников: {game.participantsCount}</span>
                    <span>•</span>
                    <span>Ставка победителя: {game.winner.bet.toLocaleString()} ₽</span>
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
                <p>🎰 Онлайн рулетка работает 24/7</p>
                <p>📞 Поддержка: круглосуточно</p>
                <p>💬 Ответ в течение 5 минут</p>
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