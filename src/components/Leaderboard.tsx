import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Crown } from 'lucide-react';

// Mock leaderboard data - in real app, this would come from smart contract
const leaderboardData = [
  {
    rank: 1,
    address: '0x1234...5678',
    username: 'CryptoNinja',
    displayName: 'Crypto Ninja',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    totalXP: 25430,
    level: 25,
    questsCompleted: 127,
  },
  {
    rank: 2,
    address: '0x2345...6789',
    username: 'BlockMaster',
    displayName: 'Block Master',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    totalXP: 23120,
    level: 23,
    questsCompleted: 98,
  },
  {
    rank: 3,
    address: '0x3456...7890',
    username: 'DeFiQueen',
    displayName: 'DeFi Queen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    totalXP: 21890,
    level: 21,
    questsCompleted: 89,
  },
  {
    rank: 4,
    address: '0x4567...8901',
    username: 'Web3Warrior',
    displayName: 'Web3 Warrior',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
    totalXP: 19450,
    level: 19,
    questsCompleted: 76,
  },
  {
    rank: 5,
    address: '0x5678...9012',
    username: 'SmartContractSage',
    displayName: 'Smart Contract Sage',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
    totalXP: 18320,
    level: 18,
    questsCompleted: 71,
  },
  {
    rank: 6,
    address: '0x6789...0123',
    username: 'TokenTrader',
    displayName: 'Token Trader',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
    totalXP: 16890,
    level: 16,
    questsCompleted: 65,
  },
  {
    rank: 7,
    address: '0x7890...1234',
    username: 'DAODelegate',
    displayName: 'DAO Delegate',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7',
    totalXP: 15670,
    level: 15,
    questsCompleted: 58,
  },
  {
    rank: 8,
    address: '0x8901...2345',
    username: 'NFTCollector',
    displayName: 'NFT Collector',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8',
    totalXP: 14520,
    level: 14,
    questsCompleted: 52,
  },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-600" />;
    default:
      return <Trophy className="w-5 h-5 text-muted-foreground" />;
  }
};

const getRankBadgeVariant = (rank: number): "default" | "secondary" | "destructive" | "outline" => {
  if (rank === 1) return "default";
  if (rank <= 3) return "secondary";
  return "outline";
};

export const Leaderboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Leaderboard</h2>
        <p className="text-muted-foreground">Top players ranked by total XP earned from quest completions</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid gap-4 md:grid-cols-3">
        {leaderboardData.slice(0, 3).map((player) => (
          <Card key={player.rank} className="p-6 text-center">
            <div className="relative mb-4">
              <Avatar className="w-16 h-16 mx-auto border-4 border-primary/20">
                <img src={player.avatar} alt={player.displayName} />
              </Avatar>
              <div className="absolute -top-2 -right-2">
                {getRankIcon(player.rank)}
              </div>
            </div>
            
            <h3 className="font-bold text-lg mb-1">{player.displayName}</h3>
            <p className="text-sm text-muted-foreground mb-2">@{player.username}</p>
            
            <Badge variant={getRankBadgeVariant(player.rank)} className="mb-3">
              #{player.rank}
            </Badge>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-bold text-success">{player.totalXP.toLocaleString()}</span>
                <span className="text-muted-foreground"> XP</span>
              </div>
              <div>
                <span className="font-bold">Level {player.level}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{player.questsCompleted} Quests</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Full Leaderboard */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">All Rankings</h3>
        
        <div className="space-y-3">
          {leaderboardData.map((player) => (
            <div
              key={player.address}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8">
                <Badge variant={getRankBadgeVariant(player.rank)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs">
                  {player.rank}
                </Badge>
              </div>
              
              <Avatar className="w-10 h-10 border-2 border-muted">
                <img src={player.avatar} alt={player.displayName} />
              </Avatar>
              
              <div className="flex-1">
                <div className="font-semibold">{player.displayName}</div>
                <div className="text-sm text-muted-foreground">@{player.username}</div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-success">{player.totalXP.toLocaleString()} XP</div>
                <div className="text-sm text-muted-foreground">Level {player.level}</div>
              </div>
              
              <div className="text-right text-sm text-muted-foreground">
                {player.questsCompleted} quests
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};