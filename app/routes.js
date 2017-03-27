require('es6-promise').polyfill()
require('isomorphic-fetch')
const apiURL = 'http://localhost:3000/api/'
module.exports = function (app, passport) {
  // Display error message
  function errMsg (res) {
    if (res.status >= 400) {
      res.status(500)
    }
  }
  // Home page
  app.get('/', function (req, res) {
    res.render('index.ejs', {
      message: req.flash('loginMessage')
    })
  })

  // Get spending for a specific category
  app.get('/sepecificSpending', isLoggedIn, function (req, res) {
    req.body.userId = req.user.id
    fetch(apiURL +
      `sepecificSpending?userId=${req.user.id}&category=${req.query.inputData.category}&year=${req.query.inputData.year}&month=${req.query.inputData.month}`)
    .then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.json(data)
    })
  })
  // Category Spending page
  app.get('/categorySpending', isLoggedIn, function (req, res) {
    req.body.userId = req.user.id
    fetch(apiURL + 'yearMonth?userId=' + req.user.id)
    .then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.render('categorySpending.ejs', {
        data: data
      })
    })
  })
  // Spending category based on year & Month
  app.get('/categorySpendingStat', isLoggedIn, function (req, res) {
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
  app.get('/spendingVsBudget', isLoggedIn, function (req, res) {
    fetch(apiURL +
      `spendingVsBudget?userId=${req.user.id}&year=${req.query.year}&month=${req.query.month}`
    ).then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.json(data)
    })
  })
  // Add transaction
  app.post('/addTransaction', isLoggedIn, function (req, res) {
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
    }).then(res.json({message: 'success'}))
  })
  // Transaction page
  app.get('/transaction', isLoggedIn, function (req, res) {
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
  app.get('/budget', isLoggedIn, function (req, res) {
    fetch(apiURL + 'budget').then(function (res) {
      errMsg(res)
      return res.json()
    }).then(function (data) {
      res.render('budget.ejs', {
        data: data
      })
    })
  })
  // Set Budget
  app.put('/setBudget', isLoggedIn, function (req, res) {
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
    }).then(res.json({message: 'success'}))
  })
  // =============authentication===========//
  // logout
  app.get('/logout', function (req, res) {
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
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', {
      message: req.flash('signupMessage')
    })
  })
  // Process the signup form
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
