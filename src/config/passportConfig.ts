import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { googleOAuth2Client } from "./oathConfig";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_REDIRECT_URI!,
        },
        (accessToken, refreshToken, profile, done) => {
            // Save tokens and profile information in your database if needed
            return done(null, { accessToken, refreshToken, profile });
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user!);
});
