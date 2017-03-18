require('dotenv').config()
var chai = require('chai')
var should = chai.should()
var chaiHttp = require('chai-http')
var db = require('../config/dbConfig.js')
var connection = db.createPool(process.env.DB_TEST)
var {
  closeServer,
  runServer,
  app
} = require('../server')
chai.use(chaiHttp)
var budgetAry = [
  [10, 8000],
  [11, 220],
  [12, 20],
  [13, 30],
  [14, 40],
  [15, 60],
  [16, 50],
  [17, 70],
  [18, 80]
]
var mockingData = {
  userId: 25,
  year: 2017,
  month: 3,
  budgetList: {
    budget: budgetAry,
    userId: 25
  },
  category: 'Education',
  amount: 1234,
  purchaseDate: '2017-03-02',
  description: 'tst'
}
  // strategy : Compare the state of database after making various API requests
describe('iSpend API TEST', function () {
  // Start a server
  before(function () {
    runServer(process.env.DB_TEST)
  })
  after(function () {
    closeServer(process.env.DB_TEST)
    connection.end()
  })
    // 1.Get back all results returned by by GET requests
    // 2.Check if it has right status
    // 3.Compare the number of results with the records in the db
  describe('GET endpoint', function () {
    it('/categorySpendingStat : should return category spending data', function () {
      return chai.request(app).get(`/api/categorySpendingStat?userId=${mockingData.userId}&&year=${mockingData.year}&month=${mockingData.month}`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = `SELECT t3.budgets,t1.name,t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id
            FROM category AS t1
            JOIN
            (SELECT (SELECT sum(amount)FROM spending WHERE user_id =${mockingData.userId}) as total,category_id,sum(amount) as amount
              FROM spending
              WHERE user_id=${mockingData.userId} and YEAR(purchase_date) =${mockingData.year} AND MONTH(purchase_date) = ${mockingData.month} group by category_id
            ) AS t2
            ON t1.id = t2.category_id
            JOIN (SELECT amount as budgets , category_id
            FROM budget WHERE user_id=${mockingData.userId}) as t3
            ON t3.category_id=t1.id`
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
    it('/categorySpending : should return available records for year & month', function () {
      return chai.request(app).get(`/api/categorySpending?userId=${mockingData.userId}`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = `SELECT t1.name, t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id
          FROM category AS t1 JOIN (SELECT (SELECT sum(amount)
          FROM spending WHERE user_id = ${mockingData.userId}) as total, category_id, sum(amount) as amount
          FROM spending WHERE user_id = ${mockingData.userId}
          GROUP by category_id)
          AS t2 ON t1.id = t2.category_id`
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
    it('/transaction : should return all the category list', function () {
      return chai.request(app).get(`/api/transaction`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = 'SELECT distinct name FROM category'
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
    it('/yearMonth : should return a list of year and month for spending', function () {
      return chai.request(app).get(`/api/yearMonth?userId=${mockingData.userId}`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = `SELECT Year(purchase_date) as year, month(purchase_date) as month
          FROM spending
          WHERE user_id=${mockingData.userId}
          GROUP by Year(purchase_date), month(purchase_date)`
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
    it('/budget : should return list category for the budget', function () {
      return chai.request(app).get(`/api/budget`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = 'SELECT id, name FROM category;'
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
    it('/spendingVsBudget : budgets and sepdning for a user based on year and month', function () {
      return chai.request(app).get(`/api/spendingVsBudget?userId=${mockingData.userId}&year=${mockingData.year}&month=${mockingData.month}`).then(function (res) {
        res.should.have.status(200)
        res.body.result.should.have.length.of.at.least(1)
        var qry = `SELECT budgets, spendings FROM
          (SELECT sum(amount) as budgets ,user_id FROM budget
          WHERE user_id=${mockingData.userId}) as t1
          JOIN (SELECT sum(amount) as spendings, user_id
          FROM spending WHERE user_id=${mockingData.userId} and YEAR(purchase_date) =${mockingData.year} AND MONTH(purchase_date) = ${mockingData.month}) as t2 on t1.user_id=t2.user_id`
        connection.query(qry, res, function (err, rows) {
          if (err) console.log(err.message)
          res.body.result.length.should.equal(rows.length)
        })
      })
    })
  })
    //* ******************** PUT ENDPOINT **************//
  describe('PUT endpoint', function () {
    it('should add a transaction', function () {
      return chai.request(app).put('/api/setBudget').send(mockingData.budgetList).then(function (res) {
        res.should.be.json
        res.should.have.status(200)
        var qry = `SELECT amount, category_id from budget
  Where user_id = ${mockingData.userId} order by category_id`
        connection.query(qry, function (err, rows) {
          if (err) console.log(err.message)
          for (var i = 0; i < rows.length; i++) {
            budgetAry[i][0].should.equal(rows[i].category_id)
            budgetAry[i][1].should.equal(rows[i].amount)
          }
        })
      })
    })
  })
    //* ******************** POST ENDPOINT **************//
  describe('POST endpoint', function () {
    it('should add a transaction', function () {
      var transaction = {
        category: mockingData.category,
        amount: mockingData.amount,
        purchaseDate: mockingData.purchaseDate,
        description: mockingData.description,
        userId: mockingData.userId
      }
      return chai.request(app).post('/api/addTransaction').send(transaction).then(function (res) {
        res.should.be.json
        res.should.have.status(200)
        var qry = `select count(*) from spending
         WHERE category_id = (select id from category where name ='${transaction.category}') and
         amount = ${transaction.amount} and
         purchase_date = '${transaction.purchaseDate}' and
         description = '${transaction.description}' and
         user_id =  ${transaction.userId}`
        connection.query(qry, function (err, rows) {
          if (err) console.log(err.message)
          rows.count.should.have.length.of.at.least(1)
        })
      })
    })
  })
})
