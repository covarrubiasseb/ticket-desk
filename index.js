const express = require('express')
const passport = require('passport')
const session = require('express-session')
require('./passport')
require('./mysql')

const app = express()
const port = 5000

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
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
  res.send(req.user.displayName)
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
