import React, { useState } from 'react';
import { useAccount, useReadContract, useConfig } from 'wagmi';
import { writeContract } from 'wagmi/actions';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/lib/blockchainConfig';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Heart,
  MessageCircle,
  Repeat2,
  Share,
  MoreHorizontal,
  Zap,
} from 'lucide-react';

interface SocialPostProps {
  id: string;
  author: {
    name: string;
    username: string;
    avatar: string;
    level: number;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  retweets: number;
  xpReward: number;
  isLiked?: boolean;
  isRetweeted?: boolean;
  onLike?: () => void;
  onComment?: () => void;
  onRetweet?: () => void;
}

export const SocialPost: React.FC<SocialPostProps> = ({
  id,
  author,
  content,
  timestamp,
  likes,
  comments,
  retweets,
  xpReward,
  isLiked = false,
  isRetweeted = false,
  onLike,
  onComment,
  onRetweet,
}) => {
  const [liked, setLiked] = useState(isLiked);
  const [retweeted, setRetweeted] = useState(isRetweeted);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);

  const { address } = useAccount();
  const config = useConfig();
  const { data: userData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'users',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const isRegistered =
    userData &&
    typeof userData === 'object' &&
    'isActive' in userData &&
    (userData as any).isActive;

  // Handler for Like
  const handleLike = async () => {
    if (!address) {
      toast.error('Please connect your wallet first.');
      return;
    }
    if (!isRegistered) {
      toast.error('You must register your profile before liking. Go to Profile > Save Changes.');
      return;
    }
    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'likePost',
        args: [Number(id)],
        account: address,
        chain: config.chains[0],
      });
      if (tx) {
        toast(
          <span>
            Like sent!{' '}
            <a
              href={`https://explorer.uomi.ai/tx/${tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              View on Explorer
            </a>
          </span>
        );
      }
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      onLike?.();
    } catch (e) {}
  };

  // Handler for Retweet
  const handleRetweet = async () => {
    if (!address) {
      toast.error('Please connect your wallet first.');
      return;
    }
    if (!isRegistered) {
      toast.error('You must register your profile before retweeting. Go to Profile > Save Changes.');
      return;
    }
    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'retweetPost',
        args: [Number(id)],
        account: address,
        chain: config.chains[0],
      });
      if (tx) {
        toast(
          <span>
            Retweet sent!{' '}
            <a
              href={`https://explorer.uomi.ai/tx/${tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              View on Explorer
            </a>
          </span>
        );
      }
      setRetweeted(!retweeted);
      setRetweetCount(retweeted ? retweetCount - 1 : retweetCount + 1);
      onRetweet?.();
    } catch (e) {}
  };

  // Handler for Comment
  const handleComment = async () => {
    if (!address) {
      toast.error('Please connect your wallet first.');
      return;
    }
    if (!isRegistered) {
      toast.error('You must register your profile before commenting. Go to Profile > Save Changes.');
      return;
    }
    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'commentPost',
        args: [Number(id)],
        account: address,
        chain: config.chains[0],
      });
      if (tx) {
        toast(
          <span>
            Comment sent!{' '}
            <a
              href={`https://explorer.uomi.ai/tx/${tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              View on Explorer
            </a>
          </span>
        );
      }
      onComment?.();
    } catch (e) {}
  };

  // Handler for Share
  const handleShare = async () => {
    if (!address) {
      toast.error('Please connect your wallet first.');
      return;
    }
    if (!isRegistered) {
      toast.error('You must register your profile before sharing. Go to Profile > Save Changes.');
      return;
    }
    try {
      const tx = await writeContract(config, {
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'sharePost',
        args: [Number(id)],
        account: address,
        chain: config.chains[0],
      });
      if (tx) {
        toast(
          <span>
            Share sent!{' '}
            <a
              href={`https://explorer.uomi.ai/tx/${tx}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-primary"
            >
              View on Explorer
            </a>
          </span>
        );
      }
    } catch (e) {}
  };

  return (
    <Card className="p-4 hover:bg-card-hover transition-colors border-border">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={author.avatar} />
          <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-foreground">{author.name}</span>
            <span className="text-muted-foreground">@{author.username}</span>
            <Badge variant="secondary" className="text-xs">
              Lvl {author.level}
            </Badge>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">{timestamp}</span>
            {xpReward > 0 && (
              <>
                <span className="text-muted-foreground">·</span>
                <div className="flex items-center gap-1 text-success text-sm font-medium">
                  <Zap className="w-3 h-3" />
                  +{xpReward} XP
                </div>
              </>
            )}
          </div>

          {/* Post Content */}
          <p className="text-foreground mb-3 leading-relaxed">{content}</p>

          {/* Action Buttons */}
          <div className="flex items-center justify-between max-w-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2 text-muted-foreground hover:text-secondary hover:bg-secondary/10"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetweet}
              className={`flex items-center gap-2 ${
                retweeted
                  ? 'text-success hover:text-success'
                  : 'text-muted-foreground hover:text-success hover:bg-success/10'
              }`}
            >
              <Repeat2 className="w-4 h-4" />
              <span className="text-sm">{retweetCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 ${
                liked
                  ? 'text-destructive hover:text-destructive'
                  : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10'
              }`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="text-sm">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <Share className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground hover:bg-accent/10"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
