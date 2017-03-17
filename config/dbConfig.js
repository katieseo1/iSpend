require('dotenv').config();
var mysql = require('mysql');
var pool;

module.exports = {

  createPool : function (mode){
    var pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: mode
    });

    console.log("created DB FOR  ********"+mode);

    return pool;
  }
  ,
  pool: function() {
    return pool
  },
  qry: function(qry,pool){
    pool.getConnection(function(err, connection) {
      if (err) {
          console.log(err);
           return -1;
       }
      connection.query(qry, function(err, rows) {
          connection.release();
          return rows;
          //Done with connection
      });
    });
    }
,
    executeQuery :function(query,callback){
    pool.getConnection(function(err,connection){
        if (err) {
          connection.release();
          throw err;
        }
        connection.query(query,function(err,rows){
            connection.release();
            if(!err) {
                callback(null, {rows: rows});
            }
        });
        connection.on('error', function(err) {
              throw err;
              return;
        });
    });
}
}
