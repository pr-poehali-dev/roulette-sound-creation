import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface NavigationProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Navigation({ currentSection, onSectionChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: 'home', label: 'Главная', icon: 'Home' },
    { id: 'rules', label: 'Правила', icon: 'BookOpen' },
    { id: 'leaderboard', label: 'Лидеры', icon: 'Trophy' },
    { id: 'history', label: 'История', icon: 'Clock' },
    { id: 'contacts', label: 'Контакты', icon: 'Mail' }
  ];

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b-2 border-primary/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🎰</div>
            <h1 className="text-2xl font-bold text-glow text-primary">Vegas Roulette</h1>
          </div>

          <div className="hidden md:flex gap-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                variant={currentSection === section.id ? 'default' : 'ghost'}
                className={`gap-2 ${
                  currentSection === section.id 
                    ? 'gold-gradient text-black font-bold' 
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                <Icon name={section.icon} size={18} />
                {section.label}
              </Button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-primary"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {sections.map((section) => (
              <Button
                key={section.id}
                onClick={() => {
                  onSectionChange(section.id);
                  setIsMobileMenuOpen(false);
                }}
                variant={currentSection === section.id ? 'default' : 'ghost'}
                className={`w-full justify-start gap-2 ${
                  currentSection === section.id 
                    ? 'gold-gradient text-black font-bold' 
                    : 'text-primary hover:text-primary/80'
                }`}
              >
                <Icon name={section.icon} size={18} />
                {section.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
