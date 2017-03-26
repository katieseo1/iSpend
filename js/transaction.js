global.jQuery = $ = require('jquery')
require('normalize-css')
require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('../css/categorySpending.css')
require('../node_modules/datatables.net-bs/css/datatables.bootstrap.css')
require('../css/custom.css')
require('../css/transaction.css')
require('bootstrap')
require('bs-validator')
require('bootstrap-datepicker')

var bootbox = require('bootbox')
var validation = require('./validator')

function displayMessage () {
  bootbox.confirm({
    message: 'Successfully added',
    buttons: {
      confirm: {
        label: 'Back to Spending page',
        className: 'btn-success'
      },
      cancel: {
        label: 'Add more transactions',
        className: 'btn-primary'
      }
    },
    callback: function (result) {
      if (result === true) {
        window.location.href = '/categorySpending'
      } else {
        document.getElementById('addTransactionForm').reset()
      }
    }
  })
}

function addTransaction (transaction) {
  $.ajax({
    method: 'POST',
    url: '/addTransaction',
    data: JSON.stringify(transaction),
    dataType: 'json',
    contentType: 'application/json',
    success: function (data) {
      displayMessage()
    },
    error: function (error) {
      console.log(error)
    }
  })
  return false
}

function validateUserInput (input) {
  var dateRegex = /^((19|20)\d\d)-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/
  var moneyRegex = /^\$?[0-9][0-9,]*[0-9]\.?[0-9]{0,2}$/i
  if (!(dateRegex.test(input.purchaseDate))) {
    bootbox.alert('invalid date format (YYYY-MM-DD)')
  } else if (!moneyRegex.test(input.amount)) {
    bootbox.alert('Invalid amount')
  } else if (!input.purchaseDate) {
    bootbox.alert('Please provide input')
  } else if (!input.amount) {
    bootbox.alert('Please provide purchase price')
  } else {
    addTransaction(input)
  }
}

function handleAddTransaction () {
  $('#addTransactionForm').submit(function (e) {
    e.preventDefault()
    e.stopImmediatePropagation()
    validateUserInput({
      category: $(e.currentTarget).find('#menu1').text().trim(),
      purchaseDate: $(e.currentTarget).find('#purchaseDate').val().trim(),
      amount: $(e.currentTarget).find('#amount').val().trim(),
      description: $(e.currentTarget).find('#description').val().trim()
    })
  })
}

$(function () {
  $('.date-picker').datepicker({
    format: 'yyyy-mm-dd',
    atuoclose: true,
    orientation: 'bottom right auto'
  })
  $('.dropdown-menu li a').click(function (e) {
    $('#menu1').text($(this).text())
  })
  $('.open-datetimepicker').click(function (event) {
    event.preventDefault()
    $('.date-picker').datepicker('show')
  })

  handleAddTransaction()
  validation.transactionForm()
})
