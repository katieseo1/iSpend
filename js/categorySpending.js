global.jQuery = $ = require('jquery')
global.d3 = d3 = require('d3/index')
require('../node_modules/bootstrap/dist/css/bootstrap.css')
require('../css/custom.css')
require('../css/categorySpending.css')
require('../node_modules/datatables.net-bs/css/datatables.bootstrap.css')
require('bootstrap')
require('datatables.net')
var chart = require('./chart')
var bootbox = require('bootbox')

  // Format data
function preprocessData (data) {
  var content = []
  for (var i = 0; i < data.result.length; i++) {
    if (data.result[i].amount == null) {
      data.result[i].amount = 0
    }
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
      if (data.result.length === 0) {
        bootbox.alert('Please add spending and budget')
      } else {
        chart.setUpPieChart(preprocessData(data), '#pieChart')
        categorySpendingTable.clear().draw()
        for (var i = 0; i < data.result.length; i++) {
          categorySpendingTable.row.add([data.result[i].name, '$' + data.result[i].amount.toFixed(
            2), '$' + data.result[i].budgets.toFixed(2)]).draw()
        }
      }
    }
  })
}

function getSpendingVsBudget (date) {
  console.log(date)
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
      if (data.result.length > 0) {
        chart.setUpBarChart(data.result, '#barChart')
      }
    }
  })
}

function formatDate (date) {
  console.log(date)
  var monthName = date.toLocaleString('en-us', {
    month: 'long'
  })
//  monthName.split(" ")
  return {
    month:   monthName.split(" ")[0],
    mm: date.getMonth() + 1,
    yy: date.getFullYear()
  }
}

$(function () {
  var today = new Date()
  var categorySpendingTable = $('#categorySpendingTable').DataTable({
    'paging': false,
    'class': 'display'
  })
  var pie = d3.pie()
  console.log(formatDate(today));
  getCategorySpending(formatDate(today), categorySpendingTable, pie)
  getSpendingVsBudget(formatDate(today))
  $('.btnViewSpendingHistory').on('click', function (event) {
    document.getElementById('myDropdown').classList.toggle('show')
  })
  $('.dropdown-menu li a').click(function (e) {
    var monthName = $(this).text().split(" ")[0]
    var year = $(this).attr("data-year")
    var month = $(this).attr("data-month")
    console.log(monthName)
    console.log(year)
    console.log(month)
    getCategorySpending({month:monthName, mm:month, yy:year}, categorySpendingTable, pie)
    getSpendingVsBudget({month:monthName, mm:month, yy:year})
  })
})
