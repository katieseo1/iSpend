require('dotenv').config()
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt-nodejs')
var salt = process.env.SALT
var db = require('./dbConfig.js')
var hash

module.exports = function (passport) {
  // passport session setup ==================================================
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })
  // used to deserialize the user
  passport.deserializeUser(function (id, done) {
    db.pool().query('select * from users where id = ' + id, function (err, rows) {
      done(err, rows[0])
    })
  })
  // LOCAL SIGNUP ============================================================
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    var connection = db.pool()
    connection.query("select * from users where email = '" + email + "'", function (err,
      rows) {
      if (err) return done(err)
      if (rows.length) {
        return done(null, false, req.flash('signupMessage',
          'That email/username is already taken.'))
      } else {
        var newUserMysql = new Object()
        newUserMysql.email = email
        hash = bcrypt.hashSync(password, salt)
        newUserMysql.password = hash
        var insertQuery = "INSERT INTO users ( email, password ) values ('" + email +
          "','" + hash + "')"
        connection.query(insertQuery, function (err, rows) {
          newUserMysql.id = rows.insertId
          if (err) return done(err)
          return done(null, newUserMysql)
        })
      }
    })
  }))
  // LOCAL LOGIN =============================================================
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function (req, email, password, done) {
    db.pool().query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function (err,
      rows) {
      if (err) return done(err)
      if (!rows.length) {
        return done(null, false, req.flash('loginMessage', 'No user found.'))
      }
      if (bcrypt.hashSync(password, salt) !== rows[0].password) {
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'))
      }
      return done(null, rows[0])
    })
  }))
}
