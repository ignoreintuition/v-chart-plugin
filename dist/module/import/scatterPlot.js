import _Object$assign from 'babel-runtime/core-js/object/assign';
/** 
 *  @fileOverview Scatter Plot component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */

/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'));
/**
 * Builds a Scatter Plot.
 * @module scatterPlot
 */

var scatterPlot = function chart() {
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
      pointFill: '#005792',
      pointStroke: '#d1f4fa'
    },
    x: {
      domain: [],
      range: [],
      axisHeight: 20,
      label: this.metric[0]
    },
    y: {
      axisWidth: 30,
      ticks: 5,
      label: this.metric[1]
    },
    r: {
      width: 5
    }
  };

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} points (svg element) 
   */
  var enter = function enter(points) {
    points.enter().append('circle').attr('class', _this.selector).attr('fill', cs.palette.fill).attr('stroke', cs.palette.stroke).attr('r', cs.r.width).on('mouseover', function (d) {
      _this.addTooltip(d, window.event);
    }).on('mouseout', function (d) {
      _this.removeTooltip(d);
    }).attr('cx', function (d) {
      return cs.x.scale(d.metric[0]) + cs.y.axisWidth + 5;
    }).attr('cy', function (d) {
      return cs.y.scale(d.metric[1]);
    });
    return points;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} points (svg element) 
   */
  var transition = function transition(points) {
    points.transition().attr('r', cs.r.width).attr('cx', function (d) {
      return cs.x.scale(d.metric[0]) + cs.y.axisWidth + 5;
    }).attr('cy', function (d) {
      return cs.y.scale(d.metric[1]);
    });
    return points;
  };

  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} points (svg element)
   */
  var exit = function exit(points) {
    points.exit().remove();
    return points;
  };

  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  var buildScales = function buildScales(cs) {
    cs.y.scale = d3.scaleLinear().domain([_this.minTriplet.v2 - _this.maxTriplet.v2 * .05, _this.maxTriplet.v2 + _this.maxTriplet.v2 * .05]).range([_this.displayHeight - cs.x.axisHeight, _this.header]);
    cs.x.scale = d3.scaleLinear().domain([_this.minTriplet.v1 - _this.maxTriplet.v2 * .05, _this.maxTriplet.v1 + _this.maxTriplet.v1 * .05]).range([0, _this.width]);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  var drawAxis = function drawAxis(cs) {
    _this.drawGrid(cs);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = _this.displayHeight - cs.x.axisHeight;
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ',' + cs.y.yOffset + ')').call(cs.y.axis);
  };

  var points = svgContainer.selectAll('circle').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);
  buildScales(cs);
  drawAxis(cs);
  enter(points);
  transition(points);
  exit(points);

  return cs;
};

export default scatterPlot;