import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: { questId: string } }) {
  try {
    const { questId } = params;
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Import data manager functions
    const { findUserById, updateQuestStatus } = await import('@/lib/dataManager');
    
    // Find user
    const user = findUserById(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has X linked (required for most quests)
    if (!user.xId) {
      return NextResponse.json({ error: 'X account not linked' }, { status: 400 });
    }

    // Update quest status to in_progress
    const updatedUser = updateQuestStatus(userId, questId, 'in_progress');
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update quest status' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Quest started successfully',
      questId,
      status: 'in_progress'
    });
  } catch (error) {
    console.error('Start quest error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}