const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.serializeUser( (user, done) => {
  done(null, user)
})

passport.deserializeUser( (user, done) => {
  done(null, user)
})

passport.use(new GoogleStrategy(
  {
    clientID: '270622692344-0mkd6u3c89d281b3dg6gpolqea1b7ggn.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/login/callback',
    passReqToCallback: true
  },

  (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile)
  }
))