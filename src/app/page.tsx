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

export default function Pages() {
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingQuest, setVerifyingQuest] = useState<string | null>(null);

  // Only run client-side effects
  useEffect(() => {
    const storedToken = localStorage.getItem('quest_token');
    const storedUserId = localStorage.getItem('quest_user_id');

    if (storedToken && storedUserId) {
      setUser({ id: storedUserId, name: '', email: '', xp: 0, hasXLinked: false });
      fetchUserData(storedUserId);
    } else {
      setLoading(false);
    }

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const xLinked = params.get('x_linked');
    const authError = params.get('error');

    if (authError) {
      setError(`Authentication error: ${authError}`);
      setLoading(false);
      return;
    }

    if (token && userId) {
      localStorage.setItem('quest_token', token);
      localStorage.setItem('quest_user_id', userId);
      setUser({ id: userId, name: '', email: '', xp: 0, hasXLinked: false });
      fetchUserData(userId);
    }

    if (xLinked && storedUserId) {
      fetchUserData(storedUserId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/quests/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setQuests(data.quests);
      } else {
        setError('Failed to fetch user data');
      }
    } catch {
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
      const res = await fetch(`/api/quests/manage/${questId}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) fetchUserData(user.id);
      else {
        const data = await res.json();
        setError(data.error || 'Failed to start quest');
      }
    } catch {
      setError('Network error');
    }
  };

  const verifyQuest = async (questId: string) => {
    if (!user) return;
    try {
      setVerifyingQuest(questId);
      const res = await fetch(`/api/quests/manage/${questId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) fetchUserData(user.id);
        else setError(data.message || 'Quest requirements not met');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to verify quest');
      }
    } catch {
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
      case 'like': return `https://twitter.com/status/${quest.target_post_id}`;
      case 'follow': return `https://twitter.com/${quest.target_user_id}`;
      case 'retweet': return `https://twitter.com/status/${quest.target_post_id}`;
      default: return '#';
    }
  };

  const getQuestActionText = (quest: Quest) => {
    switch (quest.type) {
      case 'like': return 'Like this post';
      case 'follow': return 'Follow this user';
      case 'retweet': return 'Retweet this post';
      default: return 'Complete action';
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Quest Platform</CardTitle>
          <CardDescription>Complete social media quests and earn XP rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <Button onClick={handleGoogleLogin} className="w-full" size="lg">
            <User className="mr-2 h-4 w-4" /> Login with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const completedQuests = quests.filter(q => q.status === 'completed').length;
  const totalQuests = quests.length;
  const progressPercentage = totalQuests > 0 ? (completedQuests / totalQuests) * 100 : 0;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.name ? `https://ui-avatars.com/api/?name=${user.name}` : ''} suppressHydrationWarning />
              <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{`Welcome, ${user.name || 'User'}!`}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="font-semibold">{user.xp} XP</span>
              </div>
              <p className="text-sm text-gray-600">{completedQuests}/{totalQuests} quests completed</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        {/* Progress */}
        <Card>
          <CardHeader><CardTitle>Your Progress</CardTitle></CardHeader>
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
                <Twitter className="h-4 w-4 mr-2" /> Link X Account
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

        {/* Quests */}
        <Card>
          <CardHeader>
            <CardTitle>Available Quests</CardTitle>
            <CardDescription>Complete quests to earn XP rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="not_started">Available</TabsTrigger>
                <TabsTrigger value="in_progress">In Progress</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {['all','not_started','in_progress','completed'].map(tab => (
                <TabsContent key={tab} value={tab} className="space-y-4">
                  {quests
                    .filter(q => tab==='all' ? true : q.status===tab)
                    .map(quest => (
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
                    ))
                  }
                </TabsContent>
              ))}
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

function QuestCard({ quest, user, onStart, onVerify, verifyingQuest, getQuestActionUrl, getQuestActionText }: QuestCardProps) {
  const getStatusBadge = () => {
    switch (quest.status) {
      case 'completed': return <Badge variant="default">Completed</Badge>;
      case 'in_progress': return <Badge variant="secondary">In Progress</Badge>;
      case 'not_started': return <Badge variant="destructive">Not Started</Badge>;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{quest.title}</h3>
          <p className="text-sm text-gray-500">{quest.xp} XP</p>
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          {quest.status==='not_started' && (
            <Button size="sm" onClick={()=>onStart(quest.id)}>
              <Play className="h-3 w-3 mr-1" /> Start
            </Button>
          )}
          {quest.status==='in_progress' && (
            <Button
              size="sm"
              onClick={()=>onVerify(quest.id)}
              disabled={verifyingQuest===quest.id}
            >
              {verifyingQuest===quest.id ? <Loader2 className="h-3 w-3 animate-spin mr-1"/> : <CheckCircle className="h-3 w-3 mr-1"/>}
              Verify
            </Button>
          )}
          {quest.status==='completed' && (
            <Button size="sm" asChild>
              <a href={getQuestActionUrl(quest)} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" /> View
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
