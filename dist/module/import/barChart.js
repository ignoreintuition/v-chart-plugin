import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-ease'));
/**
 * Builds a Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports barChart
 */

var barChart = function chart() {
  var _this = this;

  var svgContainer = d3.select('#' + this.chartData.selector);
  var cs = {
    palette: {
      fill: '#005792',
      stroke: '#d1f4fa'
    },
    bar: {
      hPadding: 8,
      vPadding: 5
    },
    x: {
      axisHeight: 10,
      ticks: 5
    },
    y: {
      domain: [],
      range: [],
      axisWidth: null
    }
  };

  /**
     * @method getWidth
     * @param {Object} d (svg element)
     * @description Returns width of the bar
     */
  var getWidth = function getWidth(d) {
    return cs.x.scale(d.metric);
  };

  /**
      * @method getHeight
      * @description Returns height of the bar
      */
  var getHeight = function getHeight() {
    return (_this.displayHeight - cs.x.axisHeight - _this.header - cs.bar.vPadding) / _this.ds.length - 1;
  };

  /**
     * @method getYCoord
     * @param {Object} d (svg element)
     * @param {Object} i (svg element)
     * @description Returns y axis co-ordinate of the bar
     */
  var getYCoord = function getYCoord(d, i) {
    return i * (_this.displayHeight - cs.x.axisHeight - _this.header) / _this.ds.length + 1 + _this.header;
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
    rects.enter().append('rect').attr('fill', cs.palette.fill).attr('stroke', cs.palette.stroke).attr('class', _this.selector).attr('width', getWidth).attr('height', getHeight).attr('y', getYCoord).attr('x', cs.y.axisWidth + cs.bar.hPadding).on('mouseover', mouseOver).on('mouseout', mouseOut);
    return rects;
  };
  /**
   * @method transition
   * @param {Object} rects (svg element)
   * @description Runs when a value of an element in dataset is changed
   */
  var transition = function transition(rects) {
    rects.transition().attr('width', getWidth).attr('height', getHeight).attr('y', getYCoord).attr('x', cs.y.axisWidth + cs.bar.hPadding);
    return rects;
  };
  /**
   * @method exit
   * @param {Object} rect (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var exit = function exit(rects) {
    rects.exit().remove();
    return rects;
  };
  /**
   * @method buildScales
   * @description builds the scales for the x and y axes
   */
  var buildScales = function buildScales() {
    cs.x.scale = d3.scaleLinear().domain([0, _this.max]).range([0, _this.width - cs.bar.hPadding - cs.y.axisWidth]);
    _this.ds.forEach(function (t) {
      return cs.y.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.y.range.push((_this.displayHeight - cs.x.axisHeight - _this.header + cs.bar.vPadding) * i / _this.ds.length);
    });
    cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);
  };
  /**
   * @method drawAxis
   * @description draws the x and y axes on the svg
   */
  var drawAxis = function drawAxis() {
    cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, 's').scale(cs.x.scale);
    cs.y.axis = d3.axisLeft().scale(cs.y.scale);
    cs.x.yOffset = _this.displayHeight - cs.x.axisHeight;
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;
    cs.y.yOffset = cs.bar.vPadding + _this.header - 1;
    cs.y.xOffset = cs.y.axisWidth;
    if (_this.ds[0].dim) svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ', ' + cs.y.yOffset + ')').call(cs.y.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
  };

  var getMaxDimLength = function getMaxDimLength(accumulator, currentValue) {
    return currentValue.dim.length > accumulator ? currentValue.dim.length : accumulator;
  };

  var rects = svgContainer.selectAll('rect').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);
  if (this.ds[0].dim) cs.y.axisWidth = cs.y.axisWidth || this.ds.reduce(getMaxDimLength, 0) * 10;

  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);

  return cs;
};

export default barChart;