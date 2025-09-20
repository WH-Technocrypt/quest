import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Camera, 
  Save, 
  Wallet,
  Trophy,
  Target,
  Zap
} from 'lucide-react';
import { mockUser } from '@/data/mockData';

import { useAccount, useConnect, useConfig, useReadContract } from 'wagmi';
import { writeContract } from 'wagmi/actions';
import { toast } from '@/components/ui/sonner';
import { CONTRACT_ADDRESS, CONTRACT_ABI, EXPLORER_URL } from '@/lib/blockchainConfig';

export const Profile = () => {
  const config = useConfig();
  const { connect, connectors, isPending } = useConnect();
  const { address, isConnected } = useAccount();

  const [username, setUsername] = useState(mockUser.username);
  const [displayName, setDisplayName] = useState(mockUser.name);
  const [profileImage, setProfileImage] = useState(mockUser.avatar);
  // Tambahan untuk bind address dan CEX ID
  const [bindAddress, setBindAddress] = useState("");
  const [okxId, setOkxId] = useState("");
  const [bitgetId, setBitgetId] = useState("");
  const [bybitId, setBybitId] = useState("");
  
  const { data: profile } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getProfile',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const handleSave = async () => {
    if (!address) {
      toast.error('Wallet not connected');
      return;
    }
    try {
      const isRegistered = profile && (profile as any).exists;
      const fn = isRegistered ? 'updateProfile' : 'register';
      const txHash = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: fn,
        args: [username, displayName],
        account: address,
        chain: config.chains[0],
      });
      if (txHash) {
        toast(
          <span>
            Profile updated!{' '}
            <a
              href={`${EXPLORER_URL}/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              View on Explorer
            </a>
          </span>
        );
      }
    } catch (e) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture & Stats */}
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 border-4 border-primary/20">
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              </Avatar>
              <label className="absolute bottom-0 right-0 p-1 bg-primary rounded-full cursor-pointer hover:bg-primary/80 transition-colors">
                <Camera className="w-4 h-4 text-primary-foreground" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">{displayName}</h3>
              <p className="text-muted-foreground">@{username}</p>
              <Badge variant="secondary" className="mt-2">
                Level {mockUser.level}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-success">{mockUser.xp.toLocaleString()}</div>
                <div className="text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-warning">#1,337</div>
                <div className="text-muted-foreground">Rank</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile Information
          </h3>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Connected Wallet</Label>
              <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-mono">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not Connected'}
                </span>
                <Badge variant={address ? 'outline' : 'destructive'} className="ml-auto">
                  {address ? 'Connected' : 'Not Connected'}
                </Badge>
              </div>
            </div>
            
            {!address ? (
              <Button
                onClick={() => connect({ connector: connectors[0] })}
                className="w-full gap-2"
                disabled={isPending}
              >
                <Wallet className="w-4 h-4" />
                {isPending ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            ) : (
              <Button onClick={handleSave} className="w-full gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Achievement Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Your Achievements
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Target className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="font-bold text-2xl">42</div>
            <div className="text-sm text-muted-foreground">Quests Completed</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Zap className="w-8 h-8 mx-auto mb-2 text-warning" />
            <div className="font-bold text-2xl">7</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-success" />
            <div className="font-bold text-2xl">15</div>
            <div className="text-sm text-muted-foreground">Achievements</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
