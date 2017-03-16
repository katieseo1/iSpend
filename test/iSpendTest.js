const dotenv = require('dotenv').load();
//const mysql = require('mysql');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const connection = require('../app/testConnection.js');
const {
  closeServer,
  runServer,
  app
} = require('../server');
chai.use(chaiHttp);

let pool;
var userId = 25;
var year = 2017;
var month = 3;
describe('Npm-MySql-Testing', function() {
  //connect db & start a server
  before(function() {
    runServer();
  });
  describe('GET endpoint', function() {
    it('should return all existing posts', function() {
      this.timeout(5000);
      let res;
      let count;
      return chai.request(app).get(
        '/api/categorySpendingStat?userId=25&&year=2017&month=3').then(_res => {
        res = _res;
        res.should.have.status(200);
        res.body.result.should.have.length.of.at.least(1);
        count = res.body.result.length;
        var qry =
          `SELECT t3.budgets, t1.name, t2.amount,
												(t2.amount/t2.total*100) as percentage, t1.id as category_id FROM category AS t1
								   		JOIN
									 			(select (select sum(amount) from spending where user_id =${userId}) as total,
										  	category_id,sum(amount) as amount from spending
									  		where user_id=${userId} and YEAR(purchase_date) =${year} AND
								    		MONTH(purchase_date) = ${month} group by category_id )AS t2
												ON t1.id = t2.category_id
								   		JOIN (select amount as budgets , category_id from budget where user_id=${userId}) as t3
									 			ON t3.category_id=t1.id`;
        connection.query(qry, function(err, rows) {
          if (err) console.log(err.message);
          count.should.equal(rows.length);
        });
      });
    });
  });
  describe('POST endpoint', function() {
    let transaction;
    it('should add a transaction', function(done) {
      this.timeout(5000);
      const transaction = {
        category: 'Education',
        amount: 1234,
        purchaseDate: '2017-03-02',
        description: 'tst',
        userId: 25
      };
      chai.request(app).post('/api/addTransaction').send(transaction).then(function(res,
        err) {
        console.log(res.body);
        res.should.be.json;
        res.should.have.status(200);
        var qry = 'select * from spending;';
        connection.query(qry, function(err, rows) {
          if (err) console.log(err.message);
          done();
        });
      });
    });
    // Compare the test score we sent over with a score of the student in DB
  });
});
