import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: NextRequest, { params }: { params: { questId: string } }) {
  try {
    const { questId } = params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Import data manager and quests
    const { findUserById, updateQuestStatus, addXp } = await import('@/lib/dataManager');
    const quests = (await import('../../../../../data/quests.js')).quests;
    
    // Find user
    const user = findUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find quest
    const quest = quests.find(q => q.id === questId);
    if (!quest) {
      return NextResponse.json({ error: 'Quest not found' }, { status: 404 });
    }

    // Check if user has X access token
    if (!user.xAccessToken) {
      return NextResponse.json({ error: 'X access token not found' }, { status: 400 });
    }

    // Verify quest based on type
    let isCompleted = false;

    switch (quest.type) {
      case 'like':
        isCompleted = await verifyLike(user.xAccessToken, user.xId, quest.target_post_id);
        break;
      case 'follow':
        isCompleted = await verifyFollow(user.xAccessToken, user.xId, quest.target_user_id);
        break;
      case 'retweet':
        isCompleted = await verifyRetweet(user.xAccessToken, user.xId, quest.target_post_id);
        break;
      default:
        return NextResponse.json({ error: 'Unsupported quest type' }, { status: 400 });
    }

    if (isCompleted) {
      // Update quest status to completed
      const updatedUser = updateQuestStatus(userId, questId, 'completed');
      
      // Add XP to user
      const userWithXp = addXp(userId, quest.xp);
      
      return NextResponse.json({
        success: true,
        message: 'Quest completed successfully',
        questId,
        status: 'completed',
        xpEarned: quest.xp,
        totalXp: userWithXp.xp
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Quest requirements not met',
        questId,
        status: 'in_progress'
      });
    }
  } catch (error) {
    console.error('Verify quest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Verify if user liked a specific post
async function verifyLike(accessToken, userId, targetPostId) {
  try {
    const response = await axios.get(`https://api.twitter.com/2/users/${userId}/liked_tweets`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        max_results: 100
      }
    });

    const likedPosts = response.data.data || [];
    return likedPosts.some(post => post.id === targetPostId);
  } catch (error) {
    console.error('Error verifying like:', error);
    return false;
  }
}

// Verify if user follows a specific user
async function verifyFollow(accessToken, userId, targetUserId) {
  try {
    const response = await axios.get(`https://api.twitter.com/2/users/${userId}/following`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        max_results: 1000
      }
    });

    const following = response.data.data || [];
    return following.some(user => user.id === targetUserId);
  } catch (error) {
    console.error('Error verifying follow:', error);
    return false;
  }
}

// Verify if user retweeted a specific post
async function verifyRetweet(accessToken, userId, targetPostId) {
  try {
    const response = await axios.get(`https://api.twitter.com/2/users/${userId}/tweets`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      params: {
        max_results: 100,
        tweet_fields: 'referenced_tweets'
      }
    });

    const tweets = response.data.data || [];
    return tweets.some(tweet => 
      tweet.referenced_tweets && 
      tweet.referenced_tweets.some(ref => ref.type === 'retweeted' && ref.id === targetPostId)
    );
  } catch (error) {
    console.error('Error verifying retweet:', error);
    return false;
  }
}