require('dotenv').config()
var dbPool = null
var server = null
var express = require('express')
var app = express()
var port = process.env.PORT || 8080
var passport = require('passport')
var flash = require('connect-flash')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var database = require('./config/dbConfig')

app.use(express.static(__dirname + '/public'))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
// ejs for templating
app.set('view engine', 'ejs')
// required for passport
app.use(session({
  secret: 'sessionscretiSpendthinkful',
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
require('./app/routes.js')(app, passport)

function runServer (mode) {
	// create db connection and pass the connection
  dbPool = database.createPool(mode)
  require('./app/api.js')(app, dbPool)
  require('./config/passport')(passport, dbPool)
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      resolve()
    }).on('error', err => {
      reject(err)
    })
  })
}

function closeServer () {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}
if (require.main === module) {
  runServer(process.env.DB_PRODUCTION)
	.catch(err => console.error(err))
};
module.exports = {
  runServer,
  app,
  closeServer
}
console.log('Listening ' + port)
