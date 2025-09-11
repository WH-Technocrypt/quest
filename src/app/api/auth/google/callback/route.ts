import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=missing_code`);
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code,
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/google/callback`,
      grant_type: 'authorization_code'
    });

    const { access_token } = tokenResponse.data;

    // Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { id, email, name } = userResponse.data;

    // Import data manager functions
    const { addUser, findUserByGoogleId } = await import('@/lib/dataManager');
    
    // Check if user exists
    let user = findUserByGoogleId(id);
    
    if (!user) {
      // Create new user
      user = addUser({
        googleId: id,
        email,
        name,
        xp: 0,
        quests: {}
      });
    }

    // Create JWT token
    const jwt = (await import('jsonwebtoken')).default;
    const token = jwt.sign(
      { userId: user.id, googleId: user.googleId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?token=${token}&userId=${user.id}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}?error=oauth_failed`);
  }
}