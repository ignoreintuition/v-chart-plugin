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
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-ease'), require('d3-array'));
/**
 * Builds a Box Plot.
 * @module boxPlot
 */

var boxPlot = function chart() {
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
    x: {
      axisHeight: 10,
      ticks: 5
    },
    y: {
      axisWidth: 10,
      ticks: 5
    }
  };

  /**
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} boxes (svg element)
   */
  var enter = function enter(boxes, lines) {
    boxes.enter().append('rect').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('class', _this.selector).attr('width', 50).attr('height', function (d) {
      return cs.y.scale(d.thirdQrt) - cs.y.scale(d.firstQrt);
    }).attr('x', 50).attr('y', function (d) {
      return cs.y.scale(d.firstQrt);
    });

    var l = lines.enter();

    l.append('line').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('x1', 75).attr('y1', function (d) {
      return cs.y.scale(d.min);
    }).attr('x2', 75).attr('y2', function (d) {
      return cs.y.scale(d.firstQrt);
    });

    l.append('line').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('x1', 75).attr('y1', function (d) {
      return cs.y.scale(d.thirdQrt);
    }).attr('x2', 75).attr('y2', function (d) {
      return cs.y.scale(d.max);
    });

    l.append('line').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('x1', 50).attr('y1', function (d) {
      return cs.y.scale(d.median);
    }).attr('x2', 100).attr('y2', function (d) {
      return cs.y.scale(d.median);
    });

    l.append('line').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('x1', 50).attr('y1', function (d) {
      return cs.y.scale(d.min);
    }).attr('x2', 100).attr('y2', function (d) {
      return cs.y.scale(d.min);
    });

    l.append('line').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', 3).attr('x1', 50).attr('y1', function (d) {
      return cs.y.scale(d.max);
    }).attr('x2', 100).attr('y2', function (d) {
      return cs.y.scale(d.max);
    });

    return boxes;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} boxes (svg element)
   */
  var transition = function transition(boxes) {
    boxes.transition();
    return boxes;
  };
  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} boxes (svg element)
   */
  var exit = function exit(rects) {
    boxes.exit().remove();
    return rects;
  };
  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  var buildScales = function buildScales() {
    cs.y.scale = d3.scaleLinear().domain([_this.min * 0.95, _this.max * 1.05]).range([_this.header, _this.displayHeight]);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  var drawAxis = function drawAxis() {};

  var ds = this.metricAsArray('total').sort();
  var a = [{
    min: this.min,
    median: d3.quantile(ds, 0.5),
    max: this.max,
    firstQrt: d3.quantile(ds, 0.25),
    thirdQrt: d3.quantile(ds, 0.75)
  }];

  var boxes = svgContainer.selectAll('rect').data(a);
  var lines = svgContainer.selectAll('line').data(a);

  cs = this.setOverrides(cs, this.chartData.overrides);
  buildScales(cs);
  drawAxis(cs);
  enter(boxes, lines);
  transition(boxes, lines);
  exit(boxes, lines);

  return cs;
};

export default boxPlot;