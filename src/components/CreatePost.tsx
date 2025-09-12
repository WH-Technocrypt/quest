import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image, Smile, MapPin, Calendar } from 'lucide-react';

interface CreatePostProps {
  userAvatar?: string;
  userName?: string;
  onPost?: (content: string) => void;
}

export const CreatePost = ({
  userAvatar = '',
  userName = 'User',
  onPost,
}: CreatePostProps) => {
  const [content, setContent] = useState('');
  const maxChars = 280;

  const handlePost = () => {
    if (content.trim()) {
      onPost?.(content);
      setContent('');
    }
  };

  const remainingChars = maxChars - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className="p-4 border-border">
      <div className="flex gap-3">
        {/* Avatar */}
        <Avatar className="w-10 h-10">
          <AvatarImage src={userAvatar} />
          <AvatarFallback>{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Content */}
        <div className="flex-1 space-y-3">
          {/* Text Area */}
          <Textarea
            placeholder="What's happening in your quest?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px] resize-none border-none p-0 text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {/* Actions Row */}
          <div className="flex items-center justify-between">
            {/* Media Options */}
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                <Image className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                <Smile className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                <MapPin className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                <Calendar className="w-4 h-4" />
              </Button>
            </div>

            {/* Character Count & Post Button */}
            <div className="flex items-center gap-3">
              <div className={`text-sm ${
                isOverLimit 
                  ? 'text-destructive' 
                  : remainingChars <= 20 
                    ? 'text-warning' 
                    : 'text-muted-foreground'
              }`}>
                {remainingChars}
              </div>
              
              <Button
                onClick={handlePost}
                disabled={!content.trim() || isOverLimit}
                variant="gaming"
                size="sm"
              >
                Post Quest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};