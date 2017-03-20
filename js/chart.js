function setUpBarChart (chartData, barChartId) {
  d3.select(barChartId)
  .select('svg')
  .remove()
  var data = [chartData[0].budgets, chartData[0].spendings]
  var barW = 55
  var barH = 250
  var labelPadding = 26
  var barPadding = 25
  var x = d3.scaleLinear()
  .domain([0, 1])
  .range([0, barW + barPadding])
  var y = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .rangeRound([0, barH - labelPadding])
  var chart = d3
  .select(barChartId)
  .append('svg')
  .attr('class', 'chart')
  .attr('width', (barW *
    data.length) + barPadding)
    .attr('height', barH)
  chart.selectAll('rect')
  .data(data).enter()
  .append('rect')
  .attr('x', function (d, i) {
    return x(i) - 0.5
  }).attr('y', function (d) {
    return barH - 0.5
  }).attr('width', barW)
  .attr('class', function (d, i) {
    return i === 0 ? 'first' : 'second'
  }).transition()
  .delay(function (d, i) {
    return i * 600
  }).duration(800)
  .attr('height', function (d) {
    return y(d)
  }).attr('y', function (d) {
    return barH - y(d) - 0.5
  })
  chart
  .selectAll('text')
  .data(data)
  .enter()
  .append('text')
  .attr('width', barW)
  .attr('x', function (
    d, i) {
    return x(i) + barW / 2
  }).attr('y', function (d) {
    return barH - y(d) - 15
  }).attr('text-anchor', 'middle')
  .transition()
  .delay(function (d, i) {
    return i * 600
  }).duration(800).text(function (d) {
    return '$' + d
  })
}

function setUpPieChart (data, pieChartId) {
  d3.select(pieChartId).select('svg').remove()
  var width = 300
  var height = 300
  var radius = Math.min(width, height) / 2
  var legendRectSize = (radius * 0.05)
  var legendSpacing = radius * 0.02

  var color = d3.scaleOrdinal(d3.schemeCategory10)
  var pie = d3.pie()
  .value(function (d) {
    return d.value
  })(data)
  var arc = d3.arc()
  .outerRadius(radius - 10)
  .innerRadius(radius - 70)
  var svg = d3.select(pieChartId)
  .append('svg')
  .attr('width', width)
  .attr('height', height)
  .append('g')
  .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')') // Moving the center point. 1/2 the width and 1/2 the height
  var g = svg.selectAll('arc')
  .data(pie)
  .enter()
  .append('g')
  .attr('class', 'arc')
  g.append('path').style('fill', function (d) {
    return color(d.data.label)
  }).transition().delay(function (d, i) {
    return i * 500
  }).duration(500).attrTween('d', function (d) {
    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle)
    return function (t) {
      d.endAngle = i(t)
      return arc(d)
    }
  })

  var legend = svg.selectAll('.legend')
         .data(color.domain())
         .enter()
         .append('g')
         .attr('class', 'legend')
         .attr('transform', function (d, i) {
           var height = legendRectSize + legendSpacing
           var offset = height * color.domain().length / 2
           var horz = -3 * legendRectSize
           var vert = i * height - offset
           return 'translate(' + horz + ',' + vert + ')'
         })
  legend.append('rect')
      .attr('width', legendRectSize)
      .attr('height', legendRectSize)
      .style('fill', color)
      .style('stroke', color)

  legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function (d) { return d })

  return pie
}
exports.setUpBarChart = setUpBarChart
exports.setUpPieChart = setUpPieChart
