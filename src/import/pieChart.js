var d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-shape')
);

var drawChart = function (mode) {
  let ds = this.ds
  let svgContainer = d3.select('#' + this.chartData.selector),
    cs = {
      radius: null,
      ordinalColors: ['#d1f4fa', '#005792', '#ffe6eb', '#ffcdcd']
    };

  cs.radius = this.height > this.width ? (this.width - this.width * 0.1) / 2 : (this.height - this.height * 0.1) / 2;

  var pie = d3.pie()
    .sort(null)
    .value(function (ds) {
      return ds['metric'];
    });

  var path = d3.arc()
    .outerRadius(cs.radius - 10)
    .innerRadius(25);

  var arc = svgContainer.selectAll('.arc')
    .data(pie(ds))

  var color = d3.scaleOrdinal()
    .range(cs.ordinalColors)

  arc.enter()
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
      .append('path')
      .merge(arc)
      .attr('class', 'arc')
      .attr('d', path)
      .attr('fill', function (d, i) {
        return color(i);
      })
      .on('mouseover', d => {
        this.addTooltip(d.data, event);
      })
      .on('mouseout', d => {
        this.removeTooltip(d);
      })
      .attr('transform', 'translate(0,' + this.header + ')');

  arc.transition()
    .attr('d', path)
    .attr('fill', function (d, i) {
      return color(i);
    })
    
  arc.exit().remove();
};

export default drawChart;