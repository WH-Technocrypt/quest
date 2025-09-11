import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as TwitterStrategy } from 'passport-twitter-oauth2';
import jwt from 'jsonwebtoken';
import { addUser, findUserByGoogleId, updateUser } from './dataManager';

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
  scope: ['profile', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user exists
    let user = findUserByGoogleId(profile.id);
    
    if (!user) {
      // Create new user
      user = addUser({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        xp: 0,
        quests: {}
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, googleId: user.googleId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return done(null, { user, token });
  } catch (error) {
    return done(error, null);
  }
}));

// Twitter OAuth Strategy
passport.use(new TwitterStrategy({
  clientID: process.env.TWITTER_CLIENT_ID,
  clientSecret: process.env.TWITTER_CLIENT_SECRET,
  callbackURL: '/api/auth/x/callback',
  scope: ['tweet.read', 'users.read', 'follow.read', 'like.read']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Extract Twitter user ID and access token
    const twitterUserId = profile.id;
    const twitterAccessToken = accessToken;
    
    return done(null, {
      xId: twitterUserId,
      xAccessToken: twitterAccessToken,
      profile
    });
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export { passport };