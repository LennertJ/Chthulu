const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})

passport.use(new DiscordStrategy({
    clientID: process.env.OATH2_CLIENT_ID,
    clientSecret: process.env.OATH2_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.WB_PORT}/auth/login/redirect`,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        done(null, profile)
    } else {
        done('Error during authentication', null)
    }
}))