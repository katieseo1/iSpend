require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('../css/index.css')

var validation = require('./validator')
$(function () {
  handleLogin()
//  validation.signUpForm()
})

function loginUser (user) {
  console.log(user)
  $.ajax({
    method: 'POST',
    url: '/login',
    data: JSON.stringify(user),
    success: function (data) {
      console.log(data)
      window.location('/categorySpending')
    },
    dataType: 'json',
    contentType: 'application/json'
  })
}

function handleLogin () {
  $('#loginForm').submit(function (e) {
    e.preventDefault()
    // $( "#single" ).val();
    alert(document.getElementsByName('email')[0].value)

    loginUser({
      email: document.getElementsByName('email'),
      password: document.getElementsByName('password')

    })
  })
}
