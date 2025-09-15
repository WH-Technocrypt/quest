import { Button } from '@/components/ui/button';
import { Zap, Trophy, Star } from 'lucide-react';

interface HeaderProps {
  userXP: number;
  userLevel: number;
  maxXP: number;
}

export const Header = ({ userXP = 1250, userLevel = 5, maxXP = 2000 }: HeaderProps) => {
  const xpPercentage = (userXP / maxXP) * 100;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-primary to-primary-glow">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Web Quest
              </h1>
              <p className="text-xs text-muted-foreground">Social Gaming Platform</p>
            </div>
          </div>

          {/* XP Bar & Level */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-card rounded-lg px-4 py-2 border border-border">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-warning" />
                <span className="text-sm font-semibold">Level {userLevel}</span>
              </div>
              
              <div className="w-32 h-2 bg-xp-bg rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-success to-success/80 transition-all duration-500 glow-success"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="w-3 h-3" />
                <span>{userXP}/{maxXP} XP</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};