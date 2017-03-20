global.jQuery = $ = require('jquery')
require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('../css/custom.css')
require('bootstrap')
require('bs-validator')
require('bootbox')
var bootbox = require('bootbox')

function setBudgetRequest (data) {
  $.ajax({
    method: 'PUT',
    url: '/setBudget',
    data: JSON.stringify(data),
    async: true,
    success: function (data) {
      bootbox.alert({
        size: 'small',
        message: 'Done budgeting',
        callback: function () {
          location.reload()
        }
      })
    },
    dataType: 'json',
    contentType: 'application/json'
  })
  return false
}

function checkBudgetInput(budgets){
  for (var i = 0 ; i <budgets.length ; i++){
    if(budgets[i][1]!==0){
        return true
    }
  }
  return false
}
function setBudget () {
  var budgets = []
  var table = document.getElementById('budgetTable')
  for (var r = 1, n = table.rows.length; r < n; r++) {
    var obj = new Object()
    if (table.rows[r].querySelectorAll('.newBudget')[0].value) {
      obj[Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id'))] = table.rows[r].querySelectorAll(
        '.newBudget')[0].value
    } else {
      obj[Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id'))] = 0
    }
    var value = table.rows[r].querySelectorAll('.newBudget')[0].value
    budgets.push([Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id')), Number(table.rows[
      r].querySelectorAll('.newBudget')[0].value)])
  }

  if (checkBudgetInput(budgets)){
    setBudgetRequest({
      'budget': budgets
    })
  }
  else{
    bootbox.alert('Please set budget')
  }
}

function handleSetBudget () {
  $('#setBudget').submit(function (e) {
    e.preventDefault()
    e.stopImmediatePropagation()
    setBudget()
  })
}
$(function () {
  handleSetBudget()
})
