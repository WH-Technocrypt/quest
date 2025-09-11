'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Twitter, 
  CheckCircle, 
  Clock, 
  Play, 
  ExternalLink, 
  Trophy,
  User,
  LogOut,
  Loader2
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  xId?: string;
  hasXLinked: boolean;
}

interface Quest {
  id: string;
  type: string;
  title: string;
  target_post_id?: string;
  target_user_id?: string;
  xp: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingQuest, setVerifyingQuest] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkExistingSession();
  }, []);

  // Check URL parameters for OAuth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const userId = urlParams.get('userId');
    const xLinked = urlParams.get('x_linked');
    const authError = urlParams.get('error');

    if (authError) {
      setError(`Authentication error: ${authError}`);
      setLoading(false);
      return;
    }

    if (token && userId) {
      // Store token and user info
      localStorage.setItem('quest_token', token);
      localStorage.setItem('quest_user_id', userId);
      setUser({ id: userId, name: '', email: '', xp: 0, hasXLinked: false });
      fetchUserData(userId);
    }

    if (xLinked) {
      // Refresh user data after X linking
      const storedUserId = localStorage.getItem('quest_user_id');
      if (storedUserId) {
        fetchUserData(storedUserId);
      }
    }
  }, []);

  const checkExistingSession = () => {
    const token = localStorage.getItem('quest_token');
    const userId = localStorage.getItem('quest_user_id');
    
    if (token && userId) {
      setUser({ id: userId, name: '', email: '', xp: 0, hasXLinked: false });
      fetchUserData(userId);
    } else {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/quests/user/${userId}`);
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setQuests(data.quests);
      } else {
        setError('Failed to fetch user data');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleXLink = () => {
    if (!user) return;
    window.location.href = `/api/auth/x?userId=${user.id}`;
  };

  const startQuest = async (questId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/quests/manage/${questId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        // Refresh quests data
        fetchUserData(user.id);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to start quest');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  const verifyQuest = async (questId: string) => {
    if (!user) return;

    try {
      setVerifyingQuest(questId);
      const response = await fetch(`/api/quests/manage/${questId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Refresh user data
          fetchUserData(user.id);
        } else {
          setError(result.message || 'Quest requirements not met');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to verify quest');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setVerifyingQuest(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('quest_token');
    localStorage.removeItem('quest_user_id');
    setUser(null);
    setQuests([]);
  };

  const getQuestActionUrl = (quest: Quest) => {
    switch (quest.type) {
      case 'like':
        return `https://twitter.com/status/${quest.target_post_id}`;
      case 'follow':
        return `https://twitter.com/${quest.target_user_id}`;
      case 'retweet':
        return `https://twitter.com/status/${quest.target_post_id}`;
      default:
        return '#';
    }
  };

  const getQuestActionText = (quest: Quest) => {
    switch (quest.type) {
      case 'like':
        return 'Like this post';
      case 'follow':
        return 'Follow this user';
      case 'retweet':
        return 'Retweet this post';
      default:
        return 'Complete action';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Quest Platform</CardTitle>
            <CardDescription>
              Complete social media quests and earn XP rewards
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full"
              size="lg"
            >
              <User className="mr-2 h-4 w-4" />
              Login with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const totalQuests = quests.length;
  const progressPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.name ? `https://ui-avatars.com/api/?name=${user.name}` : ''} />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user.name}!</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{user.xp} XP</span>
              </div>
              <p className="text-sm text-gray-600">
                {completedQuests}/{totalQuests} quests completed
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quest Completion</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* X Account Status */}
        {!user.hasXLinked && (
          <Alert>
            <Twitter className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Link your X (Twitter) account to start completing quests</span>
              <Button onClick={handleXLink} size="sm">
                <Twitter className="h-4 w-4 mr-2" />
                Link X Account
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quests */}
        <Card>
          <CardHeader>
            <CardTitle>Available Quests</CardTitle>
            <CardDescription>
              Complete quests to earn XP rewards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="not_started">Available</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {quests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    user={user}
                    onStart={startQuest}
                    onVerify={verifyQuest}
                    verifyingQuest={verifyingQuest}
                    getQuestActionUrl={getQuestActionUrl}
                    getQuestActionText={getQuestActionText}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="not_started" className="space-y-4">
                {quests.filter(q => q.status === 'not_started').map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    user={user}
                    onStart={startQuest}
                    onVerify={verifyQuest}
                    verifyingQuest={verifyingQuest}
                    getQuestActionUrl={getQuestActionUrl}
                    getQuestActionText={getQuestActionText}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="in_progress" className="space-y-4">
                {quests.filter(q => q.status === 'in_progress').map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    user={user}
                    onStart={startQuest}
                    onVerify={verifyQuest}
                    verifyingQuest={verifyingQuest}
                    getQuestActionUrl={getQuestActionUrl}
                    getQuestActionText={getQuestActionText}
                  />
                ))}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4">
                {quests.filter(q => q.status === 'completed').map((quest) => (
                  <QuestCard
                    key={quest.id}
                    quest={quest}
                    user={user}
                    onStart={startQuest}
                    onVerify={verifyQuest}
                    verifyingQuest={verifyingQuest}
                    getQuestActionUrl={getQuestActionUrl}
                    getQuestActionText={getQuestActionText}
                  />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
  user: User;
  onStart: (questId: string) => void;
  onVerify: (questId: string) => void;
  verifyingQuest: string | null;
  getQuestActionUrl: (quest: Quest) => string;
  getQuestActionText: (quest: Quest) => string;
}

function QuestCard({
  quest,
  user,
  onStart,
  onVerify,
  verifyingQuest,
  getQuestActionUrl,
  getQuestActionText
}: QuestCardProps) {
  const getStatusBadge = () => {
    switch (quest.status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Completed</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">In Progress</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const getStatusIcon = () => {
    switch (quest.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <Play className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <Card className={quest.status === 'completed' ? 'bg-green-50 border-green-200' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getStatusIcon()}
            <div>
              <h3 className="font-semibold">{quest.title}</h3>
              <p className="text-sm text-gray-600">
                {quest.type === 'like' && 'Like a specific post'}
                {quest.type === 'follow' && 'Follow a specific user'}
                {quest.type === 'retweet' && 'Retweet a specific post'}
              </p>
              <div className="flex items-center space-x-2 mt-2">
                <Trophy className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{quest.xp} XP</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {getStatusBadge()}
            
            <div className="flex items-center space-x-2">
              {quest.status === 'not_started' && (
                <>
                  <Button
                    onClick={() => onStart(quest.id)}
                    disabled={!user.hasXLinked}
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </>
              )}
              
              {quest.status === 'in_progress' && (
                <>
                  <Button
                    onClick={() => window.open(getQuestActionUrl(quest), '_blank')}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {getQuestActionText(quest)}
                  </Button>
                  <Button
                    onClick={() => onVerify(quest.id)}
                    disabled={verifyingQuest === quest.id}
                    size="sm"
                  >
                    {verifyingQuest === quest.id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Verify
                  </Button>
                </>
              )}
              
              {quest.status === 'completed' && (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Completed
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}