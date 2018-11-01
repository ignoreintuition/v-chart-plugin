/* eslint-env browser */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-shape'));
/**
 * Builds a Line Graph.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports lineGraph
 */

const lineGraph = function chart(mode) {
  const svgContainer = d3.select(`#${this.chartData.selector}`);
  let cs = {
    palette: {
      lineFill: '#ffcdcd',
      pointFill: '#005792',
      pointStroke: '#d1f4fa',
    },
    x: {
      domain: [],
      range: [],
      axisHeight: 20,
    },
    y: {
      axisWidth: 30,
      ticks: 5,
    },
  };

  /**
   * @method enter
   * @param {Object} points (svg element) 
   * @description Runs when a new element is added to the dataset
   */
  const enter = (points, path) => {
    if (mode === 'init')
      path.enter()
        .append('path')
        .attr('d', cs.lineFunction(this.ds))
        .attr('fill', 'none')
        .attr('stroke', cs.palette.lineFill)
        .attr('stroke-width', 3);

    points.enter()
      .append('circle')
      .attr('class', this.selector)
      .attr('r', 2)
      .on('mouseover', (d) => {
        this.addTooltip(d, window.event);
      })
      .on('mouseout', (d) => {
        this.removeTooltip(d);
      })
      .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
      .attr('cy', d => cs.y.scale(d.metric));
    return points;
  };
  /**
   * @method transition
   * @param {Object} points (svg element) 
   * @description Runs when a value of an element in dataset is changed
   */
  const transition = (points, path) => {
    path.transition()
      .attr('d', cs.lineFunction(this.ds));

    points.transition()
      .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
      .attr('cy', d => cs.y.scale(d.metric))
      .attr('cx', d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
      .attr('cy', d => cs.y.scale(d.metric));
    return points;
  };

  /**
   * @method exit
   * @param {Object} points (svg element)
   * @description Runs when an element is removed from the dataset
   */
  const exit = (points, path) => {
    points.exit().remove();
    path.exit().remove();
    return points;
  };

  /**
   * @method buildScales
   * @description builds the scales for the x and y axes
   */
  const buildScales = () => {
    cs.y.scale = d3.scaleLinear()
      .domain([this.min, this.max])
      .range([this.displayHeight - cs.x.axisHeight, this.header]);
    cs.y.axis = d3.axisLeft().ticks(cs.y.ticks, 's').scale(cs.y.scale);
    this.ds.forEach(t => cs.x.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.x.range.push(((this.width * i) - this.header) / this.ds.length));
    cs.x.scale = d3.scaleOrdinal().domain(cs.x.domain).range(cs.x.range);
  };
  /**
   * @method drawAxis
   * @description draws the x and y axes on the svg
   */
  const drawAxis = () => {
    cs.x.axis = d3.axisBottom().scale(cs.x.scale);
    cs.x.xOffset = cs.y.axisWidth + 5;
    cs.x.yOffset = this.displayHeight - cs.x.axisHeight;
    cs.y.xOffset = cs.y.axisWidth;
    cs.y.yOffset = 0;
  };
  /**
   *
   * Helper Functions
   */
  cs.lineFunction = d3.line()
    .x(d => cs.x.scale(d.dim) + cs.y.axisWidth + 5)
    .y(d => cs.y.scale(d.metric));

  const points = svgContainer.selectAll('circle').data(this.ds);
  const path = svgContainer.selectAll('path').data(this.ds);

  cs = this.setOverrides(cs, this.chartData.overrides);

  buildScales(cs);
  drawAxis(cs);
  enter(points, path);
  transition(points, path);
  exit(points, path);

  svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', `translate(${cs.x.xOffset}, ${cs.x.yOffset})`)
    .call(cs.x.axis);
  svgContainer.append('g').append('g').attr('class', 'axis').attr('transform', `translate(${cs.y.xOffset},${cs.y.yOffset})`)
    .call(cs.y.axis);

  return cs;
};

export default lineGraph;
