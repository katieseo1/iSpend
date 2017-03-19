global.jQuery = $ = require('jquery')
global.d3 = d3 = require('d3/index')
require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('../css/custom.css')
require('../css/categorySpending.css')
require('../node_modules/datatables.net-bs/css/datatables.bootstrap.css')
require('bootstrap')

var bootbox = require('bootbox')
var datatables = require('datatables.net')
var chart = require('./chart')
  // Format data
function preprocessData (data) {
  var content = []
  for (var i = 0; i < data.result.length; i++) {
    content.push({
      label: data.result[i].name,
      value: data.result[i].amount
    })
  }
  return content
}
// Ajax call for getting category spending
function getCategorySpending (date, categorySpendingTable, dounutChart) {
  $('#spedningSummary').html(`Spending Summary for ${date.month} ${date.yy}`)
  $.ajax({
    url: 'categorySpendingStat/',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    data: {
      'year': date.yy,
      'month': date.mm
    },
    success: function (data) {
      chart.setUpPieChart(preprocessData(data), '#pieChart')
      categorySpendingTable.clear().draw()
      for (var i = 0; i < data.result.length; i++) {
        categorySpendingTable.row.add([data.result[i].name, '$' + data.result[i].amount.toFixed(
          2), '$' + data.result[i].budgets.toFixed(2)]).draw()
      }
    }
  })
}

function getSpendingVsBudget (date) {
  $.ajax({
    url: 'spendingVsBudget/',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    data: {
      'year': date.yy,
      'month': date.mm
    },
    success: function (data) {
      chart.setUpBarChart(data.result, '#barChart')
    }
  })
}

function formatDate (date) {
  return {
    month: date.toLocaleString('en-us', {
      month: 'long'
    }),
    mm: date.getMonth() + 1,
    yy: date.getFullYear()
  }
}

function arcTween (a) {
  var i = d3.interpolate(this._current, a)
  this._current = i(0)
  return function (t) {
    return arc(i(t))
  }
}

function labelarcTween (a) {
  var i = d3.interpolate(this._current, a)
  this._current = i(0)
  return function (t) {
    return 'translate(' + labelArc.centroid(i(t)) + ')'
  }
}
$(function () {
  var today = new Date()
  var categorySpendingTable = $('#categorySpendingTable').DataTable({
    'paging': false,
    'class': 'display'
  })
  var pie = d3.pie()
  getCategorySpending(formatDate(today), categorySpendingTable, pie)
  getSpendingVsBudget(formatDate(today))
  $('.btnViewSpendingHistory').on('click', function (event) {
    document.getElementById('myDropdown').classList.toggle('show')
  })
  $('.dropdown-menu li a').click(function (e) {
    var selectedDate = new Date($(this).text())
    console.log(selectedDate);
    getCategorySpending(formatDate(selectedDate), categorySpendingTable, pie)
    getSpendingVsBudget(formatDate(selectedDate))
  })
})
