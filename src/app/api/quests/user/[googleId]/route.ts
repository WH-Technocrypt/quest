// src/app/api/quests/user/[googleId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { quests } from '@/data/quests';
import { findUserByGoogleId } from '@/lib/dataManager';

export async function GET(
  request: NextRequest,
  { params }: { params: { googleId: string } }
) {
  try {
    const { googleId } = params;

    // Find user from data manager
    const user = findUserByGoogleId(googleId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Attach user quest status
    const questsWithStatus = quests.map((quest) => ({
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
