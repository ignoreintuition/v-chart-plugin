var d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-shape')
);
/**
 * Builds an Pie Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports pieChart
 */

var pieChart = function (mode) {
  let ds = this.ds
  let svgContainer = d3.select('#' + this.chartData.selector),
    cs = {
      radius: null,
      ordinalColors: ['#d1f4fa', '#005792', '#ffe6eb', '#ffcdcd']
    };

  /**
   * @method _enter
   * @param {Object} arc (svg element)
   * @description Runs when a new element is added to the dataset
   */
  var _enter = arc => {
    arc.enter()
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')')
      .append('path')
      .merge(arc)
      .attr('class', 'arc')
      .attr('d', path)
      .attr('fill', getColor)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut)
      .attr('transform', 'translate(0,' + this.header + ')');
      return arc;
  };
  /**
    * @method _transition
    * @param {Object} arc (svg element)
    * @description Runs when a value of an element in dataset is changed
    */
  var _transition = arc => {
    arc.transition()
      .attr('d', path)
      .attr('fill', getColor)
      return arc;
  };
  /**
   * @method _exit
   * @param {Object} arc (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var _exit = arc => {
    arc.exit().remove();
    return arc;
  };

  /**
   * 
   * Helper Functions 
   */
  var getColor = (d, i) => {
    return color(i);
  };

  var mouseOver = d => {
    this.addTooltip(d.data, event);
  };

  var mouseOut = d => {
    this.removeTooltip(d);
  };

  cs.radius = this.height > this.width ? (this.width - this.width * 0.1) / 2 : (this.height - this.height * 0.1) / 2;

  var path = d3.arc()
    .outerRadius(cs.radius - 10)
    .innerRadius(25);
  
  var color = d3.scaleOrdinal()
  .range(cs.ordinalColors)
  
  var pie = d3.pie()
    .sort(null)
    .value(function (ds) {
      return ds['metric'];
    });

  var arc = svgContainer.selectAll('.arc')
    .data(pie(ds))

  _enter(arc);
  _transition(arc);
  _exit(arc);

};

export default pieChart;