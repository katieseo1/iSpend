require('dotenv').config();
var LocalStrategy = require('passport-local').Strategy;
//var connection = require('../app/connection');

const bcrypt = require('bcrypt-nodejs');
const salt   = '$2a$10$wENMOiXaNvkXN9BmCbh4ZO';

//var database = require('../config/dbConfig');
//var database = require('../config/dbConfig');
module.exports = function(passport, pool) {

var pool = pool;
  //var connection = database.pool(process.env.DB_PRODUCTION)

	// =========================================================================
	// passport session setup ==================================================

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done) {

    pool.getConnection(function(err, connection) {

		connection.query("select * from users where id = " + id, function(err, rows) {
			done(err, rows[0]);
		});
  });
	});
	// =========================================================================
	// LOCAL SIGNUP ============================================================

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, email, password, done) {


		connection.query("select * from users where username = '" + email + "'", function(err, rows) {
			if (err) return done(err);
			if (rows.length) {
				return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
			} else {
				var newUserMysql = new Object();
				newUserMysql.email = email;

				hash = bcrypt.hashSync(password, salt);

				newUserMysql.password = hash; // use the generateHash function in our user model
				var insertQuery = "INSERT INTO users ( email, password ) values ('" + email + "','" + hash + "')";
				connection.query(insertQuery, function(err, rows) {
					newUserMysql.id = rows.insertId;
					return done(null, newUserMysql);
				});
			}
		});
	}));
	// =========================================================================
	// LOCAL LOGIN =============================================================

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true // allows us to pass back the entire request to the callback
	}, function(req, email, password, done) {

    // callback with email and password from our form

    pool.getConnection(function(err, connection) {
      console.log("-----LOGIN>>>>>>>>>>>-----");


				connection.query("SELECT * FROM `users` WHERE `email` = '" + email + "'", function(err, rows) {
			if (err) return done(err);
			if (!rows.length) {
				return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash
			}


			if (bcrypt.hashSync(password, salt) !== rows[0].password) {
				return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata
			}
			return done(null, rows[0]);
		});

})


	}));


};
