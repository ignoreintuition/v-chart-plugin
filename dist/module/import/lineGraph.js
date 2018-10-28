import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-shape'));
/**
 * Builds a Line Graph.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports lineGraph
 */

var lineGraph = function chart(mode) {
  var _this = this;

  var svgContainer = d3.select('#' + this.chartData.selector);
  var cs = {
    palette: {
      lineFill: '#ffcdcd',
      pointFill: '#005792',
      pointStroke: '#d1f4fa'
    },
    x: {
      domain: [],
      range: [],
      axisHeight: 20
    },
    y: {
      axisWidth: 30,
      ticks: 5
    }
  };

  /**
   * @method enter
   * @param {Object} points (svg element) 
   * @description Runs when a new element is added to the dataset
   */
  var enter = function enter(points, path) {
    if (mode === 'init') path.enter().append('path').attr('d', cs.lineFunction(_this.ds)).attr('fill', 'none').attr('stroke', cs.palette.lineFill).attr('stroke-width', 3);

    points.enter().append('circle').attr('class', _this.selector).attr('r', 2).on('mouseover', function (d) {
      _this.addTooltip(d, window.event);
    }).on('mouseout', function (d) {
      _this.removeTooltip(d);
    }).attr('cx', function (d) {
      return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
    }).attr('cy', function (d) {
      return cs.y.scale(d.metric);
    });
    return points;
  };
  /**
   * @method transition
   * @param {Object} points (svg element) 
   * @description Runs when a value of an element in dataset is changed
   */
  var transition = function transition(points, path) {
    path.transition().attr('d', cs.lineFunction(_this.ds));

    points.transition().attr('cx', function (d) {
      return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
    }).attr('cy', function (d) {
      return cs.y.scale(d.metric);
    }).attr('cx', function (d) {
      return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
    }).attr('cy', function (d) {
      return cs.y.scale(d.metric);
    });
    return points;
  };

  /**
   * @method exit
   * @param {Object} points (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var exit = function exit(points, path) {
    points.exit().remove();
    path.exit().remove();
    return points;
  };

  /**
   * @method buildScales
   * @description builds the scales for the x and y axes
   */
  var buildScales = function buildScales() {
    cs.y.scale = d3.scaleLinear().domain([_this.min, _this.max]).range([_this.height - cs.x.axisHeight, _this.header]);
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    _this.ds.forEach(function (t) {
      return cs.x.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.x.range.push((_this.width * i - _this.header) / _this.ds.length);
    });
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * @method drawAxis
   * @description draws the x and y axes on the svg
   */
  var drawAxis = function drawAxis() {
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = _this.height - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
  };
  /**
   *
   * Helper Functions
   */
  cs.lineFunction = d3.line().x(function (d) {
    return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
  }).y(function (d) {
    return cs.y.scale(d.metric);
  });

  var points = svgContainer.selectAll('circle').data(this.ds);
  var path = svgContainer.selectAll('path').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);

  buildScales(cs);
  drawAxis(cs);
  enter(points, path);
  transition(points, path);
  exit(points, path);

  svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
  svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ',' + cs.y.yOffset + ')').call(cs.y.axis);
};

export default lineGraph;