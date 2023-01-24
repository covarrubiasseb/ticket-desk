const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const mysql = require('./mysql');

passport.serializeUser( (user, done) => {

  mysql.connection.query(db.queries.findUser(user.emails[0].value), (err, results) => {

    if (err) { throw err }

    else if (results.length < 1) {

      mysql.connection.query(db.queries.createUser(user.displayName, user.emails[0].value), (err, results) => {

        if (err) { throw err }

        done(null, user);

      });

    } else {

      done(null, user);

    }

  });

});

passport.deserializeUser( (user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy(
  {
    clientID: '270622692344-0mkd6u3c89d281b3dg6gpolqea1b7ggn.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:5000/login/callback',
    passReqToCallback: true
  },

  (request, accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));