const passport=require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const dotenv=require('dotenv');
const User=require('../models/User');

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback",
    passReqToCallback:true
  },
  async function(accessToken, refreshToken,params, profile, cb) {
   try {
        let user=await User.findOne({googleId:profile.id});
        if(user)
        {
            return cb(null,user);
        }
        else
        {
            const newUser=new User({
                googleId:profile.id,
                name:profile.displayName,
            });
            user=await User.create(newUser);
            return cb(null,user);
        }
   } catch (error) {
        
   }
    //  cb(null,profile);
  }
));

passport.serializeUser((user,cb)=>{
    // console.log({user:user});
    cb(null,user.id);
});

passport.deserializeUser(async(id,cb)=>{
    const currUser=await User.findById(id);
    cb(null,currUser);
})