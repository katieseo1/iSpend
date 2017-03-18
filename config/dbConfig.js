require('dotenv').config()
var mysql = require('mysql')
var pool

module.exports = {
  createPool: function (mode) {
    var pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: mode
    })
    return pool
  },
  pool: function () {
    return pool
  }
}
