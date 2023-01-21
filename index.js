const express = require('express')
const passport = require('passport')
const session = require('express-session')
require('./passport')

const app = express()
const port = 3000

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next()
  } else {
    res.redirect('/google')
  }
}

app.use(session({
  secret: 'google-auth-session',
  keys: ['key1', 'key2']
}))

app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
  if (req.user) {
    res.redirect('/success')
  } else {
    res.redirect('/google')
  }
})

app.get('/failed', (req, res) => {
  res.send('<h1>Failed</h1>')
})

app.use('/success', isLoggedIn, express.static('www'))

app.get('/google', 
        passport.authenticate('google', { scope: ['email', 'profile'] })
)

app.get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/failed' }),
        (req, res) => {
          res.redirect('/success')
        }
)

app.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) { return next(err) }
    res.redirect('/')
  })
})


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
