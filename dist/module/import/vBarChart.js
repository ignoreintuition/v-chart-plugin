import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-transition'));
/**
 * Builds a Verticle Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports vBarChart
 */

var vBarChart = function chart() {
  var _this = this;

  var svgContainer = d3.select('#' + this.chartData.selector);
  var cs = {
    pallette: {
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
     * @method getWidth
     * @description Returns width of the bar
     */

  var getWidth = function getWidth() {
    return (_this.width - cs.y.axisWidth) / _this.chartData.data.length - 1;
  };

  /**
     * @method getHeight
     * @param {Object} d (svg element)
     * @description Returns height of the bar
     */
  var getHeight = function getHeight(d) {
    return _this.height - cs.y.scale(d.metric);
  };

  /**
     * @method getXCoord
     * @param {Object} d (svg element)
     * @param {Object} i (svg element)
     * @description Returns x axis co-ordinate of the bar
     */
  var getXCoord = function getXCoord(d, i) {
    return i * (_this.width - cs.y.axisWidth) / _this.chartData.data.length + cs.y.axisWidth;
  };
  /**
     * @method getYCoord
     * @param {Object} d (svg element)
     * @description Returns y axis co-ordinate of the bar
     */
  var getYCoord = function getYCoord(d) {
    return cs.y.scale(d.metric);
  };

  /**
     * @method mouseOver
     * @param {Object} d (svg element)
     * @description Adds a tooltip on mouse over
     */
  var mouseOver = function mouseOver(d) {
    _this.addTooltip(d, window.event);
  };

  /**
     * @method mouseOut
     * @param {Object} d (svg element)
     * @description Removes tooltip on mouse out
     */
  var mouseOut = function mouseOut(d) {
    _this.removeTooltip(d);
  };

  /**
   * @method enter
   * @param {Object} rects (svg element)
   * @description Runs when a new element is added to the dataset
   */
  var enter = function enter(rects) {
    rects.enter().append('rect').attr('fill', cs.pallette.fill).attr('stroke', cs.pallette.stroke).attr('class', _this.selector).attr('width', getWidth).attr('height', getHeight).attr('x', getXCoord).attr('y', getYCoord).on('mouseover', mouseOver).on('mouseout', mouseOut);
  };
  /**
   * @method transition
   * @param {Object} rects (svg element)
   * @description Runs when a value of an element in dataset is changed
   */
  var transition = function transition(rects) {
    rects.transition().attr('width', getWidth).attr('height', getHeight).attr('x', getXCoord).attr('y', getYCoord);
  };
  /**
   * @method exit
   * @param {Object} rects (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var exit = function exit(rects) {
    rects.exit().remove();
  };
  /**
   * @method buildScales
   * @description builds the scales for the x and y axes
   */
  var buildScales = function buildScales() {
    cs.y.scale = d3.scaleLinear().domain([0, _this.max]).range([_this.height, _this.header]);
    _this.ds.forEach(function (t) {
      return cs.x.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.x.range.push((_this.chartData.width - cs.y.axisWidth + cs.bar.vPadding) * i / _this.ds.length);
    });
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * @method drawAxis
   * @description draws the x and y axes on the svg
   */
  var drawAxis = function drawAxis() {
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.yOffset = _this.height;
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
};

export default vBarChart;