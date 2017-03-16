const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv').load();
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
var mysql = require('promise-mysql');
require('./config/passport')(passport); // pass passport for configuration
var connection = require('./app/connection');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
// ejs for templating
app.set('view engine', 'ejs');
// required for passport
app.use(session({
  secret: 'sessionscretiSpendthinkful',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./app/routes.js')(app, passport);
require('./app/api.js')(app);
let server;

var dbPool = require('./config/dbConfig.js');
//dbPool.connect(dbPool.MODE_TEST);
dbPool.connect('test', function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
    app.listen(3000, function() {
      console.log('Listening on port 3000...')
    })
  }
})




function runServer(mode) {
  return new Promise((resolve, reject) => {
    dbPool.connect(mode, function() {

    server = app.listen(port, () => {
      resolve();
    }).on('error', err => {
      reject(err);
    });
  });
});
}

//if dbPool.get()

var qry = 'SELECT id, name FROM category;';
dbPool.get().query(qry, function(err, rows) {
  if (err) console.log(err.message);
  console.log(rows);

  });

function closeServer() {
  return new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
if (require.main === module) {
  runServer().catch(err => console.error(err));
};
module.exports = {
  runServer,
  app,
  closeServer
};
console.log('Listening ' + port);
