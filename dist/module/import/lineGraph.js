import _Object$assign from 'babel-runtime/core-js/object/assign';
/** 
 *  @fileOverview Line Graph component definition
 *
 *  @author       Brian Greig
 *
 *  @requires     NPM:d3:Vue
 *  @requires     src/v-chart-plugin.js
 */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-shape'));
/**
 * Builds a Line Graph.
 * @module lineGraph
 */

var lineGraph = function chart(mode) {
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
      lineFill: ['#ffcdcd', '#005792'],
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
   * Runs when a new element is added to the dataset
   * @member enter
   * @function
   * @param {Object} points (svg element) 
   */
  var enter = function enter(points, path) {
    _this.metric.forEach(function (e, i) {
      path[i].enter().append('path').attr('d', cs.lineFunction[i](_this.ds)).attr('fill', 'none').attr('id', 'p' + i).attr('stroke', cs.palette.lineFill[i]).attr('stroke-width', 3);
    });
    _this.metric.forEach(function (e, i) {
      cs.offset = i;
      points[i].enter().append('circle').attr('class', _this.selector).attr('class', "r" + i).attr('r', 2).on('mouseover', function (d) {
        _this.addTooltip(d, window.event);
      }).on('mouseout', function (d) {
        _this.removeTooltip(d);
      }).attr('cx', function (d) {
        return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
      }).attr('cy', function (d) {
        return cs.y.scale(d.metric);
      });
    });
    if (_this.goal) _this.generateGoal(cs, svgContainer, true, 0);
    return points;
  };
  /**
   * Runs when a value of an element in dataset is changed
   * @member transition
   * @function
   * @param {Object} points (svg element) 
   */
  var transition = function transition(points, path) {
    _this.metric.forEach(function (e, i) {
      path[i].transition().attr('d', cs.lineFunction[i](_this.ds));
    });

    _this.metric.forEach(function (e, i) {
      cs.offset = i;
      points[i].transition().attr('cx', function (d) {
        return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
      }).attr('cy', function (d) {
        return cs.y.scale(d.metric);
      }).attr('cx', function (d) {
        return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
      }).attr('cy', function (d) {
        return cs.y.scale(d.metric);
      });
    });
    if (_this.goal) _this.generateGoal(cs, svgContainer, true, 0);
    return points;
  };

  /**
   * Runs when an element is removed from the dataset
   * @member exit
   * @function
   * @param {Object} points (svg element)
   */
  var exit = function exit(points, path) {
    _this.metric.forEach(function (e, i) {
      points[i].exit().remove();
    });
    _this.metric.forEach(function (e, i) {
      path[i].exit().remove();
    });
    return points;
  };

  /**
   * Builds the scales for the x and y axes
   * @member buildScales
   * @function
   */
  var buildScales = function buildScales(cs) {
    cs.y.scale = d3.scaleLinear().domain([_this.min, _this.max]).range([_this.displayHeight - cs.x.axisHeight, _this.header]);
    _this.ds.forEach(function (t) {
      return cs.x.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.x.range.push((_this.width * i - _this.header) / _this.ds.length);
    });
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * Draws the x and y axes on the svg
   * @member drawAxis
   * @function
   */
  var drawAxis = function drawAxis(cs) {
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = _this.displayHeight - cs.x.axisHeight;
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ',' + cs.y.yOffset + ')').call(cs.y.axis);
  };

  cs.lineFunction = [];
  this.metric.forEach(function (e, i) {
    cs.lineFunction.push(d3.line().x(function (d) {
      return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
    }).y(function (d) {
      return cs.y.scale(d.metric[i]);
    }));
  });

  var points = [];
  this.metric.forEach(function (e, i) {
    points.push(svgContainer.selectAll('circle.r' + i).data(_this.ds.map(function (d) {
      return {
        metric: d.metric[i],
        dim: d.dim
      };
    })));
  });

  var path = [];
  this.metric.forEach(function (e, i) {
    path.push(svgContainer.selectAll('path#p' + i).data(_this.ds));
  });

  cs = this.setOverrides(cs, this.chartData.overrides);

  buildScales(cs);
  drawAxis(cs);
  enter(points, path);
  transition(points, path);
  exit(points, path);

  return cs;
};

export default lineGraph;