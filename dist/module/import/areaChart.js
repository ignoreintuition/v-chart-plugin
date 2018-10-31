import _Object$assign from 'babel-runtime/core-js/object/assign';
/* eslint-env browser */
var d3 = _Object$assign({}, require('d3-selection'), require('d3-scale'), require('d3-axis'), require('d3-shape'));
/**
 * Builds an Area Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports areaChart
 */
var areaChart = function chart() {
  var _this = this;

  var svgContainer = d3.select('#' + this.chartData.selector);
  var cs = {
    palette: {
      stroke: '#d1f4fa',
      fill: '#005792'
    },
    x: {
      domain: [],
      range: [],
      axisHeight: 45,
      axisWidth: 45
    },
    y: {
      axisWidth: 45
    }
  };
  /**
   * @method getPoints
   * @param {Object} p
   * @description Returns plot points  
   */
  var getPoints = function getPoints(p) {
    var poly = ' ' + _this.width + ', ' + cs.x.yOffset + ' ';
    poly += ' ' + cs.x.axisHeight + ', ' + cs.x.yOffset + ' ';
    poly += p.map(function (d) {
      return [cs.x.scale(d.dim) + cs.y.axisWidth + 5, cs.y.scale(d.metric)].join(',');
    }).join(' ');
    return poly;
  };

  var poly = svgContainer.selectAll('polygon').data([this.ds]);

  /**
   * @method enter
   * @param {Object} s (svg element)
   * @description Runs when a new element is added to the dataset
   */
  var enter = function enter(s) {
    s.enter().append('polygon').attr('stroke', cs.palette.stroke).attr('fill', cs.palette.fill).attr('points', getPoints);
  };
  /**
   * @method transition
   * @param {Object} s (svg element)
   * @description Runs when a value of an element in dataset is changed
   */
  var transition = function transition(s) {
    s.transition().attr('points', getPoints);
  };
  /**
   * @method exit
   * @param {Object} s (svg element)
   * @description Runs when an element is removed from the dataset
   */
  var exit = function exit(s) {
    s.exit().remove();
    return s;
  };
  /**
   * @method buildScales
   * @description builds the scales for the x and y axes
   */
  var buildScales = function buildScales() {
    cs.y.scale = d3.scaleLinear().domain([0, _this.max]).range([_this.displayHeight - cs.x.axisHeight, _this.titleHeight]);
    cs.y.axis = d3.axisLeft().ticks(10, 's').scale(cs.y.scale);
    _this.ds.forEach(function (t) {
      return cs.x.domain.push(t.dim);
    });
    _this.ds.forEach(function (t, i) {
      return cs.x.range.push((_this.width - cs.x.axisWidth) * i / _this.ds.length);
    });
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
  };
  /**
   * @method drawAxis
   * @description draws the x and y axes on the svg
   */
  var drawAxis = function drawAxis() {
    cs.polyFunction = d3.line().x(function (d) {
      return cs.x.scale(d.dim) + cs.y.axisWidth + 5;
    }).y(function (d) {
      return cs.y.scale(d.metric);
    });
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = _this.displayHeight - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
    svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
    if (_this.ds[0].dim) svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ',' + cs.y.yOffset + ')').call(cs.y.axis);
  };
  cs = this.setOverrides(cs, this.chartData.overrides);
  buildScales(cs);
  drawAxis(cs);
  enter(poly);
  transition(poly);
  exit(poly);

  return cs;
};

export default areaChart;