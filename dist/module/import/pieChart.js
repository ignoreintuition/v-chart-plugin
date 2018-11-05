import _Object$assign from 'babel-runtime/core-js/object/assign';
/** 
 *  @fileOverview Pie Chart component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */

/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-shape'));
/**
 * Builds an Pie Chart.
 * @module pieChart
 */

var pieChart = function chart() {
  var _this = this;

  /**
   * The SVG that stores the chart
   * @member svgContainer
   */
  var svgContainer = d3.select('#' + this.chartData.selector);
  /**
   * The configuration of the coordinate system
   * @member cs
   */
  var cs = {
    radius: null,
    ordinalColors: ['#d1f4fa', '#005792', '#ffe6eb', '#ffcdcd']
  };
  cs.radius = this.height > this.width ? (this.width - this.width * 0.1) / 2 : (this.height - this.height * 0.1) / 2;

  var color = d3.scaleOrdinal().range(cs.ordinalColors);

  /**
   * Returns colors for pie chart
   * @member getColor
   * @function
   */
  var getColor = function getColor(d, i) {
    return color(i);
  };

  /**
   * Adds a tooltip on mouse over
   * @member mouseOver
   * @function
   * @param {Object} d (svg element)
   */
  var mouseOver = function mouseOver(d) {
    _this.addTooltip(d.data, window.event);
  };

  /**
   * Removes tooltip on mouse out
   * @member mouseOut
   * @function
   * @param {Object} d (svg element)
   */
  var mouseOut = function mouseOut(d) {
    _this.removeTooltip(d);
  };

  var path = d3.arc().outerRadius(cs.radius - 10).innerRadius(25);

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} arc (svg element)
   */
  var enter = function enter(arc) {
    arc.enter().append('g').attr('transform', 'translate(' + _this.width / 2 + ',' + _this.height / 2 + ')').append('path').merge(arc).attr('class', 'arc').attr('d', path).attr('fill', getColor).on('mouseover', mouseOver).on('mouseout', mouseOut).attr('transform', 'translate(0,' + _this.header + ')');
    return arc;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} arc (svg element)
   */
  var transition = function transition(arc) {
    arc.transition().attr('d', path).attr('fill', getColor);
    return arc;
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} arc (svg element)
   */
  var exit = function exit(arc) {
    arc.exit().remove();
    return arc;
  };

  var pie = d3.pie().sort(null).value(function (d) {
    return d.metric;
  });

  var arc = svgContainer.selectAll('.arc').data(pie(this.ds));

  cs = this.setOverrides(cs, this.chartData.overrides);
  enter(arc);
  transition(arc);
  exit(arc);

  return cs;
};

export default pieChart;