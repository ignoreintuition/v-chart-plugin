/* eslint-env browser */
const d3 = Object.assign({},
  require('d3-selection'),
  require('d3-scale'),
  require('d3-axis'),
  require('d3-ease'));
/**
 * Builds an Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports barChart
 */

const barChart = function chart() {
  const svgContainer = d3.select(`#${this.chartData.selector}`);
  const cs = {
    pallette: {
      fill: '#005792',
      stroke: '#d1f4fa',
    },
    bar: {
      hPadding: 8,
      vPadding: 5,
    },
    x: {
      axisHeight: 10,
      ticks: 5,
    },
    y: {
      domain: [],
      range: [],
      axisWidth: 30,
    },
  };
    /**
     *
     * Helper Functions
     */
  const getWidth = d => cs.x.scale(d.metric);

  const getHeight = () => (
    this.height - cs.x.axisHeight - this.header - cs.bar.vPadding) / this.ds.length - 1;

  const getYCoord = (d, i) => i * (
    this.height - cs.x.axisHeight - this.header) / this.ds.length + 1 + this.header;

  const mouseOver = (d) => {
    this.addTooltip(d, window.event);
  };

  const mouseOut = (d) => {
    this.removeTooltip(d);
  };
    /**
     * @method enter
     * @param {Object} rect (svg element)
     * @description Runs when a new element is added to the dataset
     */
  const enter = (rects) => {
    rects.enter()
      .append('rect')
      .attr('fill', cs.pallette.fill)
      .attr('stroke', cs.pallette.stroke)
      .attr('class', this.selector)
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('y', getYCoord)
      .attr('x', cs.y.axisWidth + cs.bar.hPadding)
      .on('mouseover', mouseOver)
      .on('mouseout', mouseOut);
    return rects;
  };
    /**
     * @method transition
     * @param {Object} rect (svg element)
     * @description Runs when a value of an element in dataset is changed
     */
  const transition = (rects) => {
    rects.transition()
      .attr('width', getWidth)
      .attr('height', getHeight)
      .attr('y', getYCoord)
      .attr('x', cs.y.axisWidth + cs.bar.hPadding);
    return rects;
  };
    /**
     * @method exit
     * @param {Object} rect (svg element)
     * @description Runs when an element is removed from the dataset
     */
  const exit = (rects) => {
    rects.exit().remove();
    return rects;
  };
    /**
     * @method buildScales
     * @description builds the scales for the x and y axis
     */
  const buildScales = () => {
    cs.x.scale = d3.scaleLinear()
      .domain([0, this.max])
      .range([0, this.width - cs.bar.hPadding - cs.y.axisWidth]);
    this.ds.forEach(t => cs.y.domain.push(t.dim));
    this.ds.forEach((t, i) => cs.y.range.push(((
      this.chartData.height - cs.x.axisHeight - this.header + cs.bar.vPadding) * i) / this.ds.length));
    cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);
  };
    /**
     * @method drawAxis
     * @description draws the x and y axis on the svg
     */
  const drawAxis = () => {
    cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, 's').scale(cs.x.scale);
    cs.y.axis = d3.axisLeft().scale(cs.y.scale);
    cs.x.yOffset = this.height - cs.x.axisHeight;
    cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;
    cs.y.yOffset = cs.bar.vPadding + this.header - 1;
    cs.y.xOffset = cs.y.axisWidth;
    svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.y.xOffset}, ${cs.y.yOffset})`).call(cs.y.axis);
    svgContainer.append('g').attr('class', 'axis').attr('transform', `translate(${cs.x.xOffset}, ${cs.x.yOffset})`).call(cs.x.axis);
  };

  const rects = svgContainer.selectAll('rect').data(this.ds);

  buildScales(cs);
  drawAxis(cs);
  enter(rects);
  transition(rects);
  exit(rects);
};

export default barChart;
