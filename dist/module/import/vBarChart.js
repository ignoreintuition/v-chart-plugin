import _Object$assign from 'babel-runtime/core-js/object/assign';
/** 
 *  @fileOverview Verticle Bar Chart component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */

var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-transition'));
/**
 * Builds a Verticle Bar Chart.
 * @module vBarChart
 */

var vBarChart = function chart() {
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
    palette: {
      fill: '#005792',
      stroke: '#d1f4fa'
    },
    bar: {
      hPadding: 0,
      vPadding: 0
    },
    x: {
      axisHeight: 20,
      domain: [],
      range: []
    },
    y: {
      axisWidth: 30,
      ticks: 5
    }
  };
  /**
   * Returns width of the bar
   * @member getWidth
   * @function
   */

  var getWidth = function getWidth() {
    return (_this.width - cs.y.axisWidth) / _this.chartData.data.length - 1;
  };

  /**
   * Returns height of the bar
   * @member getHeight
   * @function
   * @param {Object} d (svg element)
   */
  var getHeight = function getHeight(d) {
    return _this.displayHeight - cs.y.scale(d.metric);
  };

  /**
   * Returns x axis co-ordinate of the bar
   * @member getXCoord
   * @function
   * @param {Object} d (svg element)
   * @param {Object} i (svg element)
   */
  var getXCoord = function getXCoord(d, i) {
    return i * (_this.width - cs.y.axisWidth) / _this.chartData.data.length + cs.y.axisWidth;
  };
  /**
   * Returns y axis co-ordinate of the bar
   * @member getYCoord
   * @function
   * @param {Object} d (svg element)
   */
  var getYCoord = function getYCoord(d) {
    return cs.y.scale(d.metric);
  };

  /**
   * Adds a tooltip on mouse over
   * @member mouseOver
   * @function
   * @param {Object} d (svg element)
   */
  var mouseOver = function mouseOver(d) {
    _this.addTooltip(d, window.event);
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

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} rects (svg element)
   */
  var enter = function enter(rects) {
    rects.enter().append('rect').attr('fill', cs.palette.fill).attr('stroke', cs.palette.stroke).attr('class', _this.selector).attr('width', getWidth).attr('height', getHeight).attr('x', getXCoord).attr('y', getYCoord).on('mouseover', mouseOver).on('mouseout', mouseOut);
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} rects (svg element)
   */
  var transition = function transition(rects) {
    rects.transition().attr('width', getWidth).attr('height', getHeight).attr('x', getXCoord).attr('y', getYCoord);
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} rects (svg element)
   */
  var exit = function exit(rects) {
    rects.exit().remove();
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  var buildScales = function buildScales() {
    cs.y.scale = d3.scaleLinear().domain([0, _this.max]).range([_this.displayHeight, _this.header]);
    _this.ds.forEach(function (t) {
      return cs.x.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.x.range.push((_this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i / _this.ds.length);
    });
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  var drawAxis = function drawAxis() {
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.yOffset = _this.displayHeight;
    cs.x.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    cs.y.xOffset = cs.y.axisWidth;
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ', ' + cs.y.yOffset + ')').call(cs.y.axis);
    if (_this.ds[0].dim) svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
  };

  var rects = svgContainer.selectAll('rect').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);
  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);

  return cs;
};

export default vBarChart;