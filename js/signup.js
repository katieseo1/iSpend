global.jQuery = $ = require('jquery')
require('normalize-css');
require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('bootstrap')
require('bs-validator')
var validation = require('./validator')
$(function () {
  handleSignUp()
  validation.signUpForm()
})

function signupUser (user) {
  $.ajax({
    method: 'POST',
    url: '/signup',
    data: JSON.stringify(user),
    success: function (data) {
      window.location('/budget')
    },
    dataType: 'json',
    contentType: 'application/json'
  })
}

function handleSignUp () {
  $('#signupForm').submit(function (e) {
    e.preventDefault()
    signupUser({
      firstname: document.getElementsByName('firstname').trim(),
      lastname: document.getElementsByName('lastname').trim(),
      password: document.getElementsByName('password').trim(),
      email: document.getElementsByName('email').trim()
    })
  })
}
