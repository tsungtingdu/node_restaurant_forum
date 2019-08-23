const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, username, password, cb) => {
    User.findOne({
      where: { email: username }
    })
      .then(user => {
        if (!user)
          return cb(null, false, req.flash('error_messages', 'Wrong email or password'))

        if (!bcrypt.compareSync(password, user.password))
          return cb(null, false, req.flash('error_messages', 'Wrong email or password'))

        return cb(null, user)
      })
  })
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    return cb(null, user)
  })
})

module.exports = passport