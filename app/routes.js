require('es6-promise').polyfill()
require('isomorphic-fetch')
const apiURL = 'http://127.0.0.1:8080/api/'
module.exports = function (app, passport) {
  // Display error message
  function errMsg (res) {
    if (res.status >= 400) {
      throw new Error('Bad response from server')
    }
  }
  // Home page
  app.get('/', function (req, res) {
    res.render('index.ejs', {
      message: req.flash('loginMessage')
    })
  })
  // Category Spending page
  app.get('/categorySpending', isLoggedIn, (req, res) => {
    req.body.userId = req.user.id
    fetch(apiURL + 'yearMonth?userId=' + req.user.id)
    .then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.render('categorySpending.ejs', {
        result: data
      })
    })
  })
  // Spending category based on year & Month
  app.get('/categorySpendingStat', isLoggedIn, (req, res) => {
    fetch(apiURL +
      `categorySpendingStat?userId=${req.user.id}&year=${req.query.year}&month=${req.query.month}`)
    .then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.json(data)
    })
  })
  // Spending and Budget for a month
  app.get('/spendingVsBudget', isLoggedIn, (req, res) => {
    fetch(apiURL +
      `spendingVsBudget?userId=${req.user.id}&year=${req.query.year}&month=${req.query.month}`
    ).then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      console.log(data)
      res.json(data)
    })
  })
  // Add transaction
  app.post('/addTransaction', isLoggedIn, (req, res) => {
    req.body.userId = req.user.id
    fetch(apiURL + 'addTransaction/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }).then(function (res) {
      errMsg(res)
      return res.json()
    }).then(res.json({
      message: 'success'
    }))
  })
  // transaction page
  app.get('/transaction', isLoggedIn, (req, res) => {
    fetch(apiURL + 'transaction').then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.render('transaction.ejs', {
        categoryList: JSON.stringify(data)
      })
    })
  })
  // Budget page
  app.get('/budget', isLoggedIn, (req, res) => {
    fetch(apiURL + 'budget').then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      console.log(data)
      res.render('budget.ejs', {
        data: data
      })
    })
  })
  // Set Budget
  app.put('/setBudget', isLoggedIn, (req, res) => {
    req.body.userId = req.user.id
    fetch(apiURL + 'setBudget/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req.body)
    }).then(function (res) {
      errMsg(res)
      return res.json()
    }).then(res.json(1))
  })
  // =============authentication===========//
  // logout
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })
  // Login
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/categorySpending',
    failureRedirect: '/',
    failureFlash: true
  }))
  // signup page
  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    })
  })
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/budget',
    failureRedirect: '/signup',
    failureFlash: true
  }))
}
// route middleware to ensure user is logged in
function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/')
}
