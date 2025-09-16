import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Compass, 
  Trophy, 
  User, 
  Settings, 
  Zap,
  Target,
  Users,
  TrendingUp 
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const quickStats = [
    { label: 'Daily Streak', value: '7 days', icon: Zap, color: 'text-success' },
    { label: 'Rank', value: '#1,337', icon: TrendingUp, color: 'text-warning' },
    { label: 'Quests Done', value: '42', icon: Target, color: 'text-secondary' },
  ];

  return (
    <aside className="w-64 border-r border-border bg-background/50 backdrop-blur">
      <div className="sticky top-20 p-4 space-y-6">
        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "gaming" : "ghost"}
                className={`w-full justify-start gap-3 ${
                  isActive ? '' : 'hover:bg-accent/50'
                }`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.id === 'quests' && (
                  <Badge variant="secondary" className="ml-auto">
                    3
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <Card className="p-4 space-y-3">
          <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                </div>
                <span className="text-sm font-medium">{stat.value}</span>
              </div>
            );
          })}
        </Card>

        {/* Settings */}
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
          onClick={() => onTabChange('bind')}
        >
          <Settings className="w-5 h-5" />
          Bind
        </Button>
      </div>
    </aside>
  );
};