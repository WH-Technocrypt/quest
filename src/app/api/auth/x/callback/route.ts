import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  // Get cookies
  const storedState = request.cookies.get('twitter_oauth_state')?.value;
  const userId = request.cookies.get('twitter_oauth_user_id')?.value;

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=${error}`);
  }

  if (!code || !state || !storedState || !userId) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=missing_parameters`);
  }

  if (state !== storedState) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=invalid_state`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://api.twitter.com/2/oauth2/token', {
      client_id: process.env.TWITTER_CLIENT_ID,
      client_secret: process.env.TWITTER_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/x/callback`,
      grant_type: 'authorization_code',
      code_verifier: 'challenge' // In production, you should implement PKCE
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://api.twitter.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { id: xId } = userResponse.data.data;

    // Import data manager functions
    const { updateUser } = await import('@/lib/dataManager');
    
    // Update user with X credentials
    const updatedUser = updateUser(userId, {
      xId,
      xAccessToken: access_token
    });

    if (!updatedUser) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=user_not_found`);
    }

    // Clear cookies
    const response = NextResponse.redirect(`${process.env.NEXTAUTH_URL}?x_linked=true`);
    response.cookies.delete('twitter_oauth_state');
    response.cookies.delete('twitter_oauth_user_id');

    return response;
  } catch (error) {
    console.error('X OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=x_oauth_failed`);
  }
}