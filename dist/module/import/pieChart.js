import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-shape'));
/**
 * Builds an Pie Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports pieChart
 */

var pieChart = function chart() {
  var _this = this;

  var svgContainer = d3.select('#' + this.chartData.selector);
  var cs = {
    radius: null,
    ordinalColors: ['#d1f4fa', '#005792', '#ffe6eb', '#ffcdcd']
  };
  cs.radius = this.height > this.width ? (this.width - this.width * 0.1) / 2 : (this.height - this.height * 0.1) / 2;

  var color = d3.scaleOrdinal().range(cs.ordinalColors);

  /**
   * @method getColor
   * @description Returns colors for pie chart
   */
  var getColor = function getColor(d, i) {
    return color(i);
  };

  /**
     * @method mouseOver
     * @param {Object} d (svg element)
     * @description Adds a tooltip on mouse over
     */
  var mouseOver = function mouseOver(d) {
    _this.addTooltip(d.data, window.event);
  };

  /**
     * @method mouseOut
     * @param {Object} d (svg element)
     * @description Removes tooltip on mouse out
     */
  var mouseOut = function mouseOut(d) {
    _this.removeTooltip(d);
  };

  var path = d3.arc().outerRadius(cs.radius - 10).innerRadius(25);

  /**
   * @method enter
   * @param {Object} arc (svg element)
   * @description Runs when a new element is added to the dataset
   */
  var enter = function enter(arc) {
    arc.enter().append('g').attr('transform', 'translate(' + _this.width / 2 + ',' + _this.height / 2 + ')').append('path').merge(arc).attr('class', 'arc').attr('d', path).attr('fill', getColor).on('mouseover', mouseOver).on('mouseout', mouseOut).attr('transform', 'translate(0,' + _this.header + ')');
    return arc;
  };
  /**
    * @method transition
    * @param {Object} arc (svg element)
    * @description Runs when a value of an element in dataset is changed
    */
  var transition = function transition(arc) {
    arc.transition().attr('d', path).attr('fill', getColor);
    return arc;
  };
  /**
   * @method exit
   * @param {Object} arc (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var exit = function exit(arc) {
    arc.exit().remove();
    return arc;
  };

  cs = this.setOverrides(cs, this.chartData.overrides);
  var pie = d3.pie().sort(null).value(function (d) {
    return d.metric;
  });

  var arc = svgContainer.selectAll('.arc').data(pie(this.ds));

  enter(arc);
  transition(arc);
  exit(arc);
};

export default pieChart;