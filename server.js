require('dotenv').config()
var dbPool = null
var server = null
var express = require('express')
var app = express()
var port
var passport = require('passport')
var flash = require('connect-flash')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var database = require('./config/dbConfig')

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/assets'))
app.use('/assets', express.static(__dirname + '/assets'))

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

var dbPool
require('./app/api.js')(app)
require('./config/passport')(passport)
require('./app/routes.js')(app, passport)

function runServer (mode, portChoice) {
  dbPool=database.createPool(mode)
  port = portChoice
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
    dbPool.end()
  })
}
if (require.main === module) {
  runServer(process.env.DB_PRODUCTION, process.env.DB_PORT).catch(err => console.error(err))
};

module.exports = {
  runServer,
  app,
  closeServer
}
console.log('Listening ' + port)
