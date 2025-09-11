import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Generate state parameter for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);

  // Store state in session or cookie (simplified for demo)
  const response = NextResponse.redirect(
    `https://twitter.com/i/oauth2/authorize?client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/x/callback`)}&response_type=code&scope=tweet.read users.read follow.read like.read&state=${state}`
  );

  // Set state in cookie
  response.cookies.set('twitter_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600 // 1 hour
  });

  // Set user ID in cookie
  response.cookies.set('twitter_oauth_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 3600 // 1 hour
  });

  return response;
}