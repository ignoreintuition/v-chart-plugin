import _Object$assign from 'babel-runtime/core-js/object/assign';
import { globalAgent } from 'http';

/** 
 *  @fileOverview Bar chart component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */

/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-ease'));
/**
 * Builds a Bar Chart.
 * @module barChart
 */

var barChart = function chart() {
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
      fill: ['#005792', '#ffcdcd'],
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
   * Returns width of the bar
   * @member getWidth
   * @function
   * @param {Object} d (svg element)
   */
  var getWidth = function getWidth(d) {
    return cs.x.scale(d.metric);
  };

  /**
   * Returns height of the bar
   * @member getHeight
   * @function
   */
  var getHeight = function getHeight() {
    return ((_this.displayHeight - cs.x.axisHeight - _this.header - cs.bar.vPadding) / _this.ds.length - 1) / _this.metric.length;
  };

  /**
   * Returns y axis co-ordinate of the bar
   * @member getYCoord
   * @function
   * @param {Object} d (svg element)
   * @param {Object} i (svg element)
   */
  var getYCoord = function getYCoord(d, i) {
    return i * (_this.displayHeight - cs.x.axisHeight - _this.header) / _this.ds.length + 1 + _this.header + cs.bar.offset * getHeight();
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
    _this.metric.forEach(function (e, i) {
      cs.bar.offset = i;
      rects[i].enter().append('rect').attr('fill', cs.palette.fill[i]).attr('stroke', cs.palette.stroke).attr('class', _this.selector).attr('class', 'r' + i).attr('width', getWidth).attr('height', getHeight).attr('y', getYCoord).attr('x', cs.y.axisWidth + cs.bar.hPadding).on('mouseover', mouseOver).on('mouseout', mouseOut);
    });
    if (_this.goal) _this.generateGoal(cs, svgContainer, false, cs.y.axisWidth + cs.bar.hPadding);
    return rects;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} rects (svg element)
   */
  var transition = function transition(rects) {
    _this.metric.forEach(function (e, i) {
      cs.bar.offset = i;
      rects[i].transition().attr('width', getWidth).attr('height', getHeight).attr('y', getYCoord).attr('x', cs.y.axisWidth + cs.bar.hPadding);
    });
    if (_this.goal) _this.generateGoal(cs, svgContainer, false, cs.y.axisWidth + cs.bar.hPadding);
    return rects;
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} rect (svg element)
   */
  var exit = function exit(rects) {
    _this.metric.forEach(function (e, i) {
      rects[i].exit().remove();
    });
    return rects;
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
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
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
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
  /**
   * Get the maximum dimension length
   * @member getMaxDimLength
   * @function
   * @param {number} accumulator
   * @param {number} currentValue
   */
  var getMaxDimLength = function getMaxDimLength(accumulator, currentValue) {
    if (!currentValue.dim) return accumulator;
    return currentValue.dim.length > accumulator ? currentValue.dim.length : accumulator;
  };

  var rects = [];
  this.metric.forEach(function (e, i) {
    rects.push(svgContainer.selectAll('rect.r' + i).data(_this.ds.map(function (d) {
      return {
        metric: d.metric[i],
        dim: d.dim
      };
    })));
  });

  cs = this.setOverrides(cs, this.chartData.overrides);
  if (this.ds[0] && this.ds[0].dim) cs.y.axisWidth = cs.y.axisWidth || this.ds.reduce(getMaxDimLength, 0) * 10;

  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);

  return cs;
};

export default barChart;