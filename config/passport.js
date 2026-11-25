import passport from "passport";
import {Strategy as GitHubStrategy} from 'passport-github2';
import dotenv from "dotenv";
import User from '../models/User.js';

dotenv.config();

passport.use(
  new GitHubStrategy(
    {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL,
    scope: ["user:email"],
  },
  async (accessToken, refreshToken , Profiler, done)=>{
    try{
        // 1. Check if a user already exists with this GitHub ID
        let user = await User.findOne({ githubId:Profiler.id})
        if(user){
            return done(null, user);
        }
        // Extract primary email from GitHub profile
        const email = 
            profile.emails && profile.emails.length > 0
                ? profile.emails[0].value
                : `${profile.username}@users.noreply.github.com`;

        // 2. Link to existing local account if email matches
        user = await User.findOne({email });
        if(user){
            user.githubId = profile.id;
            await user.save();
            return done(null, user);
        }
        // 3. Otherwise create a new user record
        const newUser = await User.create({
            githubId: profile.id,
            username: profile.username || profile.displayName || 'github_user',
            email,
        });
        return done(null,newUser);
    }catch(err){
        return done(err,null);
    }
  }
)
);
export default passport;