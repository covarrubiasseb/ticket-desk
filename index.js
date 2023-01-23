const express = require('express')
const passport = require('passport')
const session = require('express-session')
const db = require('./db')
const mysql = require('./mysql')
require('./passport')

const app = express()
const port = 5000

const isLoggedIn = (req, res, next) => {

  if (req.user && req.user.emails) {
    let name = req.user.displayName
    let email = req.user.emails[0].value

    mysql.connection.query(db.queries.findUser(email), (err, results) => {
      if (err) { throw err }
      else {
        if (results.length === 0) {
          // create user
          mysql.connection.query(db.queries.createUser(name, email), err => {
            if (err) { throw err }
          })
        }

        next()
      }
    })

  }

  else {
    res.redirect('/login')
  }
}

app.use(session({
  secret: 'google-auth-session'
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/login',
  passport.authenticate('google', {
          scope:
              ['email', 'profile']
      }
))

app.get('/login/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/')  
  }
)

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err) }
    res.redirect('/')
  })
})

app.use(isLoggedIn, express.static(`${__dirname}/ticket-desk/build`))

app.get('/api/user', (req, res) => {
  let email = req.user.emails[0].value

  mysql.connection.query(db.queries.findUser(email), (err, results) => {
    res.send(results[0].name)
  })
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
