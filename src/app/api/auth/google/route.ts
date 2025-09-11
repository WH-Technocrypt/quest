import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return new NextResponse(null, {
    status: 302,
    headers: {
      Location: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${process.env.NEXTAUTH_URL}/api/auth/google/callback`)}&response_type=code&scope=profile email`
    }
  });
}