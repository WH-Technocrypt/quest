import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SocialPost } from '@/components/SocialPost';
import { QuestCard } from '@/components/QuestCard';
import { CreatePost } from '@/components/CreatePost';
import { Profile } from '@/components/Profile';
import { Leaderboard } from '@/components/Leaderboard';
import { mockPosts, mockQuests, mockUser } from '@/data/mockData';
import { Settings } from './Settings';
import { Button } from '@/components/ui/button';
import { useAccount, useConfig } from 'wagmi';
import { writeContract } from 'wagmi/actions';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/blockchainConfig';
import { toast } from '@/components/ui/sonner';


const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [posts, setPosts] = useState(mockPosts);

  // HOOKS DI LEVEL ATAS
  const { address } = useAccount();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<number | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  const handleCreatePost = (content: string) => {
    const newPost = {
      id: Date.now().toString(),
      author: {
        name: mockUser.name,
        username: mockUser.username,
        avatar: mockUser.avatar,
        level: mockUser.level,
      },
      content,
      timestamp: 'now',
      likes: 0,
      comments: 0,
      retweets: 0,
      xpReward: 25,
      isLiked: false,
      isRetweeted: false,
    };
    setPosts([newPost, ...posts]);
  };

  // Daily Check-in handler
  const handleCheckin = async () => {
    setIsLoading(true);
    try {
      await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'dailyCheckin',
        account: address,
        chain: config.chains[0],
      });
      setCheckedIn(true);
      setLastCheckin(Date.now());
      toast.success('Check-in berhasil! +50 XP');
    } catch (e) {
      toast.error('Check-in gagal atau sudah dilakukan hari ini');
    }
    setIsLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <CreatePost
              userAvatar={mockUser.avatar}
              userName={mockUser.name}
              onPost={handleCreatePost}
            />
            <div className="space-y-4">
              {posts.map((post) => (
                <SocialPost key={post.id} {...post} />
              ))}
            </div>
          </div>
        );
      case 'quests':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Available Quests</h2>
              <p className="text-muted-foreground">Complete quests to earn XP and level up your profile!</p>
            </div>
            {/* Daily Check-in */}
            <div className="mb-4">
              <Button onClick={handleCheckin} disabled={isLoading || checkedIn} className="w-full">
                {isLoading ? 'Checking in...' : checkedIn ? 'Checked in today!' : 'Daily Check-in (+50 XP)'}
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {mockQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  {...quest}
                  onClaim={async () => {
                    try {
                      await writeContract(config, {
                        address: CONTRACT_ADDRESS,
                        abi: CONTRACT_ABI,
                        functionName: 'claimQuestReward',
                        args: [Number(quest.id)],
                        account: address,
                        chain: config.chains[0],
                      });
                      toast.success('Reward claimed!');
                    } catch (e) {
                      toast.error('Failed to claim reward.');
                    }
                  }}
                />
              ))}
            </div>
          </div>
        );
      case 'leaderboard':
        return <Leaderboard />;
      case 'profile':
        return <Profile />;
      case 'bind':
        return <Settings />;
      default:
        return (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
              <p className="text-muted-foreground">This section is under development!</p>
            </div>
          </div>
        );
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header
        userXP={mockUser.xp}
        userLevel={mockUser.level}
        maxXP={mockUser.maxXP}
      />
      <div className="flex">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main className="flex-1 p-6">
          <div className="max-w-2xl mx-auto">
            {renderContent()}
          </div>
        </main>
        {/* Right Sidebar - Future: Trending, Suggestions, etc. */}
        <aside className="w-80 p-6 border-l border-border">
          <div className="space-y-6">
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3">🔥 Trending Quests</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DeFi Master</span>
                  <span className="text-success">+500 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">NFT Collector</span>
                  <span className="text-success">+300 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DAO Voter</span>
                  <span className="text-success">+200 XP</span>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-lg p-4 border border-border">
              <h3 className="font-semibold mb-3">⚡ Top Players</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center text-xs font-bold">1</div>
                  <span className="flex-1">CryptoNinja</span>
                  <span className="text-success">25,430 XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">2</div>
                  <span className="flex-1">BlockMaster</span>
                  <span className="text-success">23,120 XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold">3</div>
                  <span className="flex-1">DeFiQueen</span>
                  <span className="text-success">21,890 XP</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;