require('dotenv').config()
require('es6-promise').polyfill()
require('isomorphic-fetch')
var db = require('../config/dbConfig.js')

module.exports = function (app) {
  function executeQry (qry, res) {
    if (db.pool().state === 'disconnected') {
      errMsg('server error', res)
    }
    db.pool().query(qry, function (err, rows) {
      if (err) errMsg(err, res)
      res.json({
        result: rows
      })
    })
  }

  function errMsg (err, res) {
    if (err) {
      res.status(500).json({
        message: 'Internal server error'
      })
    }
  }
  // category Spending Stat
  app.get('/api/categorySpendingStat', function (req, res) {
    var userId = Number(req.query.userId)
    var qry = `SELECT t3.budgets, t1.name, t2.purchase_date, t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id
    FROM category AS t1
    LEFT JOIN (SELECT (SELECT sum(amount) FROM spending WHERE user_id =${userId}) as total, purchase_date,category_id,sum(amount) as amount
      FROM spending
      WHERE user_id=${userId} and YEAR(purchase_date) =${req.query.year} AND MONTH(purchase_date) = ${req.query.month} GROUP by category_id
    ) AS t2
    ON t1.id = t2.category_id
    JOIN (SELECT amount as budgets,category_id
    FROM budget WHERE user_id=${userId}) as t3
    ON t3.category_id=t1.id`
    executeQry(qry, res)
  })
  // Get Year and Months
  app.get('/api/categorySpending', function (req, res) {
    var userId = Number(req.query.userId)
    var qry = `SELECT t1.name, t2.purchase_date,t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id
    FROM category AS t1 JOIN (SELECT (SELECT sum(amount)
    FROM spending WHERE user_id = ${userId}) as total, category_id, sum(amount) as amount, purchase_date
    FROM spending WHERE user_id = ${userId}
    GROUP by category_id)
    AS t2 ON t1.id = t2.category_id`
    executeQry(qry, res)
  })
  // Get list of category
  app.get('/api/transaction', function (req, res) {
    var qry = 'SELECT distinct name FROM category'
    executeQry(qry, res)
  })
  // Get list of year and month for spendings
  app.get('/api/yearMonth', function (req, res) {
    var userId = Number(req.query.userId)
    var qry = `SELECT Year(purchase_date) as year, month(purchase_date) as month
    FROM spending
    WHERE user_id=${userId}
    GROUP by Year(purchase_date), month(purchase_date) order by purchase_date DESC`

    executeQry(qry, res)
  })
  // Get spending for a specific category
  app.get('/api/sepecificSpending', function (req, res) {
    var qry = `SELECT * from spending
    WHERE user_id = ${req.query.userId} and Year(purchase_date) = ${req.query.year}
     and month(purchase_date) = ${req.query.month}
     and category_id = (select id from category where name ='${req.query.category}' )`
     console.log(qry)
    executeQry(qry, res)
  })
  // Get list of category for budget
  app.get('/api/budget', function (req, res) {
    var qry = 'SELECT id, name FROM category;'
    executeQry(qry, res)
  })
  // Get budgets and sepdning for a user based on year and month
  app.get('/api/spendingVsBudget/', function (req, res) {
    var userId = Number(req.query.userId)
    var qry = `SELECT budgets, spendings FROM
    (SELECT sum(amount) as budgets ,user_id FROM budget
    WHERE user_id=${userId}) as t1
    JOIN (SELECT sum(amount) as spendings, user_id
    FROM spending WHERE user_id=${userId} and YEAR(purchase_date) =${req.query.year} AND MONTH(purchase_date) = ${req.query.month}) as t2
    ON t1.user_id=t2.user_id`
    executeQry(qry, res)
  })
  // Add transaction
  app.post('/api/addTransaction', function (req, res) {
    var qry = `INSERT into spending (category_id, amount,  purchase_date, description, user_id) values
    ((SELECT id FROM category WHERE name ='${req.body.category}'),
    ${req.body.amount}, '${req.body.purchaseDate}','${req.body.description}', ${req.body.userId})`
    executeQry(qry, res)
  })
  // Set or Insert budget
  app.put('/api/setBudget', function (req, res) {
    var qry = `select * from budget where user_id = ${req.body.userId}`
    db.pool().query(qry, function (err, rows) {
      if (err) {
        errMsg('server error', res)
      }
      // Insert budget for new user
      if (rows.length === 0) {
        var insertQry = `insert into budget (amount,category_id,user_id) values`
        for (var i = 0; i < req.body.budget.length - 1; i++) {
          insertQry += `(${req.body.budget[i][1]}, ${req.body.budget[i][0]},${req.body.userId}),`
        }
        insertQry += `(${req.body.budget[i][1]}, ${req.body.budget[req.body.budget.length - 1][0]},${req.body.userId})`
        executeQry(insertQry, res)
      } else { // Update budget for an existing user
        var amountStr = ''
        var categoryListStr = ''
        for (var i = 0; i < req.body.budget.length; i++) {
          amountStr +=
            `when category_id = ${req.body.budget[i][0]} then ${req.body.budget[i][1]} `
          if (i !== 0) {
            categoryListStr += `,`
          }
          categoryListStr += `${req.body.budget[i][0]}`
        }
        var qry = `UPDATE budget SET amount = CASE ${amountStr} END
        WHERE category_id in (${categoryListStr}) AND user_id = ${req.body.userId}`
        executeQry(qry, res)
      }
    })
  })
}
