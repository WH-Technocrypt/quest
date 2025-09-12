import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Target, Clock, CheckCircle2 } from 'lucide-react';

interface QuestCardProps {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  maxProgress: number;
  timeRemaining?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'weekly' | 'special';
  completed?: boolean;
  onStart?: () => void;
  onClaim?: () => void;
}

export const QuestCard = ({
  id,
  title,
  description,
  xpReward,
  progress,
  maxProgress,
  timeRemaining,
  difficulty,
  type,
  completed = false,
  onStart,
  onClaim,
}: QuestCardProps) => {
  const progressPercentage = (progress / maxProgress) * 100;
  
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeVariant = () => {
    switch (type) {
      case 'daily': return 'secondary';
      case 'weekly': return 'default';
      case 'special': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <Card className={`p-4 transition-all duration-200 hover:shadow-lg ${
      completed 
        ? 'border-success bg-success/5 hover:bg-success/10' 
        : 'border-border hover:border-primary/50 hover:bg-card-hover'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${completed ? 'text-success' : 'text-primary'}`} />
          <Badge variant={getTypeVariant()} className="text-xs">
            {type.toUpperCase()}
          </Badge>
          <Badge variant="outline" className={`text-xs ${getDifficultyColor()}`}>
            {difficulty.toUpperCase()}
          </Badge>
        </div>
        
        {timeRemaining && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {timeRemaining}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          {title}
          {completed && <CheckCircle2 className="w-4 h-4 text-success" />}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Progress: {progress}/{maxProgress}
            </span>
            <div className="flex items-center gap-1 text-success font-medium">
              <Zap className="w-3 h-3" />
              +{xpReward} XP
            </div>
          </div>
          <Progress 
            value={progressPercentage} 
            className={`h-2 ${completed ? 'bg-success/20' : ''}`}
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        {completed ? (
          <Button 
            variant="xp" 
            size="sm" 
            onClick={onClaim}
            className="level-up"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            Claim Reward
          </Button>
        ) : progress > 0 ? (
          <Button variant="quest" size="sm" disabled>
            In Progress...
          </Button>
        ) : (
          <Button 
            variant="gaming" 
            size="sm" 
            onClick={onStart}
          >
            Start Quest
          </Button>
        )}
      </div>
    </Card>
  );
};