require('es6-promise').polyfill()
require('isomorphic-fetch')
const express = require('express')
const app = express()
const connection = require('./connection.js')
module.exports = function (app) {
  // Display errors
  function errMsg (err, res) {
    res.status(500).json({
      message: 'Internal server error'
    })
  }
  // category Spending Stat
  app.get('/api/categorySpendingStat', (req, res) => {
    var userId = Number(req.query.userId)
    var qry = `SELECT t3.budgets, t1.name, t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id FROM category AS t1 JOIN (SELECT (SELECT sum(amount) FROM spending WHERE user_id =${userId}) as total, category_id,sum(amount) as amount FROM spending WHERE user_id=${userId} and YEAR(purchase_date) =${req.query.year} AND MONTH(purchase_date) = ${req.query.month} GROUP by category_id )AS t2 ON t1.id = t2.category_id JOIN (SELECT amount as budgets , category_id FROM budget WHERE user_id=${userId}) as t3 ON t3.category_id=t1.id`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json({
        result: rows
      })
    })
  })
  // Get Spending for each category
  app.get('/api/categorySpending', (req, res) => {
    var qry = `SELECT t1.name, t2.amount,(t2.amount/t2.total*100) as percentage, t1.id as category_id FROM category AS t1 JOIN (SELECT (SELECT sum(amount) FROM spending WHERE user_id =12) as total, category_id, sum(amount) as amount FROM spending WHERE user_id=12 GROUP by category_id )AS t2 ON t1.id = t2.category_id`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json({
        result: rows
      })
    })
  })
  // Get list of category
  app.get('/api/transaction', (req, res) => {
    var qry = 'SELECT distinct name FROM category'
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json({
        categoryList: rows
      })
    })
  })
  // Get list of year and month for spendings
  app.get('/api/yearMonth', (req, res) => {
    var userId = Number(req.query.userId)
    var qry = `SELECT Year(purchase_date) as year, month(purchase_date) as month FROM spending WHERE user_id=${userId} GROUP by Year(purchase_date), month(purchase_date)`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json(rows)
    })
  })
  // Get list of category for budget
  app.get('/api/budget', (req, res) => {
    var qry = 'SELECT id, name FROM category;'
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json({
        categoryList: rows
      })
    })
  })
  // Get budgets and sepdning for a user based on year and month
  app.get('/api/spendingVsBudget/', (req, res) => {
    var userId = Number(req.query.userId)
    var qry = `SELECT budgets, spendings FROM (SELECT sum(amount) as budgets ,user_id FROM budget WHERE user_id=${userId}) as t1 JOIN (SELECT sum(amount) as spendings, user_id FROM spending WHERE user_id=${userId} and YEAR(purchase_date) =${req.query.year} AND MONTH(purchase_date) = ${req.query.month}) as t2 on t1.user_id=t2.user_id`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json(rows)
    })
  })
  //* ******POST ENDPOINT*******************//
  // Add transaction
  app.post('/api/addTransaction', (req, res) => {
    var qry = `INSERT into spending (category_id, amount,  purchase_date, description, user_id) values ((SELECT id FROM category WHERE name ='${req.body.category}'),
		${req.body.amount}, '${req.body.purchaseDate}','${req.body.description}', ${req.body.userId})`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.json({
        message: 'success'
      })
    })
  })
  // Set budget
  app.post('/api/setBudget', (req, res) => {
    var amountStr = ''
    var categoryListStr = ''
    for (var i = 0; i < req.body.budget.length; i++) {
      amountStr +=
        `when category_id = ${req.body.budget[i][0]} then ${req.body.budget[i][1]} `
      if (i != 0) {
        categoryListStr += `,`
      }
      categoryListStr += `${req.body.budget[i][0]}`
    }
    var qry = `UPDATE budget SET amount = CASE ${amountStr} END WHERE category_id in (${categoryListStr}) AND user_id = ${req.body.userId}`
    connection.query(qry, function (err, rows) {
      if (err) console.log(err.message)
      res.status(200).json({
        message: 'success'
      })
    })
  })
}
