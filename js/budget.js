global.jQuery = $ = require('jquery');
require('../node_modules/bootstrap/dist/css/bootstrap.css');
require('../css/custom.css');
require('bootstrap');
var bootbox = require('bootbox');
require('bs-validator');
require('bootbox');
var validation = require('./validator')

function setBudgetRequest(data) {
  console.log(data);
  $.ajax({
    method: 'PUT',
    url: '/setBudget',
    data: JSON.stringify(data),
    async: true,
    success: function(data) {
      bootbox.alert({
        size: 'small',
        message: 'Set budget',
        callback: function() {
          $('#setBudget').bootstrapValidator('resetForm', true);
          $('#setBudget').find('.has-error').removeClass('has-error');
          $('#setBudget').find('.has-success').removeClass('has-success');
          $('#setBudget').find('.form-control-feedback').remove();
        }
      });
    },
    dataType: 'json',
    contentType: 'application/json'
  });
  return false;
}

function setBudget() {
  var budgets = [];
  var table = document.getElementById('budgetTable');
  for (var r = 1, n = table.rows.length; r < n; r++) {
    element = table.rows[r].cells[1].innerHTML;
    var a = $(table.rows[r].cells[1].childNodes[0]).attr('data-id');
    var obj = new Object();
    if (table.rows[r].querySelectorAll('.newBudget')[0].value) {
      obj[Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id'))] = table.rows[r].querySelectorAll(
        '.newBudget')[0].value;
    } else {
      obj[Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id'))] = 0;
    }
    var value = table.rows[r].querySelectorAll('.newBudget')[0].value;
    budgets.push([Number($(table.rows[r].cells[1].childNodes[0]).attr('data-id')), Number(table.rows[
      r].querySelectorAll('.newBudget')[0].value)]);
  }
  setBudgetRequest({
    'budget': budgets
  });

}

function handleSetBudget() {
  $('#setBudget').submit(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    setBudget();
  });
}
$(function() {
  handleSetBudget();
  validation.setBudgetForm();
});
