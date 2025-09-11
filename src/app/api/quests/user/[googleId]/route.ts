import { NextRequest, NextResponse } from 'next/server';

// Import quests data
const quests = (await import('../../../../../data/quests.js')).quests;

export async function GET(request: NextRequest, { params }: { params: { googleId: string } }) {
  try {
    const { googleId } = params;

    // Import data manager functions
    const { findUserByGoogleId } = await import('@/lib/dataManager');
    
    // Find user
    const user = findUserByGoogleId(googleId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Add user status to each quest
    const questsWithStatus = quests.map(quest => ({
      ...quest,
      status: user.quests[quest.id] || 'not_started'
    }));

    return NextResponse.json({
      quests: questsWithStatus,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        xId: user.xId,
        hasXLinked: !!user.xId
      }
    });
  } catch (error) {
    console.error('Get quests error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}