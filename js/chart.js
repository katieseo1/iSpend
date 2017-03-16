function setUpBarChart(data, chart) {
  d3.select("#barChart").select("svg").remove();
  var data = [data[0].budgets, data[0].spendings];
  var bar_w = 55,
    bar_h = 250,
    label_padding = 26,
    bar_padding = 25;
  var x = d3.scaleLinear().domain([0, 1]).range([0, bar_w + bar_padding]);
  var y = d3.scaleLinear().domain([0, d3.max(data)]).rangeRound([0, bar_h - label_padding]);
  var chart = d3.select("#barChart").append("svg").attr("class", "chart").attr("width", (bar_w *
    data.length) + bar_padding).attr("height", bar_h);
  chart.selectAll("rect").data(data).enter().append("rect").attr("x", function(d, i) {
    return x(i) - .5;
  }).attr("y", function(d) {
    return bar_h - .5;
  }).attr("width", bar_w).attr("class", function(d, i) {
    return i == 0 ? 'first' : 'second'
  }).transition().delay(function(d, i) {
    return i * 600;
  }).duration(800).attr("height", function(d) {
    return y(d);
  }).attr("y", function(d) {
    return bar_h - y(d) - .5;
  });
  chart.selectAll("text").data(data).enter().append("text").attr("width", bar_w).attr("x", function(
    d, i) {
    return x(i) + bar_w / 2;
  }).attr("y", function(d) {
    return bar_h - y(d) - 15;
  }).attr("text-anchor", "middle").transition().delay(function(d, i) {
    return i * 600;
  }).duration(800).text(function(d) {
    return '$' + d;
  });
}

function setUpPieChart(data) {
  d3.select("#pieChart").select("svg").remove();
  var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;
  var color = d3.scaleOrdinal(d3.schemeCategory10);
  var pie = d3.pie().value(function(d) {
    return d.value;
  })(data);
  var arc = d3.arc().outerRadius(radius - 10).innerRadius(radius - 70);
  var labelArc = d3.arc().outerRadius(radius - 40).innerRadius(radius - 40);
  var svg = d3.select("#pieChart").append("svg").attr("width", width).attr("height", height).append(
    "g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")"); // Moving the center point. 1/2 the width and 1/2 the height
  var g = svg.selectAll("arc").data(pie).enter().append("g").attr("class", "arc");
  g.append("path").style("fill", function(d) {
    return color(d.data.label);
  }).transition().delay(function(d, i) {
    return i * 500;
  }).duration(500).attrTween('d', function(d) {
    var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
    return function(t) {
      d.endAngle = i(t);
      return arc(d);
    }
  });
  g.append("text").attr("transform", function(d) {
    var midAngle = d.endAngle < Math.PI ? d.startAngle / 2 + d.endAngle / 2 : d.startAngle / 2 +
      d.endAngle / 2 + Math.PI;
    return "translate(" + labelArc.centroid(d)[0] + "," + labelArc.centroid(d)[1] +
      ") rotate(-90) rotate(" + (midAngle * 180 / Math.PI) + ")";
  }).attr("dy", ".25em").attr('text-anchor', 'middle').text(function(d) {
    return d.data.label;
  })
  return pie;
}
exports.setUpBarChart = setUpBarChart;
exports.setUpPieChart = setUpPieChart;
